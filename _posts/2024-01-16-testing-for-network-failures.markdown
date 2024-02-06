---
layout: single
title: Testing for Network Failures
categories: 
---

I am currently in the process of developing a wrapper library around [etcd](https://etcd.io/), which will allow microservices in my company to access a shared runtime configuration. The wrapper will allow us to keep seperation of concerns so that each microservice does not rely on the database implementation or any any specific structure of the keys in etcd. In addition, the library exposes a fully typed API for teams that require the use of the shared state.

Beyong basic CRUD operations, I need to support subscribing for changes. This way, a microservice can subscribe to a certain value. Once the value changes, the service can immediately react. This is a bit challanging because we need to take into account possible network issues. What happens if a network fault occurs while a service is subscribed for a value? Maybe at this exact moment another service was able to update the value.. We need to make sure that the update will reach our subscribed service.

I won't go into the implementation of the library itself. The idea behind the implementation of the subscription mechanism is as follows.
```csharp
while (!_token.IsCancellationRequested)
{
    WatchRequest request = new WatchRequest()
    {
        CreateRequest = new WatchCreateRequest()
        {
            Key = ByteString.CopyFromUtf8(_key)
        }
    };
    var watchTask = _etcd.WatchAsync(request, OnValue, cancellationToken: _cancellationTokenSource.Token);
    
    watchTask.Wait();
    
    if (watchTask.IsFaulted)
    {
        _logger.Log(LogLevel.Error, watchTask.Exception, "Watch task failed");
    }

    Task.Delay(_interval).Wait();
}
```

We basically, loop around starting a connection to etcd and receiving updates until the connection closes for any reason.

I brainstormed a bit on how to test this properly. As I have stated, my motivation here is to test for network failures. One approach would be to access the operating system's firewall and block etcd's port while watching for a certain value. This is pretty coupled to the operating system, which may change. In addition, I am not sure container runtimes allow it. Otherwise, this is a valid approach.

I have decided to implement the test by creating a port forward mechanism. The idea is to start the test by setting up a TCP server that will listen to incoming connections, for each of them, will open a new connection to etcd. The server will proxy the data between the two. This way I can then close the socket or let it hang and assert the behavior of the wrapper library.

Here is the implementation of the port forward.

```csharp
private async Task Run()
{
    var listener = new TcpListener(_srcEndpoint);
    try
    {
        listener.Start();

        while (!_token.IsCancellationRequested)
        {
            var client = await listener.AcceptTcpClientAsync(_token);
            Handle(client);
        }
    }
    finally
    {
        listener.Stop();
    }
}

private async Task Handle(TcpClient client)
{
    using var _ = client;

    using var forwardClient = new TcpClient();
    await forwardClient.ConnectAsync(_dstEndpoint, _token);

    await using var clientStream = client.GetStream();
    await using var forwardStream = forwardClient.GetStream();

    await Task.WhenAny(
        ForwardDataAsync(clientStream, forwardStream),
        ForwardDataAsync(forwardStream, clientStream)
    );
}

private async Task ForwardDataAsync(Stream sourceStream, Stream destinationStream)
{
    byte[] buffer = new byte[4096];
    int bytesRead;

    while ((bytesRead = await sourceStream.ReadAsync(buffer, _token)) > 0 && !_token.IsCancellationRequested)
    {
        await destinationStream.WriteAsync(buffer.AsMemory(0, bytesRead), _token);
    }
}
```

Let's see how this is used in our test itself.

```csharp
_portForward.Start();

var client = new EtcdClient($"https://localhost:2379");
var proxied = new EtcdClient($"https://localhost:{_portForward.SrcPort}");
var wrapper = Wrapper(proxied);

var watchEvent = new AutoResetEvent(false);
using var watcher  = wrapper.GetKey("test.key").Watch(_ =>
{
    _logger.Log(LogLevel.Trace, "Got event.");
    watchEvent.Set();
});

_portForward.Stop();

client.Put(key.Key, SerializerHelper.Serialize(original));

_portForward.Start();

Assert.That(watchEvent.WaitOne(5000));

_portForward.Stop();
```

Notice that we have two clients. `client` and `proxied`. We use the `proxied` client to simulate a client that experiences a network issue by connection through the port forward. We use the `client` in order to push values to etcd even when the port forward is down.

In addition, `AutoResetEvent` is used to test whether an event was received. Check [this post]({{ site.baseurl }}{% link _posts/2024-01-10-testing-event-based-apis.markdown %}) for more details on it.

I was able to spot some issues with the implementation of the library by testing network edge cases this way. Note that this method does not cover more violent network issues. By using the socket api for the port forward, there is no real way to just drop the connection. When closing the socket, the OS will handle closing the connection by sending FIN packet to the other side for you. Lower level mechanisms need to be used in order to simulate these scenarios. For now, this is enough for what I was aiming for.