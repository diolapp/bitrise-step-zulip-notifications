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

/**
 * The config for the script
 * 
 * NOTE: A class is used here for aesthetic reasons only, this could easily be
 *    defined as an anonymous object, for example:
 *    
 * <code lang="ts">
 * {
 *   build: {
 *    number: string = process.env.BITRISE_BUILD_NUMBER,
 *    result: string = process.env.BITRISE_BUILD_STATUS === '0' ? 'passed' : 'failed',
 *    url: string = process.env.BITRISE_BUILD_URL,
 *   },
 * 
 *   ...
 * };
 * </code>
 */
export class Config {
  public build: {
    number: string;
    result: string;
    url: string;
  };

  public git: {
    commit: {
      hash: string;
      message: string;
    };
  };

  public pullRequest: {
    id: string;
    repository: string;
    status: boolean;
  }

  public zulip: {
    bot: {
      apiKey: string;
      emailAddress: string;
    };
    domain: string;
    emoji: string;
    pullRequest: {
      recipients: string;
      template: string;
      topic: string;
    };
    recipients: string;
    template: string;
    topic: string;
    url: string;
  };
  
  public constructor(args) {
    // Set the build properties
    this.build = {
      number: args.bn,
      result: args.bs === '0' ? 'passed' : 'failed',
      url: args.bu,
    };

    // Set the git properties
    this.git = {
      commit: {
        hash: args.gc,
        message: args.gm,
      },
    };

    // Set the pull request properties
    this.pullRequest = {
      id: args.pi,
      repository: args.pu,
      status: args.pr === 'true',
    };

    // Set the Zulip properties
    this.zulip = {
      bot: {
        apiKey: args.bk,
        emailAddress: args.be,
      },
      domain: args.zd,
      emoji: this.build.result === 'passed' ? args.es : args.ef,
      pullRequest: {
        recipients: args.rp,
        template: args.tp,
        topic: args.op,
      },
      recipients: args.r,
      template: args.t,
      topic: args.o,
      url: `https://${args.zd}.zulipchat.com/api/v1/messages`,
    };
  }
}
