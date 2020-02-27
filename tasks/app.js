/**
 * Copyright (c) 2017-2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
 */

module.exports = (gulp, cfg, _) => 
{
    gulp.task('app-tasks', ['app-build-min', 'app-build-full', 'pkg-version']);

    let abuild = (ismin) => 
    {
        const concat = require('gulp-concat');
        
        return gulp.src([
                    cfg.objdir + cfg.srcmain + '.userscript.js',
                    cfg.objdir + cfg.mfdir(ismin) + cfg.srcmain + '.js'
                ])
                .pipe(concat(cfg.appname + (!ismin ? cfg.nonmangled : '') + '.user.js'))
                .pipe(gulp.dest(cfg.outdir + 'bundle/'));
    }

    let updv = (fi, fo, srch) =>
    {
        const greplace = require('gulp-replace');
        
        return gulp.src(fi)
                .pipe(greplace(srch,  (m, p1) => p1 + cfg.appver()))
                .pipe(gulp.dest(fo));
    }

    gulp.task('app-header', ['scripts'], () =>
    {
        return updv
        (
            cfg.srcdir + cfg.srcmain + '.userscript.js',
            cfg.objdir,
            /(\/\/\s*@version\s*)[0-9.]+/
        );
    });

    gulp.task('pkg-version', ['scripts'], () =>
    {
        return updv
        (
            './package.json',
            './',
            /(version[^:]+?:[^"]+?")[0-9.]+/
        );
    });

    gulp.task('app-build-min', ['app-header'], () =>
    {
        return abuild(true);
    });

    gulp.task('app-build-full', ['app-header'], () =>
    {
        return abuild(false);
    });
};