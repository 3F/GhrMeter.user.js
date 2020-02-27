/**
 * Copyright (c) 2017-2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
 */

// TODO: review. Migrated from gulp 3 -> gulp 4

const configs =
{
    "debug": {
        isDbg: true,
    },
    "release": {
        
    },
    "release-public": {
        
    },
}

const cfg =
{
    dir:
    {
        src: 'src/',
        out: 'dist/',
        obj: 'obj/',
    },
    
    src:
    {
        /** .ts, .js, ... entry point */
        main: 'app',
    },
    
    nonminified: '.non-minified',
    appname: 'GhrMeter',
    babelTrgt: '> 0.25%, not dead',
    
    /** arguments to current process */
    argv: null,
    appver: null,

    mfdir: function(ismin) { return ismin ? '.m/' : '.f/'; },
    isDebug: function() { return this.type.data['isDbg'] == true; },
    
    type:
    {
        name: undefined,
        data: undefined,
    },
}

/* = = = = = = = = = = = = */

import minimist from 'minimist';
import path from 'path';
import { version } from '../package.json';

exports.cfg = cfg;
exports.setconf = setconf;
exports.jpath = path.posix.join; // do not use win32 because of gulp reserve
exports.dsrc = (input) => exports.jpath(cfg.dir.src, input || '');
exports.dobj = (input) => exports.jpath(cfg.dir.obj, input || '');

function setconf(confname)
{
    if(!configs[confname])
    {
        cfg.type.name = undefined;
        cfg.type.data = undefined;
        return false;
    }
    
    cfg.type.name   = confname;
    cfg.type.data   = configs[confname];
    return true;
}

(function()
{
    setconf('debug');
    cfg.argv    = minimist(process.argv.slice(2));
    cfg.appver  = version;

    if(cfg.argv['conf'])
    {
        const cfgname = cfg.argv['conf'].toLowerCase();
        if(!setconf(cfgname)) {
            throw new Error("Configuration '" + cfgname+ "' is not defined.");
        }
    }

    console.log("\n\x1b[47m \x1b[107m \x1b[100m  '" + cfg.type.name + "' configuration is activated \x1b[0m\n");

})();