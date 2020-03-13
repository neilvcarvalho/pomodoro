$(function(){
  var counter, interval, text, minutes, seconds;
  var state = {};

  state = {
    counter: 25*60,
    interval: undefined,
    current_timer: 'pomodoro',
    pomodoros: 0
  };

  start_timer = function(minutes) {

    if (typeof minutes == 'undefined') {
      reset_timer();
      hide_start();
    } else {
      state.counter = 60*minutes;
    }

    clearInterval(state.interval);

    setClock(state.counter);

    state.interval = setInterval(function(){

      state.counter--;

      if (state.counter > 0) {
        setClock(state.counter);
      }
      else {
        next_timer();
      }
    }, 1000);
  };

  next_timer = function() {
    if (state.current_timer == 'pomodoro') {
      state.pomodoros++;
      if (state.pomodoros % 4 == 0) {
        long_break();
      } else {
        small_break();
      }
    } else {
      pomodoro();
    }
  }

  setClock = function(counter) {
    minutes = Math.floor(counter/60);
    seconds = counter % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    $('#clock').text(minutes + ':' + seconds);
  };

  reset_timer = function () {
    if (state.current_timer == 'pomodoro') {
      pomodoro();
    } if (state.current_timer == 'small_break') {
      small_break();
    } if (state.current_timer == 'long_break') {
      long_break();
    }
  }

  stop_timer = function() {
    clearInterval(state.interval);
    toggle_start();
    $('#desc').text("\xa0");
    state.counter = 0;
    setClock(0);
  }

  pomodoro    = function() {
    $('#timers ul li').removeClass('active')
    $('#pomodoro').addClass('active');
    hide_start();
    $('#pomodoros').text('Pomodoros: ' + state.pomodoros);
    state.current_timer = 'pomodoro';
    $('#desc').text('Work!');
    start_timer(25);
  }
  long_break  = function() {
    $('#timers ul li').removeClass('active')
    $('#long_break').addClass('active');
    hide_start();
    state.current_timer = 'long_break';
    $('#desc').text('Long break');
    start_timer(15);
  }
  small_break = function() {
    $('#timers ul li').removeClass('active')
    $('#small_break').addClass('active');
    hide_start();
    state.current_timer = 'small_break';
    $('#desc').text('Break');
    start_timer(5);
  }

  toggle_start = function() {
    $('#start_timer').toggle();
    $('#stop_timer').toggle();
  }
  hide_start = function() {
    $('#start_timer').hide();
    $('#stop_timer').show();
  }
});