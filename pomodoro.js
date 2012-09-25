$(function(){
	var counter, interval, text, minutes, seconds, timer, next;
	var state = {};

	state = {
		counter: 0,
		interval: undefined,
		current_timer: undefined,
		pomodoros: 0
	};

	timer = function(minutes) {

		state.counter = 60000*minutes;
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
		minutes = Math.floor(counter/1000/60);
		seconds = counter % 60;

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		$('#clock').text(minutes + ':' + seconds);
	};

	pomodoro    = function() {
		$('#pomodoros').text('Pomodoros: ' + state.pomodoros);
		state.current_timer = 'pomodoro';
		$('#desc').text('Work!');
		timer(25);
	}
	long_break  = function() {
		state.current_timer = 'long_break';
		$('#desc').text('Long break');
		timer(15);
	}
	small_break = function() {
		state.current_timer = 'small_break';
		$('#desc').text('Break');
		timer(5);
	}
});