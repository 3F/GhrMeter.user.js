/**
 * Copyright (c) 2017-2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
 */

module.exports = (gulp, cfg, _) => 
{
    gulp.task('scripts-tasks', ['js-min', 'js-full']);

    let jspack = (ismin) =>
    {
        const uglify        = require('gulp-uglify');
        // const uglify        = require('gulp-uglify-es').default;
        const sourcemaps    = require('gulp-sourcemaps');
        const beautify      = require('gulp-beautify');
        const concat        = require('gulp-concat-util');
        
        return gulp.src(cfg.objdir + cfg.srcmain + '.js')
            .pipe(_.ifdbg(_=> sourcemaps.init({loadMaps: true})))
            .pipe(uglify({ mangle: ismin }))
            .pipe(_.pif(!ismin, beautify))
            .pipe(_.ifdbg(_=> sourcemaps.write()))
            // .pipe(rename({ extname:  cfg.mfdir(ismin) + '.js' }))
            .pipe(_.pif(!ismin, () => 
                concat.header('\n\n/* -- @babel/preset-env targets: ' + cfg.babelTrgt + ' -- */\n\n'))
            )
            .pipe(gulp.dest(cfg.objdir + cfg.mfdir(ismin)));
    }
    
    gulp.task('js-min', ['js-compile'], () =>
    {
        return jspack(true);
    });

    gulp.task('js-full', ['js-compile'], () =>
    {
        return jspack(false);
    });
    
    gulp.task('js-compile', () =>
    {
        const browserify    = require('browserify');
        const source        = require('vinyl-source-stream');
        const buffer        = require('vinyl-buffer');

        let presets = [[
            "@babel/preset-env",
            {
                // "targets": {
                //     "esmodules": true
                // }
                "targets": cfg.babelTrgt
            }
        ]];
        
        // if(!cfg.isDebug()) {
        //     presets.push(["minify"]);
        // }
        
        return browserify(
                {
                    basedir: '.',
                    debug: cfg.isDebug(),
                    entries: [cfg.srcdir + cfg.srcmain + '.js'],
                    cache: {},
                    packageCache: {}
                })
                .transform('babelify', 
                {
                    "presets": presets,
                    sourceMaps: cfg.isDebug()
                })
                .bundle()
                .pipe(source(cfg.srcmain + '.js'))
                .pipe(buffer())
                .pipe(gulp.dest(cfg.objdir));
    });
}