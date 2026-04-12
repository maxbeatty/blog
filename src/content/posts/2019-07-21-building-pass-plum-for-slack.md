---
title: "Building Pass Plum for Slack"
slug: "2019/07/21/building-pass-plum-for-slack"
date: 2019-07-22
categories:
  - "Personal"
tags:
  - "JavaScript"
  - "Serverless"
  - "ZEIT"
---

[Pass Plum](https://passplum.maxbeatty.com) is a side project I started a few years ago after being frustrated with some needlessly complex yet insecure WiFi passwords I came across while traveling. The website is a good start for helping people. For the tool to be more useful, it needs to be accessible from more places. Creating [a Slack app](https://slack.com/apps/AL6GW8MNY-pass-plum) was an early idea. After an afternoon of development, you can now type `/passplum` to generate a secure, simple, easy-to-type passphrase.

![passplum-Jul-18-2019 10-21-27](/media/2019/07/passplum-jul-18-2019-10-21-27.gif)

The first "extension" of the website was [a twitter account](https://twitter.com/passplum). A serverless function would execute on a schedule requesting the website, extracting the passphrase from the HTML, and finally tweeting it out. It was naive but got the job done. Performance wasn't a concern because the two network requests (one to Pass Plum, one to Twitter) had 30 seconds to complete. For a Slack slash command, responsiveness _is_ important so a network round trip wouldn't cut it. Luckily, the "vault" had been refactored to store its dictionary in a database instead of a flat file so the website, tweeter, and new Slack slash endpoint could all use the same method to generate a passphrase. Here's how simple the slash endpoint began:

```
const { Vault } = require("../lib/vault");

const v = new Vault();

module.exports = async (req, res) => {
  try {
    await v.load();
    const passphrase = await v.fetch();

    res.json({
      response_type: "ephemeral",
      text: "Here's a great password: `" + passphrase + "`"
    });
  } catch (err) {
    res.json({
      response_type: "ephemeral",
      text: "Sorry, that didn't work. Please try again."
    });
  }
};
```

Slack supports [verifying requests](https://api.slack.com/docs/verifying-requests-from-slack) which I wanted to do to reduce abuse of the endpoint. Anyone considering the app and also digging through the source code would also be more encouraged to try the app. This was the most difficult part of building the slash command because I was using [ZEIT Now helpers](https://zeit.co/docs/v2/advanced/builders/node-js-now-node/#helpers) and not [Slack's SDK](https://github.com/slackapi/node-slack-sdk/). After digging into their source code along with much trial and error, I arrived at:

```
const crypto = require("crypto");
const querystring = require("querystring");
const timingSafeCompare = require("tsscmp");

// similar to https://github.com/slackapi/node-slack-sdk/blob/a76b3ee5b3e77e6520889b9026a157996d35b84a/packages/interactive-messages/src/http-handler.js#L63
function verifyRequest(reqHeaders, reqBody) {
  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
  const ts = reqHeaders["x-slack-request-timestamp"];
  if (ts < fiveMinutesAgo) {
    throw new Error("Ignoring request older than 5 minutes from local time");
  }

  const hmac = crypto.createHmac("sha256", SLACK_SIGNING_SECRET);
  const [version, hash] = reqHeaders["x-slack-signature"].split("=");
  // undo @now/node helper
  const rawBody = querystring.stringify(reqBody);
  hmac.update(`${version}:${ts}:${rawBody}`);

  if (!timingSafeCompare(hash, hmac.digest("hex"))) {
    throw new Error("Slack request signing verification failed");
  }
}
```

Slack's walkthrough of the logic (linked above) is excellent so I won't rehash it here. I still got tripped up on a few things along the way.

1.  While Slack's pseudocode shows header names with capitalization, [Node lowercases them](https://github.com/nodejs/node-v0.x-archive/issues/1954) which is important when referencing in objects like `reqHeaders`.
2.  You'll notice I'm undoing `@now/node` helper from ZEIT in order to build the digest which was thankfully straightforward.
3.  Comparing `hash` from the request header and the hex digest I built was the most problematic because I was debugging with `console.log(hmac.digest("hex"))`. [Calling `digest` again](http://nodejs.org/api/crypto.html#crypto_hmac_digest_encoding) in the actual comparison resulted in an error that looked to be part of the verification failing but was actually poor debugging habits by me. 🤦🏼‍♂️
4.  When this `ssl_check` parameter is provided for [Slack to occasionally verify the server's SSL certificate](https://api.slack.com/slash-commands#app_command_handling), their `x-slack-*` headers are **not** present which makes verifying the request fail. A [quick fix](https://github.com/maxbeatty/passplum/pull/37/files#diff-9bbbf4a298acf0f60dec422a5ddb9c3d) but still a head scratcher.

With the slash command endpoint built, it was time to let other workspaces install the app. [Slack's OAuth documentation](https://api.slack.com/docs/oauth) was also great. I'll just link to [the resulting code](https://github.com/maxbeatty/passplum/pull/11/files#diff-94c8ad88c396f5950671d82e1eb83c79) instead of pasting it here because of how clean it became thanks to `[request](https://www.npmjs.com/package/request)`. Fifty lines of JavaScript and three lines of HTML was all it took to make "Add to Slack" work.

```
<a class="db u-center" style="margin-top: 1rem;margin-bottom: -1rem;" href="https://slack.com/oauth/authorize?scope=commands&client_id=3648710574.686574293780">
    <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
</a>
```

[See the whole Pull Request on GitHub](https://github.com/maxbeatty/passplum/pull/11)

## Future Development

The first version is limited as you can only get a passphrase with four words separated by a hyphen. I'd like to allow for customization like on the website but want to make sure it's usable within Slack's UI constraints. `/passplum 3 _` would be fine for folks familiar with command lines but would likely leave a lot of people unsure of what to do. [Slack's interactive message menus](https://api.slack.com/docs/message-menus) may be the way forward for everyone.

Do you have other ideas what for Pass Plum could do in Slack? Leave a comment or tweet at [@PassPlum](https://twitter.com/passplum)!
