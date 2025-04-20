---
title: "Environment Variables in Node.js"
date: 2017-08-17
categories: 
  - "professional"
tags: 
  - "node-js"
---

Many apps need configuration to connect to a database or send requests to error reporting or analytics services. When you’re developing your app on your laptop, you might connect to a database at `localhost`. When you deploy your app to a hosting provider, you’ll likely want to connect somewhere else.<!--more-->

```
let databaseHost = "localhost";
```

if (!isLocal) {
  databaseHost = "`example.dblayer.com";`
}

There are a couple problems with this approach. First, you’ll need to keep adding specific cases for every environment (e.g. `qa`, `staging`, `sams-staging`). Second, all of your sensitive data like database passwords are in **plain text** in version control being distributed to _every_developer on your team, _every_ CI build, and _every_ deploy to every environment. Those maintenance and security headaches can be avoided by storing configuration in the environment.

```
const databaseHost = process.env.DB_HOST;
```

### How do environment variables work in Node.js?

In Node.js, environment variables are made available through the global `[process.env](https://nodejs.org/api/process.html#process_process_env)` object . The object is initially populated from your shell environment (e.g. `$USER`, `$HOME` , `$PATH`).

```
❯ echo $USER  
max
❯ node -p "process.env.USER"              
max
```

You can define custom environment variables in your shell and they will appear in `process.env`.

```
❯ FOO=bar node -p "process.env.FOO"
bar
```

If connecting to your database requires a host, port, user, password, and database name, this quickly becomes unwieldy.

```
❯ DB_HOST=localhost DB_PORT=5432 DB_USER=max DB_PASS=s3cr3t DB_NAME=example node my-server.js
```

### Managing Environment Variables

With `[dotenv](https://github.com/motdotla/dotenv)`, you can define all of your variables in a `.env`file.

```
DB_HOST=localhost
USER=sam
```

Then, `dotenv`will assign new keys to `process.env` and leave existing values untouched.

```
require("dotenv").config();
```

```
console.log(process.env.USER); // => max
console.log(process.env.DB_HOST); // => localhost
```

#### Overwriting can be dangerous

Overriding existing environment variables can have unintended consequences for your code and its dependencies which is why `dotenv` does not modify them. This simple example demonstrates how you can innocently corrupt your environment (`node`will not be found because it is not in `$PATH`).

```
const cp = require("child_process");
```

```
process.env.PATH = "innocent mistake";
```

```
cp.execSync("node --version", { encoding: 'utf8' });
```

If you’d like to overwrite variables anyways, you can still leverage the parsing `dotenv` performs and manually assign values.

```
const dotenv = require("dotenv");
```

```
const { parsed } = dotenv.config();
process.env.MY_OVERRIDE = parsed.MY_OVERRIDE;
```

#### Preloading

Some hosting providers like Heroku, ZEIT Now, and AWS Elastic Beanstalk will populate your environment with variables you configure so you don’t need a `.env` file. When a `.env` file is not found, `dotenv` quietly fails. There’s a minimal startup cost to your app, but if you’d rather not have `require("dotenv").config()` in your code, you can use [the](https://nodejs.org/api/cli.html#cli_r_require_module) `[--require](https://nodejs.org/api/cli.html#cli_r_require_module)`[command line option](https://nodejs.org/api/cli.html#cli_r_require_module) to preload `dotenv` when you need it.

```
$ node --require dotenv/config my-server.js
```

### Debugging

When `process.env` isn’t populated as expected, I’ve found it’s usually due to the `.env` file not being found or making assumptions in how your values will be treated.

#### Inspecting Errors

If an error occurs during configuration, `dotenv` returns that error so you can inspect it.

```
const dotenv = require("dotenv");
```

```
const { error } = dotenv.config();
```

```
if (error) {
  throw error
}
```

The most common error is not being able to read the configuration file. By default, the `.env` file is assumed to be in whatever directory your process starts (usually the root of your project). You can always customize the path via options and that usually solves the disconnect.

```
require("dotenv").config({ path: "/Users/max/my-project/.env" });
```

#### Avoid Boolean Logic

> Assigning a property on `process.env`will implicitly convert the value to a string.

Even if your `.env` file defines a variable like `SHOULD_SEND=false` or `SHOULD_SEND=0`, the values will be converted to strings (“false” and “0” respectively) and not interpreted as booleans.

```
if (process.env.SHOULD_SEND) {
  mailer.send();
} else {
  console.log("this won't be reached with values like false and 0");
}
```

Instead, you should make explicit checks. I’ve found depending on the environment name goes a long way.

```
db.connect({
  debug: process.env.NODE_ENV === 'development'
});
```

If something else has you stumped, please [open an issue on GitHub](https://github.com/motdotla/dotenv/issues/new).

At the time of writing, `dotenv` is being downloaded from [npm](https://www.npmjs.com/package/dotenv) almost 2 million times per month! It’s encouraging to see that many people not keeping their sensitive data in source control. Using environment variables also makes your code easier to share. dotenv is an admittedly simple approach to environment variables (just simple strings). If you’d like more features, check out [all of the modules that extend it](https://www.npmjs.com/browse/keyword/dotenv).

_Originally posted on [Medium](https://medium.com/@maxbeatty/environment-variables-in-node-js-28e951631801). As of September 14th, 2018, `dotenv` is being downloaded from [npm](https://www.npmjs.com/package/dotenv) over 2 million times per **week**!_
