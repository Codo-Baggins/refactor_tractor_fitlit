import HealthMonitor from './Health-monitor'

class Hydration extends HealthMonitor {
  constructor(hydrationData) {
    super(hydrationData)
    // this.hydrationData = hydrationData;
  }

  // calculateAverageOunces(id) {
  //   const perDayUserHydration = this.hydrationData.filter((data) => id === data.userID);

  //   return perDayUserHydration.reduce((sumSoFar, data) => {
  //     return sumSoFar += data.numOunces;
  //   }, 0) / perDayUserHydration.length;
  // }

  calculateDailyOunces(id, date) {
    const findOuncesByDate = this.dataSet.find((data) => {
      return id === data.userID && date == data.date
    });

    return findOuncesByDate.numOunces;
  }

  // this returns an array of strings (the day that a user hydrated and the number of ounces)
  calculateFirstWeekOunces(userRepo, id) {
    return userRepo.getFirstWeek(id, this.dataSet).map(data => {
      return `${data.date}: ${data.numOunces}`
    });
  }

  // calculateRandomWeekOunces(date, id, userRepo) {
  //   const weekForDate = userRepo.getWeekFromDate(date, id, this.dataSet);

  //   return weekForDate.map(data => {
  //     return `${data.date}: ${data.numOunces}`
  //   })
  // }
}


export default Hydration;
