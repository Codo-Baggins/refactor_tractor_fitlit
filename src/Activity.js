import HealthMonitor from './Health-monitor'

class Activity extends HealthMonitor {
  constructor(activityData) {
    super(activityData)
  }

  accomplishStepGoal(id, date, userRepo) {
    const userStepsByDate = this.calculateDaily(id, date, "numSteps");
    if (userStepsByDate === userRepo.dailyStepGoal) {
      return true;
    }
    return false
  }

  getDaysGoalExceeded(id, userRepo) {
    const activitiesExceeded = this.dataSet.filter(data => {
      return id === data.userID && data.numSteps > userRepo.dailyStepGoal
    })
    return activitiesExceeded.map(data => {
      return data.date;
    })
  }

  getAllUserAverageForDay(date, userRepo, relevantData) {
    const selectedDayData = userRepo.chooseDayDataForAllUsers(this.dataSet, date);
    const totalDayData = selectedDayData.reduce((acc, elem) => {
      acc += elem[relevantData];
      return acc;
    }, 0);
    return parseFloat((totalDayData / selectedDayData.length).toFixed(1))
  }

  userDataForToday(id, date, userRepo, relevantData) {
    const userData = userRepo.getDataFromUserID(id, this.dataSet);
    const user = userData.find(data => data.date === date)
    if (user && user[relevantData]) {
      return user[relevantData];
    }
    return 0;
  }

  userDataForWeek(id, date, userRepo, releventData) {
    const usersWeek = userRepo.getWeekFromDate(date, id, this.dataSet)
    return usersWeek.map(data => {
      return `${data.date}: ${data[releventData]}`
    })
  }

  // Friends

  getFriendsActivity(user, userRepo) {
    const data = this.dataSet;
    const userDatalist = user.friends.map(function(friend) {
      return userRepo.getDataFromUserID(friend, data)
    });
    return userDatalist.reduce(function(arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }

  getFriendsAverageStepsForWeek(user, date, userRepo) {
    const friendsActivity = this.getFriendsActivity(user, userRepo);
    const timeline = userRepo.chooseWeekDataForAllUsers(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(friendsActivity, date, 'numSteps', timeline)
  }

  showChallengeListAndWinner(user, date, userRepo) {
    const rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    return rankedList.map(listItem => {
      const userID = Object.keys(listItem)[0];
      const userName = userRepo.getDataFromID(parseInt(userID)).name;
      return `${userName}: ${listItem[userID]}`
    })
  }

//this method is not tested at all...
  showcaseWinner(user, date, userRepo) {
    let winner = this.showChallengeListAndWinner(user, date, userRepo).shift();
    console.log(winner);
    return winner;
  }

  getStreak(userRepo, id, relevantData) {
    const data = this.dataSet;
    const sortedUserArray = (userRepo.makeSortedUserArray(id, data)).reverse();
    const streaks = sortedUserArray.filter((element, index) => {
      if (index >= 2) {
        return (sortedUserArray[index - 2][relevantData] < sortedUserArray[index - 1][relevantData] && sortedUserArray[index - 1][relevantData] < sortedUserArray[index][relevantData])
      }
    });

    return streaks.map(streak => {
      return streak.date;
    })
  }

  getWinnerId(user, date, userRepo) {
    const rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    const keysList = rankedList.map(listItem => Object.keys(listItem));
    if (keysList.length > 0) {
      return parseInt(keysList[0].join(''))
    }
  }
}

export default Activity;
