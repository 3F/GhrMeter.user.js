
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

import GhrmException from './GhrmException';
import GhrmNullException from './GhmNullException';

export default class GhrMeter
{
    constructor(debug = false)
    {
        /** assets from the releases page */
        // this.pageFiles = ".release-header + :first-of-type li a";
        this.pageFiles = "a[href*=\\/releases\\/download\\/]";

        /** 'user/project' from url */
        this.usrprj = /^\/([^/]+)\/([^/]+)/g;

        this.apiserver = 'api.github.com';
        
        this.out = {
            class: 'Label Label--outline Label--outline-green text-gray',
            style: 'margin-right: 3px;',
        };
        
        this.debug = debug;
    }
    
    /**
     * 
     * @param {Node} elem Where to add counter.
     * @param {number} data Actual value.
     * @param {string} position The position relative to the elem. 
     */
    injectCounter(elem, data, position = 'afterbegin')
    {
        if(!elem || data < 0) {
            throw new GhrmException('Incorrect data, injectCounter:', elem, data, position); 
        }
        
        let _= this;
        elem.insertAdjacentHTML(
            position, // beforebegin, afterbegin, beforeend, afterend
            "<span class='" + _.out.class + "' style='" + _.out.style + "'>" + data + "</span>"
        );
    }
    
    process()
    {
        let _= this;
        _.dbg('started for: ' + location.pathname);

        let url = _.getInfoAPI();
        if(!url) {
            _.dbg('nothing to process');
            return;
        }
        
        _.dbg('get info: ' + url);

        fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
        })
        .then(response => response.json())
        .then(apidata => _.renderUI(apidata))
        .then(undefined, r => { throw new GhrmException(r); });
    }

    reset()
    {
        // this.usrprj.lastIndex = 0;
        // TODO: reset added UI controls
        throw new Error('Not implemented yet');
    }

    /**
     * 
     * @protected
     * @param {json} apidata 
     */
    renderUI(apidata)
    {
        if(!apidata) {
            throw new GhrmNullException('apidata');
        }
        
        let _= this;
        for(let root of document.querySelectorAll(_.pageFiles))
        {
            let durl = root.getAttribute('href');

            if(durl.indexOf('releases/download') == -1) {
                continue;
            }

            for(let idx in apidata)
            for(let asset in apidata[idx].assets)
            {
                let lnk = apidata[idx].assets[asset];

                if(!lnk.browser_download_url.endsWith(durl)) {
                    continue;
                };
                
                _.dbg('insert data for #' + lnk.id + ': ' + durl);
                _.injectCounter(root, lnk.download_count);
            }
        }
    }

    /**
     * 
     * @protected
     * @returns {string}
     */
    getInfoAPI()
    {
        // 'usrprj.lastIndex' will contain latest found pos if used /g
        let l = this.usrprj.exec(location.pathname);
        if(!l) {
            // we already processed this.
            return null;
        }
        
        return location.protocol 
                + '//' + this.apiserver + '/repos/' + l[1] + '/' + l[2] + '/releases';
    }

    /**
     * 
     * @protected
     * @param {string} msg 
     * @param  {...any} args 
     */
    dbg(msg, ...args)
    {
        if(!this.debug) {
            return;
        }

        let stamp = new Date().toISOString().substr(11, 12) + '] ';
        if(!args || args.length < 1) {
            console.log(stamp + msg);
        }
        else {
            console.log(stamp + msg, args);
        }
    }
}
