/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2017-2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import Log from "./Log";

export default class NumFormatter
{
    /**
     * Number of digits after the decimal point.
     */
    fixed = 2;

    /**
     * 
     * @param {number} number Number value to format.
     * @returns {string} Formatted number.
     */
    format(number)
    {
        if(!this.isValid(number))
        {
            Log.dbg('Unexpected value: ', number);
            return -1;
        }

        if(number >= 1e6)
        {
            return (number / 1e6).toFixed(this.fixed) + 'm';
        }

        if(number >= 1e3)
        {
            return (number / 1e3).toFixed(this.fixed) + 'k';
        }

        return number + '';
    }

    /**
     * 
     * @param {number} fixed Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
     */
    constructor(fixed)
    {
        this.fixed = fixed;
    }

    /**
     * @private
     * @returns {boolean}
     */
    isValid(n)
    {
        return !isNaN(parseFloat(n)) && isFinite(n) && n >= 0;
    }
}
