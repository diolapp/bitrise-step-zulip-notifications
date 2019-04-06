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

import * as zulip from 'zulip-js';

import { Config } from './config';
import { Recipient } from './recipient';
import { Template } from './template';

/**
 * This class takes all of the components of the message and puts them all into
 * one place, and provides a few helper methods for chaning the format of the
 * object and sending the message.
 */
export class Message {
  private _recipient: Recipient;

  private _template: Template;
  
  private _topic: string;

  public constructor(recipient: Recipient, template: Template, topic: string) {
    this._recipient = recipient;
    this._template = template;
    this._topic = topic;
  }

  public toJson(config: Config): object {
    return {
      to: this._recipient.recipient,
      type: this._recipient.isStream === true ? 'stream' : 'private',
      subject: this._topic,
      content: this._template.compile(config),
    };
  }

  public send(config: Config): void {
    // First, convert the message into an anonymous (JSON) object
    const message = this.toJson(config);

    // Setup the Zulip JS config
    const zulipConfig = {
      apiKey: config.zulip.bot.apiKey,
      realm: config.zulip.url,
      username: config.zulip.bot.emailAddress,
    };

    // Send the message to Zulip
    zulip(zulipConfig).then((client): void => {
      client.messages.send(message).then(console.log);
    }).catch((error): void => {
      throw error;
    });
  }
}
