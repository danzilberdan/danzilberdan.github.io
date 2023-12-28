#!/bin/bash

mkdir ssl
pushd ssl

openssl ecparam -out contoso.key -name prime256v1 -genkey
# Leave default values...
openssl req -new -sha256 -key contoso.key -out contoso.csr
openssl x509 -req -sha256 -days 365 -in contoso.csr -signkey contoso.key -out contoso.crt

# `-CA  contoso.crt -CAkey contoso.key -CAcreateserial` is added as copied from the first article by microsoft. This is done so the server certificate will be signed by the root CA.
openssl req -x509 -CA  contoso.crt -CAkey contoso.key -CAcreateserial -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth") -days 365

popd