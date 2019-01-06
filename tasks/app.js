/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > :: github.com/3F
 */

module.exports = (gulp, cfg, _) => 
{
    gulp.task('app-tasks', ['app-build', 'pkg-version']);

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

    gulp.task('app-build', ['app-header'], () =>
    {
        const concat = require('gulp-concat');
        
        return gulp.src([
                    cfg.objdir + cfg.srcmain + '.userscript.js', 
                    cfg.objdir + cfg.srcmain + '.js'
                ])
                .pipe(concat(cfg.appname + '.user.js'))
                .pipe(gulp.dest(cfg.outdir + 'bundle/'));
    });    
};