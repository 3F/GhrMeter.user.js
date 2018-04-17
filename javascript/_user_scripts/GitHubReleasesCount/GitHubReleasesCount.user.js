// ==UserScript==
// @name        GitHubReleasesCount
// @description To show download counter for each attachment from Releases page on GitHub.com
// @namespace   net.r_eg.GitHubReleasesCount
// @version     0.3
// @grant       none
// @include     https://github.com/*/*/releases*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @updateURL   https://raw.githubusercontent.com/3F/sandbox/master/javascript/_user_scripts/GitHubReleasesCount/GitHubReleasesCount.user.js
// @downloadURL https://raw.githubusercontent.com/3F/sandbox/master/javascript/_user_scripts/GitHubReleasesCount/GitHubReleasesCount.user.js
// @author      https://github.com/3F
// ==/UserScript==

/* 
 Here's sandbox as the main page of this script at this time:
 - https://github.com/3F/sandbox/tree/master/javascript/_user_scripts/GitHubReleasesCount
 
 Tested via: 
    - Firefox 59.0.2 + Greasemonkey 4.3
    - Firefox 55.0.3 & 54.0.1 + Greasemonkey 3.11
    
 Changes:
     * 0.3: Fixed the work with modern GitHub version ~(Jan 2018 - Apr 2018)
     * 0.2: individual tags & multi-pages support (+async).
     * 0.1: first idea.
*/
$(function()
{
    'use strict';

    var GHRCounterPrototype =
    {
        debug: false,

        process: function()
        {
            this._dbg('started for: ' + location.pathname);

            //github.com/<user>/<project>/releases
            var fmt = /^\/([^/]+)\/([^/]+)/g;
            var loc = fmt.exec(location.pathname);
            var url = location.protocol + '//api.github.com/repos/' + loc[1] + '/' + loc[2] + '/releases';

            var _this = this;
            this._dbg('get info: ' + url);
            $.get(url, function(apidata)
            {
                $(".release-body li a").each(function()
                {
                    var root = $(this);
                    var durl = root.attr('href');

                    if(durl.indexOf('releases/download') == -1) {
                        return true; // means 'continue' statement
                    }

                    for(var idx in apidata)
                    for(var asset in apidata[idx].assets)
                    {
                        var lnk = apidata[idx].assets[asset];

                        if(!lnk.browser_download_url.endsWith(durl)) {
                            continue;
                        };

                        _this._dbg('insert data for #' + lnk.id + ': ' + durl);
                        $("<span class='Label Label--outline Label--latest'>" + lnk.download_count + "</span>")
                            .insertBefore(root);
                    }
                });
            });
        },

        ctor: function(debug)
        {
            this.debug = debug;
            this.process();
        },

        _dbg: function(msg)
        {
            if(this.debug) {
                console.log(msg);
            }
        }
    };

    var GHRCounter              = GHRCounterPrototype.ctor;
    GHRCounter.prototype        = GHRCounterPrototype;
    GHRCounter.prototype.ctor   = null;

    var ghr = new GHRCounter(false);

    // when async loading
    $(window).bind('pjax:success', function() { ghr.process(); });
});