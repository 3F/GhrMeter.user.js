
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

export default class UrlApiResolver
{
    apiserver = 'api.github.com';

    /**
     * :owner/:repo from url
     * @protected
     */
    usrprj = /^\/([^/]+)\/([^/]+)/;

    /**
     * @protected
     */
    owner = null;

    /**
     * @protected
     */
    repo = null;

    /**
     * While web version uses `?after=<tag_name>`, API v3 seems allows only `per_page / page` requests.
     * Thus we can't just use {location.search} as it was presented in data.
     *
     * Alternatively we can of course request to each separate tag/release, BUT!
     *      In fact this means toooo many requests to API:
     *      (unauthenticated: 60 requests per hour / authenticated: 5000 requests per hour)
     * 
     * TODO: Efficient alternative to `?after=<tag_name>`.
     *       Current implementation will use only single request via pagination to the first 100 records.
     *       Others requires at least N requests to N page when no related info from web version, eg.:
     *       (100 records page1) -> failed -> (100 records page2) -> failed -> (100 records page3) -> success;
     *
     * @returns {string}
     */
    getForPage()
    {
        // Any `after` param such `/releases?after=v1.6.1` will indicate to the page != 1
        // But web version uses 10 records per page. That will not help us detect page 11 for the next 100 records.
        // Anyway, the other records can be processed through individual `/releases/tags/:tag`
        return this.getReleases(1);
    }
    
    /**
     * 
     * @returns {string}
     */
    getForTagOrPage()
    {
        let webpref = '/releases/tag/';
        
        let pos = location.pathname.indexOf(webpref);
        if(pos == -1) {
            return this.getForPage();
        }

        // GET /repos/:owner/:repo/releases/tags/:tag

        return location.protocol
            + '//' + this.apiserver
            + '/repos/' 
            + this.owner + '/'
            + this.repo
            + '/releases/tags/' + location.pathname.substr(pos + webpref.length);
    }

    constructor()
    {
        let l = this.usrprj.exec(location.pathname);
        if(!l)
        {
            // null is also possible for second matching when used `/g` flag.
            throw new GhrmException('`usrprj` is not valid: ' + location.pathname);
        }

        this.owner  = l[1];
        this.repo   = l[2];
    }
    
    /**
     * @protected
     * @param {number} page
     * @returns {string}
     */
    getReleases(page)
    {
        if(!page) {
            page = 1;
        }
        
        // GET /repos/:owner/:repo/releases

        return location.protocol 
                + '//' + this.apiserver
                + '/repos/' 
                + this.owner + '/'
                + this.repo
                + '/releases?per_page=100&page=' + page;
    }
}
