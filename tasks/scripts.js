/**
 * Copyright (c) 2017-2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
 */

// TODO: review. Migrated from gulp 3 -> gulp 4

import { src, dest, series, parallel } from 'gulp';
import { cfg, dsrc } from './config';

import concat from 'gulp-concat-util';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify'; // es6: gulp-terser
import sourcemaps from 'gulp-sourcemaps';
import beautify from 'gulp-beautify';
import gulpif from 'gulp-if';

exports.scripts = series
(
    jsCompile,
    parallel(
        jsMin,
        jsFull
    ),
);

function jspack(ismin)
{
    return src(cfg.dir.obj + cfg.src.main + '.js')
        .pipe(gulpif(cfg.isDebug(), sourcemaps.init({loadMaps: true})))
        .pipe(uglify({ mangle: ismin }))
        .pipe(gulpif(!ismin, beautify()))
        .pipe(gulpif(cfg.isDebug(), sourcemaps.write()))
        // .pipe(rename({ extname:  cfg.mfdir(ismin) + '.js' }))
        .pipe(gulpif(!ismin, concat.header('\n\n/* -- @babel/preset-env targets: ' + cfg.babelTrgt + ' -- */\n\n')))
        .pipe(dest(cfg.dir.obj + cfg.mfdir(ismin)));
}

function jsMin()
{
    return jspack(true);
}

function jsFull()
{
    return jspack(false);
}

function jsCompile()
{
    let presets = [[
        "@babel/preset-env",
        {
            // "targets": {
            //     "esmodules": true
            // }
            "targets": cfg.babelTrgt,
        }
    ]];
    
    // if(!cfg.isDebug()) {
    //     presets.push(["minify"]);
    // }
    
    return browserify(
        {
            basedir: '.',
            debug: cfg.isDebug(),
            entries: [cfg.dir.src + cfg.src.main + '.js'],
            cache: {},
            packageCache: {}
        })
        .transform('babelify', 
        {
            "presets": presets,
            "plugins": [
                ["@babel/plugin-proposal-class-properties", { "loose": true }]
            ],
            sourceMaps: cfg.isDebug()
        })
        .bundle()
        .pipe(source(cfg.src.main + '.js'))
        .pipe(buffer())
        .pipe(dest(cfg.dir.obj));
}