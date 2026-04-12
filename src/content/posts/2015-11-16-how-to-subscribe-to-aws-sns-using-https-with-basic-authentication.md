---
title: "How to subscribe to AWS SNS using HTTPS with Basic Authentication"
slug: "2015/11/16/how-to-subscribe-to-aws-sns-using-https-with-basic-authentication"
date: 2015-11-16
categories:
  - "Professional"
tags:
  - "aws"
---

[Amazon Web Services (AWS)](https://aws.amazon.com) provides a [Simple Notification Service (SNS)](https://aws.amazon.com/sns/) that allows you to publish messages to a topic that multiple subscribers can consume. One type of subscriber that SNS offers is [an HTTPS endpoint](http://docs.aws.amazon.com/sns/latest/dg/SendMessageToHttp.html) with optional [basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). Sounds straightforward, right? Here’s what I thought I would need to do going in:

1.  Buy a domain
2.  Buy an SSL certificate
3.  Build an endpoint with basic auth that handled the subscription confirmation request
4.  Create the SNS Subscription

Here’s what I discovered along the way:

1.  You need to bundle your SSL certificate
2.  You need to specify a `realm` in your `WWW-Authenticate` header
3.  You need to create the subscription again and again instead of requesting confirmations for an existing subscription that is pending confirmation
4.  You need to override the `Content-Type` header for Hapi.js

## What I thought I would need to do

This should be relatively easy.

### Buy a domain

No surprises here. Any domain from any registrar should do.

### Buy an SSL certificate

AWS only trusts [a specific set of Certificate Authorities (CA)](http://docs.aws.amazon.com/sns/latest/dg/SendMessageToHttp.https.ca.html). Luckily, the very cheap [Comodo PositiveSSL](https://www.ssls.com/ssl-certificates/comodo-positivessl) is trusted ($9 at the time of writing). \[code lang="text"\] comodoaaaca, Apr 22, 2014, trustedCertEntry, Certificate fingerprint (SHA1): D1:EB:23:A4:6D:17:D6:8F:D9:25:64:C2:F1:F1:60:17:64:D8:E3:49 \[/code\] This was my first time purchasing an SSL cert, and [SSLs.com](https://www.ssls.com) made it easy. At the end of the process, I was emailed a ZIP file containing four files:

1.  AddTrustExternalCARoot.crt
2.  COMODORSAAddTrustCA.crt
3.  COMODORSADomainValidationSecureServerCA.crt
4.  example_com.crt

`example_com.crt` looked like what I needed so I uploaded it to AWS using [their CLI](http://docs.aws.amazon.com/cli/latest/reference/iam/upload-server-certificate.html) along with the PEM I created during the SSLs.com process. \[code lang="text"\] aws iam upload-server-certificate \\ --server-certificate-name example \\ --certificate-body file://example_com.crt \\ --private-key file://example_com.pem \[/code\]

### Build an endpoint

To build an endpoint with basic authentication, I chose [Hapi.js](http://hapijs.com) and its [hapi-auth-basic](https://github.com/hapijs/hapi-auth-basic) plugin. _If you want to skip ahead to a working end result, [here is the example repository on GitHub](https://github.com/maxbeatty/example-aws-sns-https-auth-hapi/)_ Defining dependencies, a server, an authentication scheme, payload validation, and a route to handle the SNS subscription confirmation request is [just over 100 lines of code](https://github.com/maxbeatty/example-aws-sns-https-auth-hapi/commit/fee6fcd39105a0a12d948bddb236bb06645c1e76). `npm start` and I was up and running. _Deploying this server is beyond the scope of this post. I used [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) which comes into play when configuring HTTPS and reading logs. If you’ve read this far into a post like this, I trust you can get your deployment configured accordingly._ At this point, I bought a domain, an SSL cert, deployed my Node.js app, and configured my DNS records for the domain to point at the deployed app. Because I deployed to Elastic Beanstalk and had uploaded my certificate, [configuring HTTPS through the AWS’ console](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/configuring-https-elb.html) was easy.

### Create the SNS Subscription

_I already had an SNS Topic created. You can [use the AWS CLI to quickly create your own](http://docs.aws.amazon.com/cli/latest/reference/sns/create-topic.html): `aws sns create-topic --name example_topic`. You’ll need the ARN for the subscription._ I _thought_ I had completed all of the prerequisites for creating an HTTPS Subscription with Basic Authentication. It should have been one painless command: \[code lang="text"\] aws sns subscribe \\ --topic-arn $ARN_FROM_CREATE_TOPIC \\ --protocol https \\ --notification-endpoint https://alice:example@example.com/sns \[/code\] Instead of receiving the subscription’s ARN, “Pending Confirmation” was returned. This began a long and frustrating debugging adventure.

## What I discovered along the way

“Pending Confirmation” wasn’t right, so now what?

### You need to bundle your SSL certificate

One feature of Elastic Beanstalk that I really like is the automatic configuration of a load balancer. You can easily auto-scale multiple instances of your app and have requests routed through an automatically configured instance of nginx. A hidden benefit of this setup is that you get access logs from nginx _and_ logs from your app. (Elastic Beanstalk also manages logging for you!) When my subscription wasn’t immediately successful, I went to the logs. Problem: no requests were logged. I [`curl`](http://curl.haxx.se/docs/manpage.html)’d my endpoint to verify. \[code lang="text"\] curl -X POST https://alice:example@example.com/sns {“statusCode”:400,”error”:”Bad Request”,”message”:”\\”value\\” must be an object”,”validation”:{“source”:”payload”,”keys”:\[“value”\]}} \[/code\] My request was reaching the server, but the SNS Subscription Confirmation request wasn’t. After some searching and browsing forums, it sounded like my SSL certificate could be to blame. (Remember AWS won’t deliver messages to untrusted CAs) Thankfully, I found [this helpful gist](https://gist.github.com/bradmontgomery/6487319) explaining how to combine the CRT files I received into a bundle. \[code lang="text"\] cat example_com.crt COMODORSADomainValidationSecureServerCA.crt COMODORSAAddTrustCA.crt AddTrustExternalCARoot.crt &gt; ssl-bundle.crt \[/code\] I turned off HTTPS on Elastic Beanstalk, deleted the previous certificate from AWS, uploaded this new bundled certificate to AWS, and turned HTTPS back on for my app in Elastic Beanstalk. Then, I requested confirmation for my SNS subscription through the AWS Console. The logs now showed a request from “Amazon Simple Notification Service Agent” with a response status code of 401!

### You need to specify a `realm` in your `WWW-Authenticate` header

It’s not clear from AWS’ documentation, but what I gleaned from their forums is that SNS makes two requests when confirming an authenticated endpoint. The first request sends no authentication header. The second request includes your configured authentication. I was only seeing the first request and not the retry. Again, I dug through the AWS forums and found [this](https://forums.aws.amazon.com/message.jspa?messageID=668732#668732).

> Your server must respond with **both** status 401 and `WWW-Authenticate: Basic realm=“foo”` for SNS to retry with auth provided.

I knew I was sending 401 from the nginx logs, but what about that `WWW-Authenticate` header? By adding the verbose argument to an unauthenticated `curl` request, I was able to inspect the current state of my response headers (trimmed for clarity). \[code lang="text"\] curl -v -X POST https://example.com/sns &lt; HTTP/1.1 401 Unauthorized &lt; WWW-Authenticate: Basic &lt; content-type: application/json; charset=utf-8 \[/code\] No realm. [What is a realm?](http://stackoverflow.com/a/12701105/613588) How could I set one? Who was setting that `WWW-Authenticate` header? How is the 401 response generated? It was time to start reading the source code of my dependencies.

#### How is the 401 response generated?

hapi-auth-basic replies with a `Boom.unauthorized` error when there is no authorization header \[[source](https://github.com/hapijs/hapi-auth-basic/blob/b82ff0862dc6f26fc75cb9849cd2f465ecdd52b1/lib/index.js#L39)\]

#### Who was setting that `WWW-Authenticate` header?

Boom sets the `WWW-Authenticate` header \[[source](https://github.com/hapijs/boom/blob/dbcbee5d4fe99f9e5f976f9b2d2ebc72e603354b/lib/index.js#L157)\]

#### How could I set one?

`Boom.unauthorized` allows you to pass an optional attributes object whose keys and values are joined with an equals sign \[[source](https://github.com/hapijs/boom#boomunauthorizedmessage-scheme-attributes)\] If I could specify `realm` as a key in those attributes, my response header should look like that one random forum comment and maybe get me closer to successfully subscribing with my endpoint.

#### Contributing to Open Source

Not all contributions are groundbreaking as you can see by [my PR](https://github.com/hapijs/hapi-auth-basic/pull/46/files#diff-6d186b954a58d5bb740f73d84fe39073R39). The Hapi community is very welcoming and helpful. If you’re looking to dip your toe in the water, I highly suggest checking out their projects. While waiting on a new version to be published, [I used my fork of hapi-auth-basic and added logging to inspect request headers before authentication](https://github.com/maxbeatty/example-aws-sns-https-auth-hapi/commit/87191dcca679292041b07187e8d1cce4415cc216). Again, I requested confirmation for my SNS subscription through the AWS Console. This time, I saw both requests, but _both_ were responding with an unauthorized error (i.e. 401).

### You need to create the subscription again

The second request _should_ have authenticated successfully. My scheme is as simple as it gets, comparing the username and password to hard-coded values, so [I added more logging to make sure I was getting the right credentials](https://github.com/maxbeatty/example-aws-sns-https-auth-hapi/commit/d3996176fe449de72a610f576517d5c95aca5d17). Once more, I requested confirmation for my SNS subscription through the AWS Console. I did this a few more times because I couldn’t believe what I was seeing in the logs. \[code lang="text"\] 151115/165554.290, \[log,debug\], data: {&quot;username&quot;:&quot;alice&quot;,&quot;password”:”\*\*\*\*”} \[/code\] Those stars (“\*\*\*\*”) aren’t me holding back my example password. AWS was using obfuscated credentials for the authenticated call. It became crystal clear why the second “authenticated” request was being denied. The AWS Console displayed the subscription endpoint with the password obfuscated so I guessed they were retrying with that value directly. Inspecting the network request that was made after clicking “Request confirmations” in the browser mostly proved this to be true. Here’s the simplified request: \[code lang="text"\] curl 'https://console.aws.amazon.com/sns/v2/Subscribe' \\ —data-binary ‘{\\ “topicArn”:”arn:aws:sns:us-east-1:0123456789:example”,\\ ”endpoint”:”https://alice:\*\*\*\*@example.com/sns”,\\ ”protocol”:”https”\\ }’ \[/code\] Again, those stars are literal values. I didn’t know what else to do but create a duplicate subscription. Doing so passed the correct credentials on the second request and the logs showed a response code of … _415_!?

### You need to override the `Content-Type` header for Hapi.js

I’ll admit this is about the point where I stopped caring about completely understanding what exactly was going wrong and just wanted to make this work. I knew this [415 Unsupported Media Type error](https://github.com/hapijs/boom#boomunsupportedmediatypemessage-data) wasn’t coming from hapi-auth-basic or my code so it must be coming from within hapi itself. Instead of diving into hapi’s source, I started searching for other people befuddled by a 415 response and found [this discussion](https://github.com/hapijs/discuss/issues/91#issuecomment-76185262).

> Probably has something to do with the `Content-Type` header

Because I was already logging the headers to debug the auth, I could see that Amazon was specifying `text/plain` as the `Content-Type` header. When I was debugging the `WWW-Authenticate` header, I noticed the `Content-Type` of the response was `application/json`. I thought maybe I could “sudo make request like response” and, sure enough, [Hapi’s route options](http://hapijs.com/api#route-options) allowed overriding the payload `Content-Type` header. Push [the change](https://github.com/maxbeatty/example-aws-sns-https-auth-hapi/commit/575e9b7847404b529dc390a4c88164db8b6318b4), create the subscription again, check the logs, and _finally_ a successful confirmation. When I refreshed the AWS Console, the Subscription ARN changed from “PendingConfirmation” to an actual ARN. `arn:aws:sns:us-east-1:0123456789:example-topic:long-uuid-looking-thing`

## Conclusion

I hope this helps someone else out there (including future me). If you have questions about the code, please [open an issue](https://github.com/maxbeatty/example-aws-sns-https-auth-hapi/issues).
