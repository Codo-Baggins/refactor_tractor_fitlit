import { expect } from 'chai';
import HealthMonitor from '../src/Health-monitor';
import Sleep from '../src/Sleep';
import Activity from '../src/Activity';
import Hydration from '../src/Hydration';
import UserRepo from '../src/User-repo';
import User from '../src/User';

describe('HealthMonitor', function() {
  let hydrationData;
  let sleepData;
  let activityData;
  let hydration;
  let sleep;
  let activity;
  let user1;
  let user2;
  let users;
  let userRepo;
  let healthMonitor;
  let healthMonitorTwo;
  let healthMonitorThree;

  beforeEach(function() {
    hydrationData = [{
        "userID": 1,
        "date": "2019/06/15",
        "numOunces": 37
      },
      {
        "userID": 2,
        "date": "2019/06/15",
        "numOunces": 38
      },
      {
        "userID": 3,
        "date": "2019/05/09",
        "numOunces": 1
      },
      {
        "userID": 4,
        "date": "2019/04/15",
        "numOunces": 36
      },
      {
        "userID": 2,
        "date": "2018/10/23",
        "numOunces": 34
      },
      {
        "userID": 1,
        "date": "2018/06/16",
        "numOunces": 39
      },
      {
        "userID": 3,
        "date": "2018/03/30",
        "numOunces": 2
      },
      {
        "userID": 4,
        "date": "2018/02/01",
        "numOunces": 28
      },
      {
        "userID": 1,
        "date": "2016/08/22",
        "numOunces": 30
      },
      {
        "userID": 3,
        "date": "2016/05/14",
        "numOunces": 3
      },
      {
        "userID": 2,
        "date": "2016/04/27",
        "numOunces": 40
      },
      {
        "userID": 4,
        "date": "2019/03/15",
        "numOunces": 35
      },
      {
        "userID": 4,
        "date": "2019/09/20",
        "numOunces": 40
      },
      {
        "userID": 4,
        "date": "2019/09/19",
        "numOunces": 30
      },
      {
        "userID": 4,
        "date": "2019/09/18",
        "numOunces": 40
      },
      {
        "userID": 4,
        "date": "2019/09/17",
        "numOunces": 40
      },
      {
        "userID": 4,
        "date": "2019/09/16",
        "numOunces": 30
      },
      {
        "userID": 4,
        "date": "2019/09/15",
        "numOunces": 30
      },
    ];

    sleepData = [{
        "userID": 1,
        "date": "2017/06/15",
        "hoursSlept": 6.1,
        "sleepQuality": 2.2
    },
      {
        "userID": 2,
        "date": "2017/06/15",
        "hoursSlept": 7,
        "sleepQuality": 4.7
      },
      {
        "userID": 3,
        "date": "2017/06/15",
        "hoursSlept": 2,
        "sleepQuality": 3
      },
      {
        "userID": 4,
        "date": "2017/06/15",
        "hoursSlept": 5.4,
        "sleepQuality": 3
      },
      {
        "userID": 1,
        "date": "2018/07/15",
        "hoursSlept": 4.1,
        "sleepQuality": 3.6
      },
      {
        "userID": 2,
        "date": "2018/07/15",
        "hoursSlept": 9.6,
        "sleepQuality": 2.9
      },
      {
        "userID": 3,
        "date": "2018/07/15",
        "hoursSlept": 2,
        "sleepQuality": 3
      },
      {
        "userID": 4,
        "date": "2018/07/23",
        "hoursSlept": 8.1,
        "sleepQuality": 3.5
      },
      {
        "userID": 1,
        "date": "2019/05/30",
        "hoursSlept": 8.9,
        "sleepQuality": 2.2
      },
      {
        "userID": 2,
        "date": "2019/05/30",
        "hoursSlept": 4.4,
        "sleepQuality": 1.6
      },
      {
        "userID": 3,
        "date": "2019/05/30",
        "hoursSlept": 4,
        "sleepQuality": 1
      },
      {
        "userID": 4,
        "date": "2019/05/30",
        "hoursSlept": 8,
        "sleepQuality": 3.4
      },
      {
        "userID": 1,
        "date": "2019/08/22",
        "hoursSlept": 10.1,
        "sleepQuality": 1.8
      },
      {
        "userID": 2,
        "date": "2019/08/22",
        "hoursSlept": 6.9,
        "sleepQuality": 1.2
      },
      {
        "userID": 3,
        "date": "2019/08/22",
        "hoursSlept": 4,
        "sleepQuality": 1
      },
      {
        "userID": 4,
        "date": "2019/06/21",
        "hoursSlept": 6.1,
        "sleepQuality": 3.5
      },
      {
        "userID": 4,
        "date": "2019/06/20",
        "hoursSlept": 4.7,
        "sleepQuality": 4
      },
      {
        "userID": 4,
        "date": "2019/06/19",
        "hoursSlept": 10.1,
        "sleepQuality": 1.3
      },
      {
        "userID": 4,
        "date": "2019/06/18",
        "hoursSlept": 7.9,
        "sleepQuality": 1.6
      },
      {
        "userID": 4,
        "date": "2019/06/17",
        "hoursSlept": 5.9,
        "sleepQuality": 1.6
      },
      {
        "userID": 4,
        "date": "2019/06/16",
        "hoursSlept": 9.6,
        "sleepQuality": 1
      },
      {
        "userID": 4,
        "date": "2019/06/15",
        "hoursSlept": 9,
        "sleepQuality": 3.1
      },
      {
        "userID": 2,
        "date": "2019/06/21",
        "hoursSlept": 6.1,
        "sleepQuality": 3.5
      },
      {
        "userID": 2,
        "date": "2019/06/20",
        "hoursSlept": 4.7,
        "sleepQuality": 4
      },
      {
        "userID": 2,
        "date": "2019/06/19",
        "hoursSlept": 10.1,
        "sleepQuality": 3.3
      },
      {
        "userID": 2,
        "date": "2019/06/18",
        "hoursSlept": 7.9,
        "sleepQuality": 3.6
      },
      {
        "userID": 2,
        "date": "2019/06/17",
        "hoursSlept": 5.9,
        "sleepQuality": 3.6
      },
      {
        "userID": 2,
        "date": "2019/06/16",
        "hoursSlept": 9.6,
        "sleepQuality": 4
      },
      {
        "userID": 2,
        "date": "2019/06/15",
        "hoursSlept": 9,
        "sleepQuality": 3.1
      },
      {
        "userID": 5,
        "date": "2019/06/21",
        "hoursSlept": 9,
        "sleepQuality": 4
      },
      {
        "userID": 5,
        "date": "2019/06/20",
        "hoursSlept": 8,
        "sleepQuality": 4
      },
      {
        "userID": 5,
        "date": "2019/06/19",
        "hoursSlept": 10,
        "sleepQuality": 4
      },
      {
        "userID": 5,
        "date": "2019/06/18",
        "hoursSlept": 9,
        "sleepQuality": 4
      },
      {
        "userID": 5,
        "date": "2019/06/17",
        "hoursSlept": 8,
        "sleepQuality": 4
      },
      {
        "userID": 5,
        "date": "2019/06/16",
        "hoursSlept": 10,
        "sleepQuality": 4
      },
      {
        "userID": 5,
        "date": "2019/06/15",
        "hoursSlept": 9,
        "sleepQuality": 4
      }
    ];

    activityData = [{
        "userID": 1,
        "date": "2019/06/15",
        "numSteps": 3577,
        "minutesActive": 140,
        "flightsOfStairs": 16
      },
      {
        "userID": 2,
        "date": "2019/06/15",
        "numSteps": 4294,
        "minutesActive": 138,
        "flightsOfStairs": 10
      },
      {
        "userID": 3,
        "date": "2019/06/15",
        "numSteps": 7402,
        "minutesActive": 116,
        "flightsOfStairs": 33
      },
      {
        "userID": 4,
        "date": "2019/06/15",
        "numSteps": 3486,
        "minutesActive": 114,
        "flightsOfStairs": 32
      },
      {
        "userID": 5,
        "date": "2019/06/15",
        "numSteps": 11374,
        "minutesActive": 213,
        "flightsOfStairs": 13
      },
      {
        "userID": 6,
        "date": "2019/06/15",
        "numSteps": 14810,
        "minutesActive": 287,
        "flightsOfStairs": 18
      },
      {
        "userID": 7,
        "date": "2019/06/15",
        "numSteps": 2634,
        "minutesActive": 107,
        "flightsOfStairs": 5
      },
      {
        "userID": 11,
        "date": "2019/06/15",
        "numSteps": 10333,
        "minutesActive": 114,
        "flightsOfStairs": 31
      },
      {
        "userID": 11,
        "date": "2019/06/15",
        "numSteps": 6389,
        "minutesActive": 41,
        "flightsOfStairs": 33
      },
      {
        "userID": 10,
        "date": "2019/06/15",
        "numSteps": 8015,
        "minutesActive": 106,
        "flightsOfStairs": 37
      },
      {
        "userID": 11,
        "date": "2019/06/15",
        "numSteps": 11652,
        "minutesActive": 20,
        "flightsOfStairs": 24
      },
      {
        "userID": 12,
        "date": "2019/06/15",
        "numSteps": 9256,
        "minutesActive": 108,
        "flightsOfStairs": 2
      },
      {
        "userID": 1,
        "date": "2019/06/16",
        "numSteps": 5000,
        "minutesActive": 12,
        "flightsOfStairs": 14
      },
      {
        "userID": 1,
        "date": "2019/06/17",
        "numSteps": 9303,
        "minutesActive": 45,
        "flightsOfStairs": 9
      },
      {
        "userID": 1,
        "date": "2019/06/18",
        "numSteps": 3000,
        "minutesActive": 62,
        "flightsOfStairs": 23
      },
      {
        "userID": 1,
        "date": "2019/06/19",
        "numSteps": 9303,
        "minutesActive": 4,
        "flightsOfStairs": 2
      },
      {
        "userID": 1,
        "date": "2019/06/20",
        "numSteps": 9303,
        "minutesActive": 7,
        "flightsOfStairs": 4
      },
      {
        "userID": 1,
        "date": "2019/06/21",
        "numSteps": 12000,
        "minutesActive": 13,
        "flightsOfStairs": 26
      },
      {
        "userID": 1,
        "date": "2019/06/22",
        "numSteps": 9303,
        "minutesActive": 21,
        "flightsOfStairs": 14
      },
      {
        "userID": 1,
        "date": "2019/06/23",
        "numSteps": 9000,
        "minutesActive": 8,
        "flightsOfStairs": 9
      }
    ];

    hydration = new Hydration(hydrationData);
    activity = new Activity(activityData);
    sleep = new Sleep(sleepData);
    healthMonitor = new HealthMonitor(hydrationData);
    healthMonitorTwo = new HealthMonitor(sleepData);
    healthMonitorThree = new HealthMonitor(activityData);

    user1 = new User({
        id: 1,
        name: "Alex Roth",
        address: "1234 Turing Street, Denver CO 80301-1697",
        email: "alex.roth1@hotmail.com",
        strideLength: 4.3,
        dailyStepGoal: 5000,
        friends: [2, 3, 4]
      });

      user2 = new User({
        id: 2,
        name: "Allie McCarthy",
        address: "1235 Turing Street, Denver CO 80301-1697",
        email: "allie.mcc1@hotmail.com",
        strideLength: 3.3,
        dailyStepGoal: 9000,
        friends: [1, 3, 4]
      });

    users = [user1, user2];

    userRepo = new UserRepo(users);
  });

  it('should be a function', () => {
    expect(HealthMonitor).to.be.a('function');
  })

  it('should be an instance of HealthMonitor', () => {
    expect(healthMonitor).to.be.an.instanceOf(HealthMonitor);
  })

  it('should be able to take in an argument of data', () => {
    expect(healthMonitor.dataSet).to.deep.equal(hydrationData);
  })

  it('should be able to take in a different argument of data', () => {
    expect(healthMonitorTwo.dataSet).to.deep.equal(sleepData);
  })

  it('should be able to calculate average data per day', () => {
    expect(healthMonitor.calculateAverage(3, 'numOunces')).to.equal(2);
  });

  it('should be able to calculate average data per day for another data set', () => {
    expect(healthMonitorTwo.calculateAverage(3, 'sleepQuality')).to.equal(2);
  });

  it('should find data intake for a user on a specified date', () => {
    expect(healthMonitorTwo.calculateDaily(2, "2017/06/15", "sleepQuality")).to.equal(4.7);
  });

  it('should find a different data intake for a user on a specified date', () => {
    expect(healthMonitor.calculateDaily(1, "2019/06/15", "numOunces")).to.equal(37);
  });

  it('should find data by day for that days week', () => {
    expect(healthMonitorTwo.calculateSpecifiedWeekData('2019/06/18', 4, userRepo, 'hoursSlept')[0]).to.eql('2019/06/18: 7.9');
  });

  it('should find other data by day for that days week', () => {
    expect(healthMonitorThree.calculateSpecifiedWeekData( "2019/06/23", 1, userRepo, 'numSteps')[0]).to.eql("2019/06/23: 9000");
  });
})
