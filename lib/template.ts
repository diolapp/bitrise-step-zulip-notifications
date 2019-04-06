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

import { Config } from './config';

/**
 * This class is used for template processing. It takes in a raw template, and
 * converts it into a string with formatting preserved that has all of the
 * live information put in. This is accomplised by using
 * {@link string#replace()} to find all instances of a template token, which is
 * `{variableName}` in this case, and replacing them with the appropriate
 * values. This is probably not **the** most efficient way to do this, but it
 * works and it works reliably.
 */
export class Template {
  private _raw: string;

  private _compiled: string;

  /**
   * Returns a new template instance
   * 
   * @param {string} template The raw, uncompiled template
   */
  public constructor(template: string) {
    this._raw = template;
  }

  /**
   * Takes the raw template string and returns the compiled version with all of
   * the live values replaced. Uses {@link string#replace()} to accomplish
   * this. The list of variables available are:
   *  - **buildEmoji**: The emoji that correlates to the build state (if provided)
   *  - **buildNumer**: The build number generated by Bitrise
   *  - **buildResult**: `passed` if the build succeeded, else `failed`
   *  - **buildUrl**: The bitrise URL that links to this build
   *  - **gitCommitHash**: The commit hash (ID) that triggered this build
   *  - **gitCommitMessage**: The message for the commit that triggered this build
   *  - **pullRequestId**: The pull request ID for the build (only available
   *    for PR builds)
   *  - **pullRequestRepository**: The URL for the respository that triggered the
   *    build (only abvailable for PR builds)
   * 
   * @param {Config} config The configuration for the script. This is used to
   *    compile the variables
   */
  public compile(config: Config): string {
    this._compiled = this._raw
      .replace('{buildEmoji}', config.zulip.emoji)
      .replace('{buildNumber}', config.build.number)
      .replace('{buildResult}', config.build.result)
      .replace('{buldUrl}', config.build.url)
      .replace('{gitCommitHash}', config.git.commit.hash)
      .replace('{gitCommitMessage}', config.git.commit.message);

    if (config.pullRequest.status === true) {
      this._compiled = this._compiled
        .replace('{pullRequestId}', config.pullRequest.id)
        .replace('{pullRequestRepository}', config.pullRequest.repository);
    }

    return this._compiled;
  }
}