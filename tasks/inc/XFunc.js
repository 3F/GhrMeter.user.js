/**
 * Copyright (c) 2018 Denis Kuzmin < entry.reg@gmail.com > :: github.com/3F
 */

'use strict';

module.exports = class XFunc extends function(){ this.constructor.prototype.$ =
{
    gulp: null, 
    cfg: null,

    /** A tiny wrapper around Node.js streams.Transform */
    through: null,

    /* ---- */ }}{ /* ---- */
 
    constructor(gulp, through, cfg)
    {
        super();

        this.$.gulp     = gulp;
        this.$.through  = through;
        this.$.cfg      = cfg;
    }
    
    /**
     * To expose gulp tasks from external files.
     * @param {string} t Task name.
     * @param {array} dep (Optional) dependent tasks for this task if exists.
     */
    tuse(t, dep)
    {
        require(this.$.cfg.basedir + this.$.cfg.tsksdir + t)
        (
            this.$.gulp, 
            this.$.cfg, 
            this,
        );
        
        let _exec = t + '-tasks';
        this.$.gulp.task(t, dep ? [_exec, ...dep] : [_exec]);
    }

    /**
     * To expose gulp tasks from external files via short format.
     * @param {Array} tasks 
     */
    rtuse(tasks)
    {
        for(let t of tasks)
        {
            if(typeof t === 'string') {
                this.tuse(t);
                continue;
            }
            
            if(t.length > 1) {
                this.tuse(t[0], t.slice(1));
            }
            else if(t.length == 1) {
                this.tuse(t[0]);
            }
        }
    }

    /**
     * Gulp compatible the if statement.
     * @param {boolean} condition 
     * @param {*} ifyes 
     * @param {*} ifno 
     */
    pif(condition, ifyes, ifno)
    {
        if(condition) {
            return ifyes ? ifyes.call(this) : this.nop();
        }
        return ifno ? ifno.call(this) : this.nop();
    };

    /**
     * Gulp compatible statement. To execute function if used debug configuration.
     * @param {*} f 
     */
    ifdbg(f)
    {
        return this.pif(this.isDbg(), f, this.nop);
    }

    ifnotdbg(f)
    {
        return this.pif(!this.isDbg(), f, this.nop);
    }

    /**
     * Gulp compatible statement for nothing.
     */
    nop()
    {
        return this.$.through.obj();
    }
    
    isDbg()
    {
        return this.$.cfg.isDebug();
    }
    
    /**
     * To start gulp task after finishing other task.
     * @param {*} before Locks executing the an after task until this done.
     * @param {*} after Executes this only after finishing the an before task.
     */
    run(before, after)
    {
        this.$.gulp.on('task_stop', (e) =>
        {
            if(e.task === before) {
                this.$.gulp.start(after);
            }
        });
        this.$.gulp.start(before);
    }
}
