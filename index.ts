#!/usr/bin/env ts-node

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Diol App Team
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as yargs from 'yargs';

import { Config } from './lib/config';
import { Message } from './lib/message';
import { Recipient } from './lib/recipient';
import { Template } from './lib/template';

// Process the command line arguments that should have been passed to the step
const args = yargs
  .option('zulip-domain', {
    alias: 'd',
    demandOption: true,
    describe: 'The Zulip domain to send messages to',
    string: true,
  })
  .option('bot-email', {
    alias: 'e',
    demandOption: true,
    describe: 'The email address for the Zulip bot to use',
    string: true,
  })
  .option('bot-key', {
    alias: 'k',
    demandOption: true,
    describe: 'The API key for the Zulip bot to use',
    string: true,
  })
  .option('recipients', {
    alias: 'r',
    demandOption: true,
    describe: 'The list of recipients for non pull request builds',
    string: true,
  })
  .option('template', {
    alias: 't',
    demandOption: true,
    describe: 'The message template for non pull request builds',
    string: true,
  })
  .option('topic', {
    alias: 'o',
    demandOption: true,
    describe: 'The topic of the message for non pull request builds',
    string: true,
  })
  .option('recipients-pull-request', {
    alias: 'R',
    demandOption: false,
    describe: 'The list of recipients for pull request builds',
    string: true,
  })
  .option('template-pull-request', {
    alias: 'T',
    demandOption: false,
    describe: 'The message template for pull request builds',
    string: true,
  })
  .option('topic-pull-request', {
    alias: 'O',
    demandOption: false,
    describe: 'The topic of the message for pull request builds',
    string: true,
  })
  .option('emoji-success', {
    alias: 'm',
    demandOption: false,
    describe: 'The emoji for a successful build',
    string: true,
  })
  .option('emoji-failure', {
    alias: 'M',
    demandOption: false,
    describe: 'The emoji for a failed build',
    string: true,
  })
  .option('git-commit', {
    alias: 'g',
    demandOption: true,
    describe: 'The git commit ID for the build',
    string: true,
  })
  .option('git-message', {
    alias: 'G',
    demandOption: true,
    describe: 'The git commit message for the build',
    string: true,
  })
  .option('build-number', {
    alias: 'n',
    demandOption: true,
    describe: 'The build number',
    string: true,
  })
  .option('build-status', {
    alias: 's',
    demandOption: true,
    describe: 'The build status indicator',
    string: true,
  })
  .option('build-url', {
    alias: 'u',
    demandOption: true,
    describe: 'The URL for the build',
    string: true,
  })
  .option('pull-request', {
    alias: 'p',
    demandOption: true,
    describe: 'Status indicator for whether or not this is a pull request build',
    string: true,
  })
  .option('pull-request-id', {
    alias: 'i',
    demandOption: true,
    describe: 'The ID for the pull request that triggered the build',
    string: true,
  })
  .option('pull-request-repository', {
    alias: 'P',
    demandOption: true,
    describe: 'The URL for the repository of the pull request',
    string: true,
  })
  .help().alias('help', 'h')
  .version().alias('version', 'v')
  .parse();

// Setup the config based on the parameters send via the command line
const config: Config = {
  build: {
    number: args['build-number'],
    result: args['build-status'] === '0' ? 'passed' : 'failed',
    url: args['build-url'],
  },

  git: {
    commit: {
      hash: args['git-commit'],
      message: args['git-message'],
    },
  },

  pullRequest: {
    id: args['pull-request-id'],
    repository: args['pull-request-repository'],
    status: args['pull-request'] === 'true',
  },

  zulip: {
    bot: {
      email: args['bot-email'],
      key: args['bot-key'],
    },
    domain: args['zulip-domain'],
    emoji: args['build-status'] === '0' ? args['emoji-success'] : args['emoji-failure'],
    pullRequest: {
      recipients: args['recipients-pull-request'],
      template: args['template-pull-request'],
      topic: args['topic-pull-request'],
    },
    recipients: args['recipients'],
    template: args['template'],
    topic: args['topic'],
    url: `https://${args['zulip-domain']}.zulipchat.com/api/v1/messages`,
  },
};

// Put the recipients into a workable format
const recipients: Recipient[] = (config.pullRequest.status === true)
  ? Recipient.fromDelimitedString(config.zulip.pullRequest.recipients)
  : Recipient.fromDelimitedString(config.zulip.recipients);

// Put the template into a workable format
const template: Template = (config.pullRequest.status === true)
  ? new Template(config.zulip.pullRequest.template)
  : new Template(config.zulip.template);

// Now, loop over the recipients
recipients.forEach((recipient, index): void => {
  // Log the progress for the user, this is good UX
  console.log(`Sending messge ${index + 1} of ${recipients.length}...`);

  // Determine the topic
  // This is done here to make the message constructor call cleaner
  const topic: string = config.pullRequest.status === true
    ? config.zulip.pullRequest.topic
    : config.zulip.topic;

  // Create the message
  const message = new Message(recipient, template, topic);

  // Finally, send the message
  message.send(config);
});
