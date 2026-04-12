---
title: "How to inspect Safari on iOS from your Mac"
slug: "2020/07/11/how-to-inspect-safari-on-ios-from-your-mac"
date: 2020-07-11
categories:
  - "Personal"
tags:
  - "development"
---

I had a project at work that required inspecting a web page on an actual mobile device instead of in an [emulator](https://developers.google.com/web/tools/chrome-devtools/device-mode) or [simulator](https://developer.apple.com/documentation/xcode/running_your_app_in_the_simulator_or_on_a_device). I found a lot of other instructions on how to do this but most were outdated, complicated, or both. This is my attempt at a straightforward, visual walkthrough.

_This was all done on iOS 13.5.1, macOS 10.15.5, and Safari 13.1.1._

On your iPhone, open the _Settings_ app. Go to _Safari_ and scroll down to _Advanced_. Enable **_Web Inspector_**.

![Enable Web Inspector on your iPhone](/media/2020/07/img_258db221c32b-1.jpeg)

Next, connect your iPhone to your Mac using your Lightning to USB cable. Open Safari on your Mac. If you don't already have the _Develop_ menu in your menu bar, open _Preferences_ (⌘,) and in the _Advanced_ tab, enable _show Develop menu in menu bar_.

![Enable Develop menu in Safari on macOS](/media/2020/07/screen-shot-2020-07-08-at-9.39.30-am.png)

With your iPhone connected to your Mac and unlocked, open the Develop menu. You should see your iPhone listed as a device. Mine is named 📱Pro Ⓜ️🅰️❎. Select _Use for Development..._

![Use your iPhone for development](/media/2020/07/screen-shot-2020-07-08-at-9.40.35-am.png)

On your iPhone, trust your computer.

![Trust your Mac](/media/2020/07/img_0638.png)

Open Safari on your iPhone (and go to a web page if you don't already have one loaded). On your Mac in the Safari Develop menu under your iPhone, you should see the web page you have open on your iPhone. Hovering over the name of the page in the menu will highlight the page blue on your iPhone! 👌🏼

![Select the page on your iPhone to inspect](/media/2020/07/screen-shot-2020-07-08-at-9.42.39-am.png)

Selecting the page will open a [Web Inspector](https://developer.apple.com/safari/tools/) on your Mac. You can now develop and debug just like on desktop. 🎉

![Web page on iPhone being inspected on Mac](/media/2020/07/screen-shot-2020-07-08-at-9.43.03-am.png)

## Pro Tip

Before unplugging your iPhone from your Mac, enable _Connect via Network_. This will allow you to wirelessly inspect web pages on this device in the future.

![](/media/2020/07/screen-shot-2020-07-08-at-9.45.54-am.png)

Another tip for another time is accessing your local development servers on your iPhone (hint: `mxb-mbp.local`). Until then, happy debugging!
