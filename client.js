//  Setup a super state object
var State = {
  //  Universal methods
  init: function(target) {
    this.target = target
  },
  setEndTime: function(interval) {
    //  Expects interval in milliseconds
    /*  Storing endTime in clock rather than state so that it will persist if
        I decide to go soft and allow pausing of pomodoro intervals */
    this.target.endTime = new Date().getTime() + interval
  },
  getRemainingTime: function() {
    //  Calculate the time remaining and return it in milliseconds
    /*  Separate from display so that it can be used in calculating the colour
        gradient. */
    if (this.target.endTime) {
      return this.target.endTime - new Date().getTime()
    }
  },
  displayRemainingTime: function() {
    if (this.target.endTime) {
      var seconds = Math.floor(getRemainingTime() / 1000)
      var minutes = Math.floor(seconds / 60)
      seconds -= minutes * 60
      this.target.clock.innerText = minutes + ':' + padDigits(seconds)
    }
  },
  setInterval: function(elementName) {
    var min = $el[elementName].textContent || $el[elementName].innerText
    this.target.interval = min * 60 * 1000
  },
  getInterval: function() {
    //  Return the total work or rest time in milliseconds.
    return this.target.interval
  }
}

//  Create each possible state and override methods
var StateFresh = Object.create(State, {
  //  StateFresh - page load or after the reset button
  pushButton: {
    value: function() {
      this.target.changeState(StateWorking)
    },
    enumerable: false
  },
  entry: {
    value: function() {
      this.target.endTime = null  //  Make sure no Remaining Time methods fire
      this.target.display.innerText = this.target.work.value + ':00'
      this.target.button.innerText = "Start"
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
  exit: {
    value: function() {},
    enumerable: false
  }
  //    working - timer is counting the work interval
  //    resting - timer is counting the rest interval
  //    stopped - user has paused the clock. Skip this. Pomodoro or don't.
})

//  Create a clock object
var clock = {
  init: function() {
    /* TODO: Store states in an object/list (in here?) so that init doesn't
    need to know if new ones are added. */

    //  Get some helpers
    this.display = document.getElementById('clock')
    this.work = document.getElementById('work')
    this.rest = document.getElementById('rest')
    this.button = document.getElementById('start-stop')
    //  Define initial state
    this.workMinutes = 20
    this.restMinutes = 10
    this.state = null
    //  Create state objects
    StateFresh.init(this)
    //  Start with a fresh Pomodoro
    this.changeState(StateFresh)
  },
  changeState: function(state) {
    this.state && this.state.exit()
    this.state = state
    this.state.entry()
  },
}

function padDigits(s) { //  Where to keep a lonely helper function?
  return s < 10 ? '0' + s : s
}

window.onload = function() {
  clock.init()
  // $el.clock = document.getElementById('clock')
  // $el.work = document.getElementById('work')
  // $el.rest = document.getElementById('rest')
}
