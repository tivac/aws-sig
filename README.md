# 🔏 aws-sig

Teeny-tiny library for signing requests to Amazon Web Services using the [signature v4 signing algorithm](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).

## 🙋 Why?

I wanted something small. Really, really small. Couldn't find a small AWS v4 signing library that worked in a browser using rollup for bundling so... here we are. ¯\\_(ツ)\_/¯

## ⚙️ How?

```js
import sign from "aws-sig";

const config = {
    accessKeyId     : "AKIDEXAMPLE",
    secretAccessKey : "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",

    // sessionTokens are optional, but correctly supported
    sessionToken    : "..."
};

const request = {
    method  : "GET",
    region  : "us-east-1",
    service : "service",
    url     : "https://my.aws.url.that.i.need.to.hit/look/it-has/a-path-in-it-as-well",
    headers : {
        // ...
    }
    body : // ...
};

const signed = sign(request, config);
```

## 🛁 What?

Supports query params, date overrides via `X-Amz-Date` or `Date` headers, and probably some other features.
