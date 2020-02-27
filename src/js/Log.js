
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

export default class Log
{
    static debug = false;

    /**
     * Conditional msg. Activated only if {Log.debug} === true.
     * @param {string} msg
     * @param  {...any} args 
     */
    static dbg(msg, ...args)
    {
        if(Log.debug === true) {
            Log.stdout(console.log, msg, ...args);
        }
    }

    static err(msg, ...args)
    {
        Log.stdout(console.error, msg, ...args);
    }

    static warn(msg, ...args)
    {
        Log.stdout(console.warn, msg, ...args);
    }

    static info(msg, ...args)
    {
        Log.stdout(console.log, msg, ...args);
    }

    /**
     *
     * @private
     * @param {CallableFunction} func Function which is ready to process message.
     * @param {string} msg 
     * @param  {...any} args 
     */
    static stdout(func, msg, ...args)
    {
        if(!func) {
            return;
        }

        let stamp = new Date().toISOString().substr(11, 12) + ']';

        msg = stamp + '[GhrMeter.user.js] ' + msg;
        
        if(!args || args.length < 1) {
            func(msg);
        }
        else {
            func(msg, args);
        }
    }
}
