# Local Development
To support local HTTPS development on localhost, the following commands are used.

According to [this article](https://learn.microsoft.com/en-us/azure/application-gateway/self-signed-certificates), use the following commands to generate a root CA.

```bash
cd ssl
openssl ecparam -out contoso.key -name prime256v1 -genkey
# Leave default values...
openssl req -new -sha256 -key contoso.key -out contoso.csr
openssl x509 -req -sha256 -days 365 -in contoso.csr -signkey contoso.key -out contoso.crt
```
Then according to [this article](https://claytonerrington.com/blog/securing-jekyll-with-ssl-locally/), create server certificates.

```bash
# `-CA  contoso.crt -CAkey contoso.key -CAcreateserial` is added as copied from the first article by microsoft. This is done so the server certificate will be signed by the root CA.
openssl req -x509 -CA  contoso.crt -CAkey contoso.key -CAcreateserial -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth") -days 365
```

Now just add the root certificate to chrome

Chrome -> Settings -> Privacy and security -> Security -> Manage certificates -> Authorities -> Import -> Choose 'contoso.crt' -> Check 'Trust this certificate for identifying websites'.

Now, [start working](https://localhost/Blog/).
