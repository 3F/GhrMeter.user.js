/**
 * Copyright (c) 2017-2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
 */

// TODO: review. Migrated from gulp 3 -> gulp 4

import { src, dest, series, parallel } from 'gulp';
import { cfg, dsrc } from './config';

import concat from 'gulp-concat';
import greplace from 'gulp-replace';

exports.app = series
(
    appHeader,
    parallel(
        appBuildMin,
        appBuildFull,
        // pkgVersion,
    ),
);

function abuild(ismin)
{
    return src([
        cfg.dir.obj + cfg.src.main + '.userscript.js',
        cfg.dir.obj + cfg.mfdir(ismin) + cfg.src.main + '.js'
    ])
    .pipe(concat(cfg.appname + (!ismin ? cfg.nonminified : '') + '.user.js'))
    .pipe(dest(cfg.dir.out + 'bundle/'));
}

function updv(fi, fo, srch)
{
    return src(fi)
    .pipe(greplace(srch,  (m, p1) => p1 + cfg.appver))
    .pipe(dest(fo));
}

function appHeader()
{
    return updv
    (
        cfg.dir.src + cfg.src.main + '.userscript.js',
        cfg.dir.obj,
        /(\/\/\s*@version\s*)[0-9.]+/
    );
}

function appBuildMin()
{
    return abuild(true);
};

function appBuildFull()
{
    return abuild(false);
};
