---
title: "Finding Amazon S3 Region IP Ranges"
slug: "2012/06/07/finding-amazon-s3-region-ip-ranges"
date: 2012-06-08
categories:
  - "Professional"
tags:
  - "aws"
---

I wanted to find the IP ranges for all of Amazon's US-based S3 regions. After a lot of searching through outdated forums, I found out how to get the ranges directly from the source.  The Amazon Simple Storage Service (S3) is broken up into buckets that are stored in different regions. Currently, there are [three US regions documented](http://docs.amazonwebservices.com/AmazonS3/latest/dev/LocationSelection.html#HowtoSpecifyaBucketsRegion). I had to search for their actual hosts names which are [documented in the AWS Java SDK](http://docs.amazonwebservices.com/AWSJavaSDK/latest/javadoc/com/amazonaws/services/s3/model/Region.html#US_Standard).

- s3.amazonaws.com
- s3-us-west-1.amazonaws.com
- s3-us-west-2.amazonaws.com

To find each region's IP range, I used two basic command line tools- `host` and `whois`. Host is a DNS lookup utility that resolves a host to an IP. `$ host s3-us-west-1.amazonaws.com` `s3-us-west-1.amazonaws.com has address 204.246.160.224` Now that I have the IP, I can run `whois` on it to find its NetRange. Since `whois` also returns a bunch of other information, I grepped for exactly what I wanted. `$ whois 204.246.160.224 | grep NetRange` `NetRange: 204.246.160.0 - 204.246.191.255` Now I have the IP range for the US West (Northern-California) S3 region. A note about the US Standard region: _s3.amazonaws.com_ is actually aliased between _s3-1.amazonaws.com_ and *s3-2.amazonaws.com* so I had to `whois` both of those hosts. `$ host s3.amazonaws.com` `s3.amazonaws.com is an alias for s3.geo.amazonaws.com.` `s3.geo.amazonaws.com is an alias for s3-2.amazonaws.com.` `s3-2.amazonaws.com has address 207.171.187.117`
