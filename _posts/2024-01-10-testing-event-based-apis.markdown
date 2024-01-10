---
layout: post
title:  "Testing Event Based APIs"
date:   2024-01-10 09:00:00 +0200
categories: jekyll update TIL
---
When writing Unit Tests or Integration Tests for an API that exposes events, we need a way to validate that the events are called.
The simplest approach would be to set a variable when the event is called. In the test itself we can sleep for a certain duration and check the variable:

```csharp
public class Tests
{
    [Test]
    public void TestSubscription()
    {
        var flag = false;
        using var watcher  = _api.SubscribeToEvent(_ =>
        {
            flag = true;
        });

        Task.Delay(2000).Wait()
        Assert.That(flag);
    }
}
```

But this is not ideal. Firstly, if we set a low sleep value, the tests will sometimes fail based on latency and load on the machine. But then if we try to fix this by setting a high sleep duration, our test suite will become much much slower.

Instead, the better approach would be to use a synchronization mechanism like an AutoResetEvent. This allows us to wait until the event occurs. We can then set a high timeout in order to support edge cases and delays, but complete the test in a short time in 99% of the cases.

```csharp
public class Tests
{
    [Test]
    public void TestSubscription()
    {
        var watchEvent = new AutoResetEvent(false);
        using var watcher  = _api.SubscribeToEvent(_ =>
        {
            watchEvent.Set();
        });

        Assert.That(watchEvent.WaitOne(2000));
    }
}
```