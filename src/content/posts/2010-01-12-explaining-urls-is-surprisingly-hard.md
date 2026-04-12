---
title: "Explaining URLs is Surprisingly Hard"
slug: "2010/01/12/explaining-urls-is-surprisingly-hard"
date: 2010-01-12
categories:
  - "Personal"
---

[benjaminsteinpro](http://pro.benjaminste.in/post/330685151/explaining-urls-is-surprisingly-hard):

> I listened to a moderately interesting [Security Now](http://www.grc.com/securitynow.htm) episode from a couple weeks ago.  The topic was explaining security best practices to non-techno people.  Specifically, can you tell if a URL is safe to click on.  Turns out parsing URLs is a suprisingly hard problem that nerds completely take for granted.
>
> Try explaining the following rules about clicking links to your grandma:
>
> - [www.paypal.com](http://www.paypal.com) (that one is good)
> - [www.paypal.ru](http://www.paypal.ru) (bad, see the TLD is .ru and not .com?)
> - [www.paypal.co.uk](http://www.paypal.co.uk) (good, oh yeah, .co.uk is sometimes good)
> - [www.paypal.com.evil.com](http://www.paypal.com.evil.com) (see the evil.com is at the end? you need to read URLs from right to left)
> - [www.evil.com/paypal.com](http://www.evil.com/paypal.com) (well, except in this case)
> - [www.paypa1.com](http://www.paypa1.com) (bad, but very hard to see)
> - <a href=”evil.com”>www.paypal.com</a> (bad, can’t you see the url in the chrome when you mouseover?)
>
> It’s so intuitive for techies to see the good and bad URLs but there’s just no simple set of rules for explaining it.  I guess you could forward them the [RFC](http://www.ietf.org/rfc/rfc1738.txt)…
