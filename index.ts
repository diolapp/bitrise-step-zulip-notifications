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

import { strict as assert } from 'assert';
import * as program from 'commander';

import { Config } from './lib/config';
import { Message } from './lib/message';
import { Recipient } from './lib/recipient';
import { Template } from './lib/template';

// Process the command line arguments that should have been passed to the step
program
  .version('0.1.0-alpha', '-v, --version')
  .usage('[options]')
  .option('-z, --zulip-domain <domain>', 'The domain to use [required]')
  .option('-e, --bot-email <email>', "The bot's email address [required]")
  .option('-a, --bot-key <key>', "The bot's API key [required]")
  .option('-r, --recipients <list>', 'The list of recipients (non-PR) [required]')
  .option('-t, --template <template>', 'The template (non-PR) [required]')
  .option('-o, --topic <topic>', 'The topic of the message (non-PR)')
  .option('-R, --recipients-pull-request <list>', 'The list of recipients (PR)')
  .option('-T, --template-pull-request <template>', 'The template (PR)')
  .option('-O, --topic-pull-request <topic>', 'The topic of the message (PR)')
  .option('-e, --emoji-success <emoji>', 'The emoji for a successful build')
  .option('-E, --emoji-failure <emoji>', 'The emoji for a failed build')
  .parse(process.argv);

// Assert that the required options were passed
// This is kind of redundant, since the script will be launched by the step
// itself and the inputs will be there, but it's good progamming practice.
assert(program.zulipDomain, '-z, --zulip-domain <domain> is required');
assert(program.botEmail, '-e, --bot-email <email> is required');
assert(program.botKey, '-a, --bot-key <key> is required');
assert(program.recipients, '-r, --recipients <list> is required');
assert(program.template, '-t, --template <template> is required');

// Setup the config based on the parameters send via the command line
const config = new Config(program);

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
