class Hydration {
  constructor(hydrationData) {
    this.hydrationData = hydrationData;
  }

  calculateAverageOunces(id) {
    const perDayUserHydration = this.hydrationData.filter((data) => id === data.userID);

    return perDayUserHydration.reduce((sumSoFar, data) => {
      return sumSoFar += data.numOunces;
    }, 0) / perDayUserHydration.length;
  }

  calculateDailyOunces(id, date) {
    const findOuncesByDate = this.hydrationData.find((data) => {
      return id === data.userID && date == data.date
    });
    return findOuncesByDate.numOunces;
  }

  // this returns an array of strings (the day that a user hydrated and the number of ounces)
  calculateFirstWeekOunces(userRepo, id) {
    return userRepo.getFirstWeek(id, this.hydrationData).map((data) => {
    return `${data.date}: ${data.numOunces}`
    });
  }

  calculateRandomWeekOunces(date, id, userRepo) {
    return userRepo.getWeekFromDate(date, id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }

}


export default Hydration;
