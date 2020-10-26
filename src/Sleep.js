import sleepData from './data/sleep';
import HealthMonitor from './Health-monitor';

class Sleep extends HealthMonitor {
  constructor(sleepData) {
    super(sleepData);
  }

  calculateAllUserSleepQuality() {
    const totalSleepQuality = this.dataSet.reduce((sumSoFar, dataItem) => {
      sumSoFar += dataItem.sleepQuality;
      return sumSoFar;
    }, 0)
    return totalSleepQuality / dataSet.length
  }

  determineBestSleepers(date, userRepo) {
    const timeline = userRepo.chooseWeekDataForAllUsers(this.dataSet, date);
    const userSleepObject = userRepo.isolateUsernameAndRelevantData(this.dataSet, date, 'sleepQuality', timeline);
    return Object.keys(userSleepObject).filter(function(key) {
      return (userSleepObject[key].reduce(function(sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
        }, 0) / userSleepObject[key].length) > 3
    }).map(function(sleeper) {
      return userRepo.getDataFromID(parseInt(sleeper)).name;
    })
  }

  determineSleepWinnerForWeek(date, userRepo) {
    const timeline = userRepo.chooseWeekDataForAllUsers(this.dataSet, date);
    const sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.sleepData, date, 'sleepQuality', timeline);
    return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
  }

  determineSleepHoursWinnerForDay(date, userRepo) {
    const timeline = userRepo.chooseDayDataForAllUsers(this.dataSet, date);
    const sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.sleepData, date, 'hoursSlept', timeline);
    return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
  }

  getWinnerNamesFromList(sortedArray, userRepo) {
    const bestSleepers = sortedArray.filter(function(element) {
      return element[Object.keys(element)] === Object.values(sortedArray[0])[0]
    });
    const bestSleeperIds = bestSleepers.map(bestSleeper => {
      return (Object.keys(bestSleeper));
    });
    return bestSleeperIds.map(sleepNumber => {
      return userRepo.getDataFromID(parseInt(sleepNumber)).name;
    });
  }
}

export default Sleep;
