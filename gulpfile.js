/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > :: github.com/3F
 */

const CFG_DEBUG     = 'debug';
const CFG_RELEASE   = 'release';

let cfg =
{
    type: CFG_DEBUG,
    
    outdir: './dist/',
    srcdir: './src/',
    objdir: './obj/',

    tsksdir: './tasks/',
    tsincdir: './tasks/inc/',
    
    basedir: process.cwd() + '/',
    
    /** .ts, .js, ... entry point */
    srcmain: 'app',

    appname: 'GhrMeter',

    /** app version */
    fver: './.version',
    appver: function() { return this._v || (this._v = require('fs').readFileSync(this.fver)); },

    /** raw arguments to current process */
    argv: null,
    isDebug: function() { return this.type == CFG_DEBUG; },
}

// #-

const gulp  = require('gulp');
const XFunc = require(cfg.tsincdir + 'XFunc');
const xf    = new XFunc(gulp, require('through2'), cfg);

// #-

gulp.task('default', () => 
{
    cfg.argv = require('minimist')(process.argv.slice(2));

    if(cfg.argv['t']) {
        cfg.type = cfg.argv['t'].toLowerCase();
    }
    console.log("\n  [[ We'll process tasks for '" + cfg.type + "' configuration ]]");

    console.log('\n  Optional arguments: ');
    console.log('    -t (release|debug) : "debug" by default');
    console.log('\n');

    xf.run('clean', 'build');
});

// # --- main tasks ------------

gulp.task('build', ['scripts', 'app']);
xf.rtuse(['scripts', 'app']);

gulp.task('clean', () =>
{
    const clean = require('gulp-clean');
    return gulp.src([cfg.objdir, cfg.outdir], {read: false}).pipe(clean());    
});
