/**
 * Copyright (c) 2017-2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
 */

// TODO: review. Migrated from gulp 3 -> gulp 4

import { src, dest, series, parallel } from 'gulp'
import { cfg } from './tasks/config'

import gclean from 'gulp-clean'
import { app } from './tasks/app'
import { scripts } from './tasks/scripts'

exports.build = series
(
    clean,
    scripts,
    app
);
exports.clean = clean;

function clean()
{
    return src
    ([
        cfg.dir.out, 
        cfg.dir.obj
    ], 
    {
        allowEmpty: true, 
        read: false
    })
    .pipe(gclean());
}

exports.default = function(cb)
{
    console.log
    (
        "Usage:\n\n" +
        "  gulp build --conf (release|debug*)\n" +
        "  gulp clean\n" +
        "\n" +
        "gulp --tasks\n"
    );
    cb();
}
