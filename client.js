//  Setup a super state object
var State = {
  //  Universal methods
  init: function(target) {
    this.target = target
  },
  setEndTime: function(interval) {
    //  Expects interval in milliseconds
    /*  Storing endTime in clock rather than state so that it will persist if
        I decide to go add pausing of pomodoro intervals */
    this.target.endTime = new Date().getTime() + interval
  },
  getRemainingTime: function() {
    //  Calculate the time remaining and return it in milliseconds
    /*  Separate from display so that it can be used in calculating the colour
        gradient. */
    if (this.target.endTime) {
      return Math.max(this.target.endTime - new Date().getTime(),0)
    }
  },
  displayRemainingTime: function() {
    if (this.target.endTime) {
      var seconds = Math.floor(this.getRemainingTime() / 1000)
      var minutes = Math.floor(seconds / 60)
      seconds -= minutes * 60
      this.target.display.innerText = minutes + ':' + padDigits(seconds)
    }
  },
  setUserInterval: function(elementName) {
    var min = this.target[elementName].value
    this.target.interval = min * 60 * 1000
  },
  getInterval: function() {
    //  Return the total work or rest time in milliseconds.
    return this.target.interval
  }
}

//  Create each possible state and override methods
var StateFresh = Object.create(State, { //Using the properties object is a mistake
  //  StateFresh - page load or after the reset button
  pushButton: {
    value: function() {
      this.target.changeState(StateWorking)
      return false
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
  entry: {
    value: function() {
      this.target.endTime = null  //  Make sure no Remaining Time methods fire
      this.target.display.innerText = this.target.work.value + ':00'
      this.target.button.innerText = "Start"
      //  Set background color to the Rest color
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
  exit: {
    value: function() {},
    enumerable: false
  }
  //    resting - timer is counting the rest interval
  //    stopped - user has paused the clock. Skip this. Pomodoro or don't.
})

var StateWorking = Object.create(State, {
  //    working - timer is counting the work interval
  pushButton: {
    value: function() {
      this.target.interrupt = true
      this.target.changeState(StateFresh)
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
  entry: {
    value: function() {
      //  Set the work interval
      this.setUserInterval('work')
      this.setEndTime(this.target.interval)

      //  Allow the clock to run
      this.target.interrupt = false

      //  Start the clock
      var _this = this
      var t = setInterval(function() {
        if (_this.target.interrupt) { //The user has pressed "Reset"
          clearInterval(t)
          _this.target.changeState(StateFresh)
        } else if (!_this.getRemainingTime()) { //We are out of time
          clearInterval(t)
          _this.target.changeState(StateResting)
        } else {
          _this.displayRemainingTime()
        }
      }, 100)

      //  Change the display
      this.target.status.innerText = 'You Should Be Working!'
      this.target.button.innerText = "Reset"

      //  TODO: Change the background color with clock progress
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
  exit: {
    value: function() {},
    enumerable: false
  }
})

var StateResting = Object.create(State, {
  //    resting - timer is counting the rest interval
  pushButton: {
    value: function() {
      this.target.interrupt = true
      this.target.changeState(StateFresh)
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
  entry: { // TODO: This was a big copy/paste. It should be in the super.
    value: function() {
      //  Set the work interval
      this.setUserInterval('rest')
      this.setEndTime(this.target.interval)

      //  Allow the clock to run
      this.target.interrupt = false

      //  Start the clock
      var _this = this
      var t = setInterval(function() {
        if (_this.target.interrupt) { //The user has pressed "Reset"
          clearInterval(t)
          _this.target.changeState(StateFresh)
        } else if (!_this.getRemainingTime()) { //We are out of time
          clearInterval(t)
          _this.target.changeState(StateWorking)
        } else {
          _this.displayRemainingTime()
        }
      }, 100)

      //  Change the display
      this.target.status.innerText = 'You Should Be Resting!'
      this.target.button.innerText = "Reset"

      //  TODO: Change the background color with clock progress
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
  exit: {
    value: function() {},
    enumerable: false
  }
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
    this.status = document.getElementById('status')

    //  Define initial state
    this.workMinutes = 20
    this.restMinutes = 10
    this.state = null

    //  Create state objects
    StateFresh.init(this)
    StateWorking.init(this)
    StateResting.init(this)

    //  Start with a fresh Pomodoro
    this.changeState(StateFresh)

    //  Listen to the button
    this.button.addEventListener('click', this.pushButton.bind(this))
  },
  changeState: function(state) {
    this.state && this.state.exit()
    this.state = state
    this.state.entry()
  },
  pushButton: function() {
    this.state.pushButton()
    return false
  }
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
