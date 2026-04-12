---
title: "Pragmatic CSS Values"
slug: "2012/05/29/pragmatic-css-values"
date: 2012-05-29
categories:
  - "Professional"
tags:
  - "css"
---

The `em` CSS unit is one of the tougher to master because it is relative in nature. You have to know or figure out something else before you know what the value you’re declaring actually means. When you don’t calculate what your declaration equates to when the browser interprets it, you can come across some goofy behavior. ![rdc-homepage](/media/2012/05/rdc-homepage.png) That doesn’t look right. There’s this huge heading crammed in there that doesn’t make any sense.

### Why is that?

Chrome Canary has a bug where it is not respecting that `h1`’s `text-indent` property value of `-999999em`.

### Why is it a bug?

According to the CSS3 spec, the `text-indent` property takes a length or percentage as a value. A length is a _dimension_. A dimension is a _number_ immediately followed by a unit identifier [1](http://www.w3.org/TR/css3-values/#length-value). Because `text-indent` does not restrict the number value to some range (as far as I can tell), the UAs (User Agent) “must support at least up to ±230; unsupported values must be clamped to the closest supported value.” [2](http://www.w3.org/TR/css3-values/#number) `em` is a length type distance unit that is computed based on the value of the `font-size` property of the element. The `h1` in this case has an inherited `font-size` of `40px` which means `-999999em` equates to `-39999960px`. To be fair, -39999960 is well within -230 (-1073741824). To put it in perspective, 39999960px is wide enough to span well over 15,000 monitors whose resolution is 2560 x 1440 pixels. This text replacement technique only needs to clear one monitor who might have a resolution that big.

### Maybe this isn’t a bug

Perhaps the Chrome dev team wants developers to take a pragmatic approach to declaring property values. A `text-indent` that spans 15,000 27" monitors doesn’t make any sense in any scenario. Since the `h1` is inheriting a `font-size` of `40px`, just `-99em` would suffice to move the text 3,960 pixels. If you don’t want to think about calculating what an `em` will compute to, just use [this newer technique which is based on 100%](http://www.zeldman.com/2012/03/01/replacing-the-9999px-hack-new-image-replacement/).
