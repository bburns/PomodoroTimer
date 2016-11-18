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
  reset() {
      this.stop();
    }
    // pause/resume timer
  toggle() {
      if (!this.tickId) {
        if (!this.remainingSecs)
          this.remainingSecs = this.totalSecs;
        this.resume();
      } else {
        this.pause();
      }
    }
    // call tickfn and donefn when timer is finished
  callTickAndDone() {
    this.tickfn(this);
    this.remainingSecs -= 1;
    if (this.remainingSecs < 0) {
      this.stop();
      this.donefn(this);
    }
  }
}

class Pomodoro {
  constructor(workTime, breakTime, tickfn, donefn, resetfn) {
    this.workTime = workTime;
    this.breakTime = breakTime;
    this.tickfn = tickfn;
    this.donefn = donefn;
    this.resetfn = resetfn;
    this.reset();
  }
  getTimer() {
    var time = (this.phase == 'Work') ? this.workTime : this.breakTime; // minutes
    var timer = new Timer(time * 60, this.callTick.bind(this), this.callDone.bind(this));
    return timer;
  }
  setWorkTime(time) {
    this.workTime = time;
  }
  setBreakTime(time) {
    this.breakTime = time;
  }
  callTick() {
    //console.log(this.phase, this.timer.remainingSecs);
    this.tickfn();
  }
  callDone() {
    this.donefn();
    this.phase = (this.phase == 'Work') ? 'Break' : 'Work';
    console.log('switch to', this.phase);
    this.timer = this.getTimer();
    this.toggle(); // start
  }
  toggle() {
    if (!this.timer)
      this.timer = this.getTimer();
    this.timer.toggle();
  }
  reset() {
    if (this.timer)
      this.timer.reset();
    this.phase = 'Work';
    this.timer = null;
    this.resetfn();
  }
}

var audio = new Audio('http://res.cloudinary.com/owl-syme/video/upload/v1460932445/ding_a9hbqn.mp3');

function playDing() {
  console.log('ding');
  if (audio)
    audio.play();
}

function getMMSS(secs) {
  var minutes = Math.floor(secs / 60);
  var seconds = "0" + (secs - minutes * 60);
  return minutes + ":" + seconds.substr(-2);
}

function drawTimer(phase, fraction) {

  const canvassize = 300;
  const cx = 150;
  const cy = 150;
  const radius = 149;

  var start = -Math.PI / 2;
  var stop = Math.PI * 3 / 2;

  var radians = start + Math.PI * 2 * fraction;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvassize, canvassize);

  ctx.beginPath();
  ctx.strokeStyle = (phase=='Work') ? "rgb(0, 100, 0)" : "rgb(100,0,0)";
  ctx.lineWidth = 2;
  ctx.arc(cx, cy, radius, start, stop, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = (phase=='Work') ? "rgb(0, 200, 0)" : "rgb(200,0,0)";
  ctx.lineWidth = 2;
  ctx.arc(cx, cy, radius, start, radians, false);
  ctx.stroke();
}

// -----------------------------------------------------

var tick = () => {
  //. using global here - not ideal
  var phase = pomodoro.phase;
  var timer = pomodoro.timer;
  var fraction = timer.remainingSecs / timer.totalSecs;
  //console.log('tick: ' + timer.remainingSecs);
  var mmss = getMMSS(timer.remainingSecs);
  $('#phase').text(phase);
  $('#time').text(mmss);
  drawTimer(phase, fraction);
};

var done = () => {
  console.log("time's up!");
  $('#time').text("Time's up!");
  playDing();
};

var reset = () => {
  console.log("reset");
  $('#phase').text("");
  $('#time').text("");
};

var workTime = 25; // minutes
var breakTime = 5;
//var workTime = 0.05; // minutes
//var breakTime = 0.05;
var pomodoro = new Pomodoro(workTime, breakTime, tick, done, reset);
$('#work-time').val(workTime);
$('#break-time').val(breakTime);

$(document).ready(function() {
  drawTimer('Work', 0);
  $('#startstop').on('click', function() {
    pomodoro.toggle();
  });
  $('#reset').on('click', function() {
    pomodoro.reset();
    drawTimer('Work', 0);
  });
  $('#work-time').on('change', function(evt) {
    var time = evt.target.value; // minutes
    pomodoro.setWorkTime(time);
  });
  $('#break-time').on('change', function(evt) {
    var time = evt.target.value;
    pomodoro.setBreakTime(time);
  });
});