const chai = require("chai");
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const displayObject = require('../src/display_object.js');

let id;
let hydrationInfo;
let sleepInfo;
let activityInfo;
let userStorage;
let dateString;

describe.only('DOM functionality', function() {
  before(function() {
    global.displayObject = {};
    chai.spy.on(displayObject, ['displayDayHydration', 'displaySleepQualityToday', 'displayAvgMinsToday'], () => {})
    });
    
    beforeEach(function() {
      id = 0;
      hydrationInfo = {};
      sleepInfo = {};
      activityInfo = {};
      userStorage = [];
      dateString = "";
  });

  it('should be able to call displayDayHydration once', function() {
    displayObject.displayDayHydration(id, hydrationInfo, dateString);
    expect(displayObject.displayDayHydration).to.have.been.called(1);
  });

  it('displayDayHydration should be called with an id, hydrationInfo, and a dateString', function() {
    displayObject.displayDayHydration(id, hydrationInfo, dateString);
    expect(displayObject.displayDayHydration).to.have.been.called.with(id, hydrationInfo, dateString);
  });

  it('should be able to call displaySleepQualityToday once', function() {
    displayObject.displaySleepQualityToday(id, sleepInfo, dateString);
    expect(displayObject.displaySleepQualityToday).to.have.been.called(1);
  });

  it('displaySleepQualityToday should be called with an id, sleepInfo, and a dateString', function() {
    displayObject.displaySleepQualityToday(id, hydrationInfo, dateString);
    expect(displayObject.displaySleepQualityToday).to.have.been.called.with(id, hydrationInfo, dateString);
  });

  it('should be able to call displayAvgMinsToday once', function() {
    displayObject.displayAvgMinsToday(activityInfo, dateString, userStorage);
    expect(displayObject.displayAvgMinsToday).to.have.been.called(1);
  });

  it('displayAvgMinsToday should be called with activityInfo, a dateString, and userStorage' , function() {
    displayObject.displayAvgMinsToday(activityInfo, dateString, userStorage);
    expect(displayObject.displayAvgMinsToday).to.have.been.called.with(activityInfo, dateString, userStorage);
  });
});