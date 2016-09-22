//  Setup a super state object
var State = {
  init: function(target) {
    this.target = target
  },
  pushButton: function() {},
  entry: function() {},
  exit: function() {},
  setEndTime: function(interval) {
    this.endTime = new Date().getTime() + interval
  },
  getRemainingTime: function() {
    //  Calculate the time remaining and return it as a formatted string
    if (this.endTime) {
      var seconds = ( this.endTime - new Date().getTime() ) / 1000
      var minutes = Math.floor(seconds / 60)
      seconds -= minutes * 60
      return minutes + ':' + padDigits(seconds)
    }
  }
}

//  Create each possible state and override methods
var StateFresh = createObject(State, {
  pushButton: function() {
    this.target.changeState(StateWorking)
  },
  entry: function() {

  }
  //    fresh - which is a new one or after the reset button
  //    working - timer is counting the work interval
  //    resting - timer is counting the rest interval
  //    stopped - user has paused the clock. Skip this. Pomodoro or don't.

})
//  Create a clock object
var clock = {
  init: function() {
    this.display = document.getElementById('clock')
    this.work = document.getElementById('work')
    this.rest = document.getElementById('rest')
  }
  
  changeState: function(state) {}
}

function startTimer(interval) {

  var endTime = new Date().getTime() + interval
}

function userMilliseconds(elementName) {
  var min = $el[elementName].textContent || $el[elementName].innerText
  return min * 60 * 1000
}

function padDigits(s) {
  return s < 10 ? '0' + s : s
}

window.onload = function() {
  // $el.clock = document.getElementById('clock')
  // $el.work = document.getElementById('work')
  // $el.rest = document.getElementById('rest')
}
