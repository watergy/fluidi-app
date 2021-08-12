var fs = require("fs");
let express = require("express");
let app = express();
let https = require("https");
let http = require("http");
var Gun = require("gun");

let stream = require("./ws/stream");
let path = require("path");

var config = {};

const SSL_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/9M9POTSZEl+0
09XR9StmuAAi3NKayzbgLbrt5Go+S6ii91fhmPzunJBjaJF1hmUHp9mNfC7yEwLS
g7qucWivNjxuMCsYoxQEdwzMqHSSgmtcEYMwyCoW1/RXpcyp+xc8zi/W9+03sEFa
OeuJAG8OiGPihR8zx6P1PHYE0rEjIEWd27cH6jFLgHPFlnM514ewmPfTQ07KStrv
kpt67WAO1nnvDwmAN5H3px/CI+b3eheH+EnAcKR6fzJxgrzXvXbBFYWp2DyxbfTQ
/GcykA2/tL2tz71KbNKuwjuBO4pOyKUTqtdCp1lWm+wGB2uBq8ea1oY+7GfJEFO9
emDbFyEzAgMBAAECggEBAJvQzs8SMn3mikWwhqpNhxN0XLfv5Ay+1CaZOFmOxicX
JyZR/MYld3sBH7tx0FFD7JKQT2on2buqbuoO/+RGLqG7NsaC1xjCl6cgNAWU4Dtl
Hly34nQgpvmwBql27nE0XqJ/BBpNWgOQURw6U9T7wypa0Cm5waA4eADDOVGk7SEC
0nv9GkMvkOGfLou311b+9QyfU9PNhEzr1OxmvHcG4ti9nq4sS/7GMw5yx1Ct5rfe
DsK2ToWjbNgIUBxgYkxV1KhTbulq8rd926y3T8CaXGeV2bYfYvRj4ubFoz0KSsP+
uAtlftGv0pPMgTmejeUb61ys0ihvoyA8ZXMVbN44+iECgYEA7bWvSrimAaNmuG9s
amUJdeOzX7mdnS8ByvKrR7IIa4MhMNfZuZTOjT/hZ6phTzhVg7l4PeDr2kGBfktA
Hjna7l1xK6HlQikECDZdDtZn5xfRZVju16er21Yhrg1mpN4xqCUXgmASAbNmHoWK
ds5vmMEuIQz0n3DZwgspCF7TDmsCgYEAzrnkRIBrSjRnsFTfZtHAqZlJ9JhWL5kI
W7O9iyLMmLEqBd10/wVqG1d9i/Uz3ZA14Qn234ievCxvamJy8MleDrT3yhp1I4B9
d0Aq2VFqWkCqN8WzSB0pqgBNHk5u8hgzmyWyYQGUnoXyXAeFElNi6M95ahtynwcN
fl0UZPhQ2lkCgYBK08RoSxPGtD8jk7+XBlMiDxlp6q4YyrFPx2/vU7We0lpiW7An
4RXcFN3JmjKjk2In4vxczi6wN6qhrOJ0IVYvbq6vQ3k9iFfClgpZH1j5v9+kfYhB
zoAkvUpA1esXvvH2siZiXgeNDYH53aOmnnk2pqj0snVWs1l44bZ68g6SHQKBgFq4
CQxmrq6pwLcJB+C/O6Uxt9q231uT9K8JeayNYOvBE4fvX2Bqp93HzziUKmaY2owf
K099TOuXNG2jNn2kYLpjgDoY0j76LBUg+6zSpbFln01KXRrQcXBBIZajJNzo8fyr
1lPrtaS7c1gflK4uGcHBCq8dzHctSSajAkgtEI5BAoGAR8CUCazgU/+G3zGX2NJk
BH5kHjNHdLodj7oQojBSY8QAcyfGLMlQlgD4LGZ/Y8mEA33RadCsAliZBXKuSAsI
extfYzQQV/qMxEcqLRpY0PR+QKLhQLFTV3I9mMMZXFGd7keGFcQ6qtLZWtO8Xxxk
dZ+SiCBIfXH+jbXvczcxo7Y=
-----END PRIVATE KEY-----`;

const SSL_CERT = `-----BEGIN CERTIFICATE-----
MIIDaDCCAlCgAwIBAgIJAISW0hP2FlK4MA0GCSqGSIb3DQEBCwUAMEkxCzAJBgNV
BAYTAk5MMRYwFAYDVQQIDA1Ob29yZC1Ib2xsYW5kMRIwEAYDVQQHDAlBbXN0ZXJk
YW0xDjAMBgNVBAoMBUd1bkRCMB4XDTIwMDMyNzE2MjgxMVoXDTIwMDQyNjE2Mjgx
MVowSTELMAkGA1UEBhMCTkwxFjAUBgNVBAgMDU5vb3JkLUhvbGxhbmQxEjAQBgNV
BAcMCUFtc3RlcmRhbTEOMAwGA1UECgwFR3VuREIwggEiMA0GCSqGSIb3DQEBAQUA
A4IBDwAwggEKAoIBAQC/9M9POTSZEl+009XR9StmuAAi3NKayzbgLbrt5Go+S6ii
91fhmPzunJBjaJF1hmUHp9mNfC7yEwLSg7qucWivNjxuMCsYoxQEdwzMqHSSgmtc
EYMwyCoW1/RXpcyp+xc8zi/W9+03sEFaOeuJAG8OiGPihR8zx6P1PHYE0rEjIEWd
27cH6jFLgHPFlnM514ewmPfTQ07KStrvkpt67WAO1nnvDwmAN5H3px/CI+b3eheH
+EnAcKR6fzJxgrzXvXbBFYWp2DyxbfTQ/GcykA2/tL2tz71KbNKuwjuBO4pOyKUT
qtdCp1lWm+wGB2uBq8ea1oY+7GfJEFO9emDbFyEzAgMBAAGjUzBRMB0GA1UdDgQW
BBRhWi6C+uCg3fPj6WwR6aGziFa3MDAfBgNVHSMEGDAWgBRhWi6C+uCg3fPj6WwR
6aGziFa3MDAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQCPzBgV
wnS+PvMdyixQ6C0YOJp401dTfiU3DNMkWEpjXPOASblBKhLW7MuX0DKg6MHIAIZt
fd60/nf8HTEBDjmumJBx/Yx/4CAfNUpSISaBjsI7qEIgcNs2LMFo/X92Z2nwom3L
+6hF3OgaIYvCWpkG5UfovwIDxziFzzfGx598k75VB7416kOLtyQ7YTYf4szAQDJB
v69K2J2vRFwhPtzRmOxWdrnGf7gR4iElVfY46aLxP23xb9VIpzUPt6usU7Jww8Oy
e/aCp1UOiJrxjP5DYNwIp9f0R/6zFQZna2YPF0gtdiBnTuNp+4u1sZBqh0YbN8vW
1Q7IgacAwUKJ5SKF
-----END CERTIFICATE-----`;

config.options = {
  key: SSL_KEY,
  cert: SSL_CERT,
};

config.port = process.env.PORT || 443;
config.gunport = process.env.GUNPORT || 8765;

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/:room", function (req, res) {
  res.redirect("/?room=" + req.params.room);
});

if (!process.env.SSL) {
  config.webserver = http.createServer({}, app);
  config.webserver.listen(config.port, () =>
    console.log(`Meething HTTP app listening on port ${config.port}!`)
  );
} else {
  config.webserver = https.createServer(config.options, app);
  config.webserver.listen(config.port, () =>
    console.log(`Meething HTTPS app listening on port ${config.port}!`)
  );
}
