class UserRepo {
  constructor(users) {
    this.users = users;
  }

  getDataFromID(id) {
    return this.users.find((user) => id === user.id);
  }

  getDataFromUserID(id, dataSet) {
    return dataSet.filter((userData) => id === userData.userID);
  }

  calculateAverageStepGoal() {
    const totalStepGoal = this.users.reduce((sumSoFar, data) => {
      sumSoFar += data.dailyStepGoal;
      return sumSoFar;
    }, 0);
    return totalStepGoal / this.users.length;
  }

  makeSortedUserArray(id, dataSet) {
    const selectedID = this.getDataFromUserID(id, dataSet)
    const sortedByDate = selectedID.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(sortedByDate)
    return sortedByDate;
  }

  getToday(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet)[0].date;
  }

  getFirstWeek(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet).slice(0, 7);
  }

  getWeekFromDate(date, id, dataSet) {
    const dateIndex = this.makeSortedUserArray(id, dataSet).indexOf(this.makeSortedUserArray(id, dataSet).find((sortedItem) => (sortedItem.date === date)));

    return this.makeSortedUserArray(id, dataSet).slice(dateIndex, dateIndex + 7);
  }

  chooseWeekDataForAllUsers(dataSet, date) {
    return dataSet.filter(dataItem => {
      return (new Date(date)).setDate((new Date(date)).getDate() - 7) <= new Date(dataItem.date) && new Date(dataItem.date) <= new Date(date)
    })
  }

  chooseDayDataForAllUsers(dataSet, date) {
    return dataSet.filter(dataItem => {
      return dataItem.date === date
    });
  }

  isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod) {
    return listFromMethod.reduce((objectSoFar, dataItem) => {
      if (!objectSoFar[dataItem.userID]) {
        objectSoFar[dataItem.userID] = [dataItem[relevantData]]
      } else {
        objectSoFar[dataItem.userID].push(dataItem[relevantData])
      }
      return objectSoFar;
    }, {});
  }

  rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod) {
    const sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
    const objectKeyList = Object.keys(sortedObjectKeys)

    return objectKeyList.sort((b, a) => {
      return (sortedObjectKeys[a].reduce((sumSoFar, sleepQualityValue) => {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / sortedObjectKeys[a].length) - (sortedObjectKeys[b].reduce((sumSoFar, sleepQualityValue) => {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / sortedObjectKeys[b].length)
    });
  }

  combineRankedUserIDsAndAveragedData(dataSet, date, relevantData, listFromMethod) {
    const sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)

    const rankedUsersAndAverages = this.rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod)

    return rankedUsersAndAverages.map((rankedUser) => {
      rankedUser = {
        [rankedUser]: sortedObjectKeys[rankedUser].reduce(
          (sumSoFar, sleepQualityValue) => {
            sumSoFar += sleepQualityValue
            return sumSoFar;
          }, 0) / sortedObjectKeys[rankedUser].length
      };
      return rankedUser;
    });
  }
}

export default UserRepo;
