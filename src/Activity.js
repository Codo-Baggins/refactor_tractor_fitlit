class Activity {
  constructor(activityData) {
    this.activityData = activityData
  }

  getMilesFromStepsByDate(id, date, userRepo) {
    const userStepsByDate = this.activityData.find(data => {
      return id === data.userID && date === data.date
    });

    return parseFloat(((userStepsByDate.numSteps * userRepo.strideLength) / 5280).toFixed(1));
  }

  getActiveMinutesByDate(id, date) {
    const userActivityByDate = this.activityData.find(data => {
      return id === data.userID && date === data.date
    });

    return userActivityByDate.minutesActive;
  }

  calculateActiveAverageForWeek(id, date, userRepo) {
    const activityWeek = userRepo.getWeekFromDate(date, id, this.activityData);
    const weekActivityTotal = activityWeek.reduce((acc, elem) => {
      acc += elem.minutesActive;
      return acc;
    }, 0)

    return parseFloat((weekActivityTotal / 7).toFixed(1));
  }

  accomplishStepGoal(id, date, userRepo) {
    const userStepsByDate = this.activityData.find(data => {
      return id === data.userID && date === data.date
    });

    if (userStepsByDate.numSteps === userRepo.dailyStepGoal) {
      return true;
    }
    return false
  }

  getDaysGoalExceeded(id, userRepo) {
    const activitiesExceeded = this.activityData.filter(data => {
      return id === data.userID && data.numSteps > userRepo.dailyStepGoal
    })

    return activitiesExceeded.map(data => {
      return data.date;
    })
  }

  getStairRecord(id) {
    return this.activityData.filter(data => id === data.userID).reduce((acc, elem) => (elem.flightsOfStairs > acc) ? elem.flightsOfStairs : acc, 0);

    //NEED HELP REFACTORING THIS
    // const matchedUserData = this.activityData.filter(data => {
    //   return id === data.UserID;
    // })
    //
    // return matchedUserData.reduce((acc, elem) => {
    //   if (elem.flightsOfStairs > acc) {
    //     return elem.flightsOfStairs;
    //   }
    //   return acc;
    // }, 0)
  }

  getAllUserAverageForDay(date, userRepo, relevantData) {
    const selectedDayData = userRepo.chooseDayDataForAllUsers(this.activityData, date);

    const totalDayData = selectedDayData.reduce((acc, elem) => {
      acc += elem[relevantData];
      return acc;
    }, 0)

    return parseFloat((totalDayData / selectedDayData.length).toFixed(1))
  }

  userDataForToday(id, date, userRepo, relevantData) {
    const userData = userRepo.getDataFromUserID(id, this.activityData);
    return userData.find(data => data.date === date)[relevantData];
  }

  userDataForWeek(id, date, userRepo, releventData) {
    const usersWeek = userRepo.getWeekFromDate(date, id, this.activityData)

    return usersWeek.map(data => {
      return `${data.date}: ${data[releventData]}`
    })
  }

  // Friends

  getFriendsActivity(user, userRepo) {
    let data = this.activityData;
    let userDatalist = user.friends.map(function(friend) {
      return userRepo.getDataFromUserID(friend, data)
    });
    return userDatalist.reduce(function(arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }

  getFriendsAverageStepsForWeek(user, date, userRepo) {
    let friendsActivity = this.getFriendsActivity(user, userRepo);
    let timeline = userRepo.chooseWeekDataForAllUsers(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(friendsActivity, date, 'numSteps', timeline)
  }

  showChallengeListAndWinner(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);

    return rankedList.map(function(listItem) {
      let userID = Object.keys(listItem)[0];
      let userName = userRepo.getDataFromID(parseInt(userID)).name;
      return `${userName}: ${listItem[userID]}`
    })
  }

  showcaseWinner(user, date, userRepo) {
    let namedList = this.showChallengeListAndWinner(user, date, userRepo);
    let winner = this.showChallengeListAndWinner(user, date, userRepo).shift();
    return winner;
  }

  getStreak(userRepo, id, relevantData) {
    let data = this.activityData;
    let sortedUserArray = (userRepo.makeSortedUserArray(id, data)).reverse();
    let streaks = sortedUserArray.filter(function(element, index) {
      if (index >= 2) {
        return (sortedUserArray[index - 2][relevantData] < sortedUserArray[index - 1][relevantData] && sortedUserArray[index - 1][relevantData] < sortedUserArray[index][relevantData])
      }
    });
    return streaks.map(function(streak) {
      return streak.date;
    })
  }

  getWinnerId(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    let keysList = rankedList.map(listItem => Object.keys(listItem));
    return parseInt(keysList[0].join(''))
  }
}

export default Activity;
