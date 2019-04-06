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
 * This class is used to make the recipients easier to work with.
 */
export class Recipient {
  private _recipient: string;

  private _isStream: boolean;

  /**
   * Returns a new instance of the recipient class
   * 
   * @param {string} recipient The recipient
   */
  public constructor(recipient: string) {
    this._recipient = recipient;
    this._isStream = !recipient.includes("@");
  }

  /**
   * Get the recipient field. The recipient can be either a stream
   * (i.e. Builds) or a user (i.e. buildbot@mydomain.zulipchat.com). If the
   * recipient is a stream (that is it does not contain an `@` symbol), then
   * the {@link #isStream} field will return true.
   * 
   * @returns {string} The recipient
   */
  public get recipient(): string {
    return this._recipient;
  }

  /**
   * Get the isStream field. Will return whether or not the recipient is a
   * stream. This is figured out by determining if the recipient field contains
   * the `@` symbol, since a private message would contain that, and a stream
   * would not.
   * 
   * @returns {boolean} `true` if the recipient is a stream, else `false`
   */
  public get isStream(): boolean {
    return this._isStream;
  }

  /**
   * Takes a comma separated list of recipients and turns them into an array
   * of {@link Recipient}. Spacing before and after the commas does not
   * matter because every string is trimmed before it is passed to the
   * {@link #constructor}.
   * 
   * @param {string} recipeints A comma separated list of recipients
   * @returns {Recipient[]} An array containing all the recipients in the list
   */
  public static fromDelimitedString(recipeints: string): Recipient[] {
    // Split the string into an array of strings
    const strings: string[] = recipeints.split(",");

    // Define the Recipeints array
    const array: Recipient[] = [];

    // Clean up the strings, create a recipeient, and add them to the array.
    strings.forEach((element): void => {
      element.trim();
      array.push(new Recipient(element));
    });

    return array;
  }
}