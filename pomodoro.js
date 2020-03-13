$(function(){
  var counter, interval, text, minutes, seconds;
  var state = {};

  state = {
    counter: 25*60,
    interval: undefined,
    current_timer: 'pomodoro',
    pomodoros: 0
  };

  $("#token").val(localStorage.getItem("slackToken"));

  startPomodoroTimer = function(minutes) {
    if (typeof minutes == 'undefined') {
      resetPomodoroTimer();
      hideStartAction();
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
        nextPomodoroTimer();
      }
    }, 1000);
  };

  nextPomodoroTimer = function() {
    if (state.current_timer == 'pomodoro') {
      state.pomodoros++;
      if (state.pomodoros % 4 == 0) {
        longPomodoroBreak();
      } else {
        smallPomodoroBreak();
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

  resetPomodoroTimer = function () {
    if (state.current_timer == 'pomodoro') {
      pomodoro();
    } if (state.current_timer == 'small_break') {
      smallPomodoroBreak();
    } if (state.current_timer == 'long_break') {
      longPomodoroBreak();
    }
  }

  stopPomodoroTimer = function() {
    clearInterval(state.interval);
    toggleStartAction();
    $('#desc').text("\xa0");
    state.counter = 0;
    slackEndDnd();
    slackSetStatus("", "");
    setClock(0);
  }

  slackStartDnd = function() {
    $.each(tokens(), function(index, token) {
      $.get("https://slack.com/api/dnd.setSnooze?token=" + token + "&num_minutes=25&pretty=1")
    })
  }

  slackEndDnd = function() {
    $.each(tokens(), function(index, token) {
      $.get("https://slack.com/api/dnd.endDnd?token=" + token + "&pretty=1");
    });
  }

  slackSetStatus = function(status_emoji, status_text) {
    $.each(tokens(), function(index, token) {
      $.post("https://slack.com/api/users.profile.set?token=" + token + "&profile=" + encodeURIComponent(JSON.stringify({ "status_emoji": status_emoji, "status_text": status_text })));
    });
  }

  clearSlackData = function() {
    slackEndDnd();
    slackSetStatus("", "");
  }

  pomodoro = function() {
    $('#timers ul li').removeClass('active')
    $('#pomodoro').addClass('active');
    hideStartAction();
    $('#pomodoros').text('Pomodoros: ' + state.pomodoros);
    state.current_timer = 'pomodoro';
    $('#desc').text('Work!');
    slackStartDnd();
    slackSetStatus(":tomato:", "Pomodoro em andamento");
    startPomodoroTimer(25);
  }

  longPomodoroBreak = function() {
    $('#timers ul li').removeClass('active')
    $('#long_break').addClass('active');
    hideStartAction();
    state.current_timer = 'long_break';
    $('#desc').text('Long break');
    startPomodoroTimer(15);
    clearSlackData();
  }
  smallPomodoroBreak = function() {
    $('#timers ul li').removeClass('active')
    $('#small_break').addClass('active');
    hideStartAction();
    state.current_timer = 'small_break';
    $('#desc').text('Break');
    clearSlackData();
    startPomodoroTimer(5);
  }

  toggleStartAction = function() {
    $('#start_timer').toggle();
    $('#stop_timer').toggle();
  }

  hideStartAction = function() {
    $('#start_timer').hide();
    $('#stop_timer').show();
  }

  tokens = function() {
    return $("#token").val().split(/\r|\r\n|\n/)
  }

  $("#token").on("change", function() {
    localStorage.setItem("slackToken", $(this).val());
  });
  $("#pomodoro").on("click", function() { pomodoro() });
  $("#small_break").on("click", function() { smallPomodoroBreak() });
  $("#long_break").on("click", function() { longPomodoroBreak() });
  $("#stop_timer").on("click", function() { stopPomodoroTimer() });
  $("#start_timer").on("click", function() { startPomodoroTimer() });
  $("#reset_timer").on("click", function() { resetPomodoroTimer() });
});