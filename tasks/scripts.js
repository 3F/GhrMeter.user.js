/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > :: github.com/3F
 */

module.exports = (gulp, cfg, _) => 
{
    gulp.task('scripts-tasks', ['js-compile']);
    
    gulp.task('js-compile', () =>
    {
        const browserify    = require('browserify');
        const uglify        = require('gulp-uglify');
        // const uglify        = require('gulp-uglify-es').default;
        const sourcemaps    = require('gulp-sourcemaps');
        const source        = require('vinyl-source-stream');
        const buffer        = require('vinyl-buffer');

        let presets = [[
            "@babel/preset-env",
            {
                // "targets": {
                //     "esmodules": true
                // }
                "targets": "> 0.25%, not dead"
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
                
                .pipe(_.ifdbg(_=> sourcemaps.init({loadMaps: true})))
                .pipe(_.ifnotdbg(uglify))
                .pipe(_.ifdbg(_=> sourcemaps.write()))

                // .pipe(sourcemaps.init({loadMaps: true}))
                // .pipe(uglify())
                // .pipe(sourcemaps.write())
                
                .pipe(gulp.dest(cfg.objdir));
    });
}