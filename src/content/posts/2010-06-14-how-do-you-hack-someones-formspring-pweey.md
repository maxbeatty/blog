---
title: "How do you hack someones formspring?  Pweey Prreeasee, wif surgar on top!"
slug: "2010/06/14/how-do-you-hack-someones-formspring-pweey"
date: 2010-06-14
categories:
  - "Personal"
---

Ok, I’ll give in since you’re the 10,000th person to ask me. I, Max Beatty, am the only person in the entire world who knows how to hack someone’s formspring. You, anonymous, are the only one I am going to give these detailed instructions to so DO NOT tell anyone else.

First, you’re going to need a few tools. I hope you’re using Windows XP because that is the only operating system that will let you hack formspring. If you’re lame enough to have an anti-virus, turn that off. You can’t with one of those around.

Next, open the command prompt. You know, Start -> Run… -> cmd then Enter. Gosh, if you didn’t know that you’re probably going to have trouble with the rest of this. When the command prompt launches, do not be afraid. Type:

notepad C:/Windows/System32/drivers/etc/hosts

and press enter. Notepad should launch and you’re looking for a line that says “127.0.0.1 localhost”. If you bother reading the comments, that is a mapping of IP addresses to host names. What that means in plain english is where your passwords are being stored.

Here’s the hack so pay attention! Formspring is sooo stupid that it lets you see when people are logging in to their system and you can capture people’s passwords if you add “127.0.0.1 [www.formspring.me](http://www.formspring.me)” on the next line in Notepad.

Save that file and go back to the command prompt. Any time you want to see who is logging in and what their password is just type “ping [www.formspring.me](http://www.formspring.me)”. If you see Received = a number. That is the number of passwords you collected.

Best of luck in hacking formspring! By the way don’t try this on any other websites or you could cause some serious damage. Also, don’t forget to turn your anti-virus back on after you’re done hacking. Or just never turn it on again and become a real hacker!!!

[Ask me anything](http://formspring.me/maxbeatty?utm_medium=social&utm_source=tumblr&utm_campaign=shareanswer)
