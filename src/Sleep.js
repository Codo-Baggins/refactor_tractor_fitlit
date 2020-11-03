import HealthMonitor from './Health-monitor';

class Sleep extends HealthMonitor {
  constructor(sleepData) {
    super(sleepData);
  }

  calculateAllUserSleepQuality() {
    const totalSleepQuality = this.dataSet.reduce((sumSoFar, dataItem) => {
      sumSoFar += dataItem.sleepQuality;
      return sumSoFar;
    }, 0);
    const allUsersSleepQuality = parseInt(totalSleepQuality);
    return allUsersSleepQuality / this.dataSet.length
  }

  determineSleepWinnerForWeek(date, userRepo) {
    const timeline = userRepo.chooseWeekDataForAllUsers(this.dataSet, date);
    const sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.sleepData, date, 'sleepQuality', timeline);
    return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
  }

  getWinnerNamesFromList(sortedArray, userRepo) {
    const bestSleepers = sortedArray.filter(element => {
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
