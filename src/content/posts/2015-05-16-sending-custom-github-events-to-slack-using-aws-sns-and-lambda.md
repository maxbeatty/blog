---
title: "Sending custom GitHub events to Slack using AWS SNS and Lambda"
slug: "2015/05/16/sending-custom-github-events-to-slack-using-aws-sns-and-lambda"
date: 2015-05-16
categories:
  - "Professional"
tags:
  - "aws"
---

Like many organizations, we are in the middle of switching to [Slack](https://slack.com/). They offer a long list of integrations out of the box including [GitHub](https://github.com/), but the native integration is missing some events my team and I had come to rely on (namely labeling Issues and Pull Requests). [GitHub has Webhooks](https://developer.github.com/webhooks/) and [Slack has Incoming Webhooks](https://api.slack.com/incoming-webhooks) so all I needed to do was put something in the middle to translate GitHub's JSON output to a JSON input for Slack. ![github-slack](/media/2016/06/github-slack.png) Instead of writing and deploying a simple server to do the translation, I chose to use [AWS Lambda](http://aws.amazon.com/lambda/) because it was designed to run code in response to events. One of its [newer triggers is Amazon SNS](http://aws.amazon.com/about-aws/whats-new/2015/04/amazon-sns-now-integrates-with-aws-lambda/) which is one of GitHub's Service Hooks (think branded Webhook). Now, the flow of information became clear:

1.  GitHub Event publishes to SNS Topic
2.  SNS Topic publishes to Lambda subscription
3.  Lambda function translates event into a message for Slack

It's more configuration than code which happens in the reverse order of the information.

## Hooking the Hooks

### 1\. Configure Incoming Webhook for Slack

Set up [an incoming webhook integration](https://my.slack.com/services/new/incoming-webhook) using [Slack's excellent documentation](https://api.slack.com/incoming-webhooks). (_I used an octocat from the [Octodex](https://octodex.github.com/) for the custom icon._)

### 2\. Create a Lambda Function

[Create a Lambda function](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create) by giving it a name and optional description. (_I chose to edit code inline because of the simplicity of my code and lack of external dependencies._)

- Role: Basic execution role (create one if necessary)
- Memory: 128 MB
- Timeouts: 3

What the Lambda function does:

1.  Parse SNS event to get GitHub Event
2.  Prepare message using Slack's syntax
3.  Send to Slack

The `context` argument to the handler function has `succeed` and `fail` methods that, when called, exit the Lambda function. Anything you `console.log` will be sent to CloudWatch logs which is nice for debugging. \[code lang=text\] var https = require("https"); // slack's link syntax function link(url, txt) { return "<" + url + "|" + txt + ">"; } exports.handler = function(event, context) { // 1. extract GitHub event from SNS message var ghEvent = JSON.parse(event.Records\[0\].Sns.Message); var eventType, eventName, numb; // what kind of event are we dealing with? if (ghEvent.pull_request) { eventType = "pull_request"; eventName = "Pull Request"; numb = ghEvent.number; } else if (ghEvent.issue) { eventType = "issue"; eventName = "Issue"; numb = ghEvent.issue.number; } else { context.fail("Invalid event type"); } // 2. Prepare message using Slack's syntax var who = link(ghEvent.sender.html_url, ghEvent.sender.login); var how = ghEvent.action; var where = link(ghEvent\[eventType\].html_url, eventName + " #" + numb); var what = ghEvent.label.name; var text = who + " " + how + " " + where + " \\"" + what + "\\""; // example text: maxbeatty labeled Pull Request #1550 "ship" // 3. Send to Slack var req = https.request({ hostname: "hooks.slack.com", port: 443, path: "/services/eX/4m/pl3", // replace with yours from previous step method: "POST", headers: { "Content-Type": "application/json" } }, function(res) { console.log("Slack hook response status code: " + res.statusCode); context.succeed(); }); req.on("error", function(err) { console.log("Slack request error: " + JSON.stringify(err)); context.fail(err.message); }); req.write(JSON.stringify({ text: text })); req.end(); }; \[/code\]

### 3\. Create an SNS Topic subscribed to Lambda

[Create a Topic](http://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) and then [create a subscription](http://docs.aws.amazon.com/sns/latest/dg/SubscribeTopic.html) choosing "AWS Lambda" as the Protocol and your function from the previous step as the Endpoint. After creating your subscription if you look at your Lambda function, you'll notice it gained an Event source (your SNS topic). Now when your SNS topic is published to, your Lambda function will be invoked. Keep your SNS topic's ARN handy for the next step.

### 4\. Creating GitHub Service Hook for SNS

#### 4.1 Create AWS IAM Resource with SNS Publish Policy

Use an AWS IAM Resource so GitHub can only publish to your intended SNS Topic. [Create a User](http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_SettingUpUser.html) with an access key and remember to download your credentials. Your new user will need permission to publish to your SNS Topic. To add that policy:

1.  Go to your new user's detail page
2.  Look for "Permissions" and in the "Inline Policies" subsection click "Create User Policy"
3.  Use the "Policy Generator" to select the following:

\- Effect: Allow - AWS Service: Amazon SNS - Actions: Publish - Amazon Resource Name (ARN): arn:aws:sns:us-east-1:from-last-step 4. Click "Add Statement" 5. Click "Next Step". You should see a Policy similar to: \[code lang=text\] { "Version": "2012-10-17", "Statement": \[ { "Action": \[ "sns:Publish" \], "Sid": "Stmt0000000000000", "Resource": \[ "arn:aws:sns:us-east-1:from-last-step" \], "Effect": "Allow" } \] } \[/code\] Finally, click "Apply Policy" and you should now see a policy listed in the "Inline Policies" section for your user. Now, GitHub can use this user's credentials to publish to your SNS topic.

#### 4.2 Create GitHub API Token

You will need a GitHub API token to create the service hook. (If you already have one with the equivalent of "write:repo_hook" scope, you can reuse that.)

1.  Go to the ["New personal access token" page](https://github.com/settings/tokens/new) (accessible from the "Generate new token" button on the ["Personal access tokens" page](https://github.com/settings/tokens))
2.  Give a description and select the "write:repo_hook" scope
3.  Click "Generate token"

Keep your token handy for the next and final step.

#### 4.3 Create GitHub Service Hook

You now have all the information you need to create the Amazon SNS Service Hook:

- AWS key (from step 4.1)
- AWS secret (from step 4.1)
- AWS SNS Topic (from step 3)
- AWS SNS Region (from step 3 if not "us-east-1")
- GitHub API token (from step 4.2)
- GitHub user (can also be an organization)
- GitHub repository (where you want events from)

The Amazon SNS Service Hook that you can setup through GitHub's web interface only provides "push" events. Since I wanted ["pull_request" and "issues" events](https://developer.github.com/v3/activity/events/types/), I needed to [create the hook via their Webhooks API](https://developer.github.com/v3/repos/hooks/#create-a-hook) and chose to do so with a simple Node.js script: \[code lang=text\] var GitHubApi = require("github") // npm i github var github = new GitHubApi({version: "3.0.0"}) github.authenticate({type:"oauth", token: process.env.GH*TOKEN}) github.repos.createHook({ user: process.env.GH_USER, repo: process.env.GH_REPO, name: "amazonsns", config: { "aws_key": process.env.AWS_KEY, "aws_secret": process.env.AWS_SECRET, "sns_topic": process.env.AWS_SNS_TOPIC, "sns_region": process.env.AWS_SNS_REGION || "us-east-1" }, events: \["pull_request", "issues"\] }, function(err, result) { console.log(arguments) }) \[/code\] \_Use [dotenv](https://www.npmjs.com/package/dotenv) to make managing environment variables easier.* To test that everything is configured correctly, go to an Issue or Pull Request and give it a label. Your channel specified when creating the Slack Incoming Webhook should receive a nicely formatted message. ![github-slack](/media/2016/06/github-slack.png)

## Hooking More Hooks

GitHub to AWS to Slack sounds simple enough but you don't want to do this for lots of repositories or channels. If more teams come asking for this, I'll likely reuse the SNS Topic and Incoming Webhook. I'd still have to set up the Service Hook for each repository. Slack allows you to customize everything about the message so I could redirect them to a certain channel based on the event's repository in my Lambda function. The next step from there would be to build some sort of UI to manage it all. At that point, it's time to ask Slack to expand their native GitHub integration to support these other events.

## Cost

Your GitHub repository and Slack channel may or may not be free. Amazon SNS and Lambda will only cost if your repository is insanely busy. At this time, [your first 1 million publishes _per month_ to Amazon SNS are free](http://aws.amazon.com/sns/pricing/) and there is no charge for deliveries to Lambda functions. The [Lambda free tier](http://aws.amazon.com/lambda/pricing/), that is available to both existing and new AWS customers indefinitely, allows for 3,200,00 seconds of execution time per month. **As long as your repository's Issues and Pull Requests generate less than 1 million events per month and Slack's Webhook responds in less than 3.2 seconds on average for those million events, it should be _free_ to use.** I'd be willing to wager that most GitHub _organizations_ don't assign, unassign, label, unlabel, open, close, reopen, or synchronize Issues and Pull Requests a million times per month so you could most likely reuse the SNS Topic and Lambda function as I suggested above. If you do automate this in a fashion where each repository has its own SNS topic and Lambda function, it should always be free.

## Takeaways

I knew GitHub's API was really good. I wasn't surprised Slack was easy to work with and customize. I would have been better off using AWS's APIs than their deep, complex UIs. My team is happy to have their label events back and more willing to switch completely to Slack. I'm happy to have finally found a good use for Lambda.
