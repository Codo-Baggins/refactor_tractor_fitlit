import { expect } from 'chai';
import Hydration from '../src/Hydration';
import UserRepo from '../src/User-repo';
import User from '../src/User';

describe('Hydration', function() {
  let hydrationData;
  let hydration;
  let user1;
  let user2;
  let users;
  let userRepo;

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
    ]

    hydration = new Hydration(hydrationData);

    user1 = new User({
      id: 3,
      name: "The Rock",
      address: "1236 Awesome Street, Denver CO 80301-1697",
      email: "therock@hotmail.com",
      strideLength: 10,
      dailyStepGoal: 60000,
      friends: [1, 2, 4]
    });

    user2 = new User({
      id: 4,
      name: "Rainbow Dash",
      address: "1237 Equestria Street, Denver CO 80301-1697",
      email: "rainbowD1@hotmail.com",
      strideLength: 3.8,
      dailyStepGoal: 7000,
      friends: [1, 2, 3]
    });

    users = [user1, user2];
    userRepo = new UserRepo(users);

  });

  it('should take in a list of data', () => {
    expect(hydration.dataSet[0].userID).to.equal(1);
    expect(hydration.dataSet[2].numOunces).to.equal(1);
    expect(hydration.dataSet[4].date).to.equal('2018/10/23');
  });

  it('should find the average water intake per day for a user', () => {
    expect(hydration.calculateAverage(3, 'numOunces')).to.equal(2);
  });

  it('should find water intake by day for first week', () => {
    expect(hydration.calculateFirstWeekOunces(userRepo, 4)[0]).to.equal('2019/09/20: 40');
  });

  it('should be able to find water intake for a different day of the first week', () => {
    expect(hydration.calculateFirstWeekOunces(userRepo, 4)[6]).to.equal('2019/04/15: 36');
  })

  it('should be able to calculate random week ounces', () => {
    expect(hydration.calculateSpecifiedWeekData('2019/09/18', 4, userRepo, 'numOunces')[0]).to.eql('2019/09/18: 40');
  })
});
