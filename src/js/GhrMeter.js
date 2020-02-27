
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

import UrlApiResolver from './UrlApiResolver';
import GhrmException from './GhrmException';
import GhrmNullException from './GhmNullException';
import Log from './Log';

export default class GhrMeter
{
    /**
     * Assets from the web releases page.
     * Github at ~ Aug 2018: ".release-header + :first-of-type li a"
     */
    pageFiles = "a[href*=\\/releases\\/download\\/]";

    /**
     * @protected
     */
    uar = new UrlApiResolver();
    
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
        elem.insertAdjacentHTML
        (
            position, // beforebegin, afterbegin, beforeend, afterend
            "<span class='" + _.out.class + "' style='" + _.out.style + "'>" + data + "</span>"
        );
    }
    
    process()
    {
        let _= this;
        Log.dbg('Started for: ' + location.pathname);

        let url = this.uar.getForTagOrPage();
        if(!url) {
            Log.dbg('Nothing to process');
            return;
        }
        
        Log.dbg('Get info: ' + url);

        fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
        })
        .then(response => response.json())
        .then(apidata => _.render(apidata))
        .then(undefined, r => { Log.err(r); }); //TODO:
    }

    reset()
    {
        // TODO: reset added UI controls
        throw new Error('Not implemented yet');
    }

    constructor()
    {
        this.out =
        {
            class: 'Label Label--outline Label--outline-green text-gray',
            style: 'margin-right: 3px;',
        };
    }

    /**
     * 
     * @protected
     * @param {json} apidata 
     */
    render(apidata)
    {
        if(!apidata) {
            throw new GhrmNullException('apidata');
        }

        for(let root of document.querySelectorAll(this.pageFiles))
        {
            let durl = root.getAttribute('href');

            if(durl.indexOf('releases/download') == -1) {
                continue;
            }

            if(!apidata.length) {
                this.renderRelease(apidata, durl, root);
                return;
            }

            for(let idx in apidata) {
                this.renderRelease(apidata[idx], durl, root);
            }
        }
    }

    /**
     * @protected
     * @param {json} Specific record to render release.
     */
    renderRelease(record, durl, root)
    {
        for(let asset in record.assets)
        {
            let lnk = record.assets[asset];

            if(!lnk.browser_download_url.endsWith(durl)) {
                continue;
            };
            
            Log.dbg('Insert data for #' + lnk.id + ': ' + durl);
            this.injectCounter(root, lnk.download_count);
        }
    }
}
