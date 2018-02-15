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
    // These can be part of the config object or the request object
    region  : "us-east-1",
    service : "service",
    
    method : "GET",
    url    : "https://my.aws.url.that.i.need.to.hit/look/it-has/a-path-in-it-as-well",
    
    // Headers are optional
    headers : {
        // Single header value
        "X-Amz-Date" : "20150830T123600Z",
        
        // Multiple headers
        "X-Multiple" : [ "one", "two", "three" ]
    }
    // Body is optional, should be a string
    body : "..."
};

const signed = sign(request, config);
```

## 🛁 What?

Supports query params, date overrides via `X-Amz-Date` or `Date` headers, multiple header values, and probably some other features.

Tested against API Gateway so far. Your results may vary for other services, S3 seems especially fraught with peril. 💀
