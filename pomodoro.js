
'use strict';


// a timer object that can be stopped and restarted.
// pass nseconds, tick fn to call each sec, and done fn to call when time is up.
class Timer {
    constructor(totalSecs, tickfn, donefn) {
        this.totalSecs = totalSecs;
        this.tickfn = tickfn;
        this.donefn = donefn;
        this.remainingSecs = null;
        this.tickId = null;
    }
    // start new timer
    start() {
        if (!this.tickId) {
            this.remainingSecs = this.totalSecs;
            this.resume();
        }
    }
    // resume existing timer
    resume() {
        if (!this.tickId) {
            this.tickId = setInterval(this.callTickAndDone.bind(this), 1000); // call tick every 1000 ms
            this.callTickAndDone.bind(this)(); // call immediately
        }
    }
    // pause existing timer
    pause() {
        if (this.tickId) {
            clearInterval(this.tickId);
            this.tickId = 0;
        }
    }
    // stop existing timer
    stop() {
        this.pause();
        this.remainingSecs = null;
    }
    // pause/resume timer
    toggle() {
        if (this.tickId) {
            this.pause();
        } else {
            this.resume();
        }
    }
    // call tickfn and donefn when timer is finished
    callTickAndDone() {
        this.tickfn(this);
        this.remainingSecs -= 1;
        if (this.remainingSecs < 0) {
            this.stop();
            this.donefn();
        }
    }
}

// works
var tick = (timer)=>{
    // console.log('tick');
    console.log('tick: ' + timer.remainingSecs);
};
var done = ()=>{
    console.log('done!');
};
var timer = new Timer(3, tick, done);
timer.start();
// timer.stop();
// timer.start();
// timer.toggle();
// timer.toggle();
// timer.toggle();
// timer.startStop();
// timer.startStop();
// timer.startStop();


// -------------


// // a pomodoro alternates between two timers - one for work, one for break.
// class Pomodoro {
//     constructor(tickfn, donefn) {
//         this.workmins = 0.05;
//         this.breakmins = 0.025;
//         this.phase = 'work';
//         this.tickfn = tickfn;
//         this.donefn = donefn;
//         this.timer = undefined;
//     }
//     start() {
//         console.log('starting ' + this.phase + ' phase');
//         var time = (this.phase=='work') ? this.workmins : this.breakmins; // mins
//         this.timer = new Timer(time*60, this.tickfn.bind(this), this._done.bind(this));
//         this.timer.start();
//     }
//     _done() {
//         this.stop();
//         this.donefn();
//         this.phase = (this.phase=='work') ? 'break' : 'work';
//         this.start();
//     }
//     stop() {
//         if (this.timer) 
//             this.timer.stop();
//     }
//     startStop() {
//         if (this.timer) 
//             this.timer.startStop();
//     }
//     // set(state) {
//     //     this.state = Object.assign({}, this.state, state);
//     // }
//     // get() {
//     //     return this.state;
//     // }
//     increase(key) {
//         this[key]+=1;
//     }
//     decrease(key) {
//         this[key]-=1;
//         if (this[key]<1) this[key]=1;
//     }
// }

// // -----

// // how much time is left out of how much? 
// var tick = (timer)=>{
//     console.log('tick');
//     console.log(timer.remainingSecs + ' of ' + timer.totalSecs + ' secs');
// };
// var done = ()=>{
//     console.log('done!');
// };

// // pomodoro will cycle back and forth between work and break phases until stopped
// // so run in console, not emacs
// var pomodoro = new Pomodoro(tick, done);
// pomodoro.start();
// pomodoro.stop();
// pomodoro.start();




