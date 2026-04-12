---
title: "First Impressions of Circa"
slug: "2012/10/15/first-impressions-of-circa"
date: 2012-10-15
categories:
  - "Personal"
---

I’ve been waiting for [Circa](http://cir.ca) to launch for a few months. There have been a lot of media curation efforts lately, and I am curious to see what they do.

Their app is [available in the App Store](http://cir.ca/app) starting today. I downloaded it at lunch, and upon launching for the first time, I was asked to allow Push Notifications. They’ve been pretty secretive about their new service so immediately I thought to myself, “What would they push to me?” I, along with Apple, dislike this pattern of asking for permissions without giving context as to why you need them. From the [iOS Human Interface Guide](http://developer.apple.com/library/ios/#documentation/userexperience/conceptual/mobilehig/TechnologyUsage/TechnologyUsage.html):

> Ask permission at app startup only if your app can’t perform its primary function without the user’s data. People will not be bothered by this if it’s obvious that the main function of your app depends on knowing their personal information.

After allowing Push Notifications, I was brought to a screen with the option to sign up for an account. I have no idea why I need or would want an account. Thankfully, they had an option to skip it.

After skipping sign up, loading spinners appeared for what I assumed was them fetching the news. Instead, an animated step-by-step guide loaded. Why wasn’t that bundled with the app? While users are going through it, Circa could have been fetching data behind the scenes to prepare a great first impression of the product after all of this on boarding.

Unfortunately after the guide, more loading spinners appeared before the app crashed. I reopened and it crashed again. From what I saw on Twitter, they were swamped with new users and their servers got overloaded. I can’t believe they didn’t cover the case of their web server being down and that it resulted in their app crashing. Maybe something else was going on, but finicky mobile users don’t care.

When you download a new app and all it does is ask you questions and crash, you’re probably going to get snarky 1 star reviews. I’m not one of those people. I wrote this hear in case anyone wanted to discuss the design decisions made.

To recap a user’s first impression of Circa:

1.  Open app to immediately grant Push Notification permissions
2.  Get prompted to sign up for an account (without any explanation why you would want to)
3.  Wait for a guide to load and go through an explanation of how Circa, the service, works
4.  Finally get to the app’s content (once their servers were healthy)

I would have preferred being launched directly into the top news and been encouraged to explore to discover features. When I follow a story is a more appropriate time to prompt for Push Notifications (assuming that’s how they’re used). Do I sign up for more news or to save stuff? Let me naturally come across whatever barrier or benefit I would get from signing up.

Overall, it’s a very interesting way of curating the news, and I’m not giving up on it after a rough launch.
