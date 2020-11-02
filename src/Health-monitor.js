class HealthMonitor {
  constructor(dataSet) {
    this.dataSet = dataSet;
  }

  calculateAverage(id, property) {
    const perDayData = this.dataSet.filter(data => {
      return id === data.userID});
    const sum = perDayData.reduce((sumSoFar, data) => {
      sumSoFar += data[property];
      return sumSoFar;
    }, 0);
    return Math.round(sum / perDayData.length);
  }

  calculateDaily(id, date, property) {
    const propertyByDate = this.dataSet.find(data => {
      return id === data.userID && date === data.date
    });
    if (propertyByDate && propertyByDate[property]) {
      return propertyByDate[property];
    }
  }

  calculateSpecifiedWeekData(date, id, userRepo, property) {
    const weekFromDay = userRepo.getWeekFromDate(date, id, this.dataSet)
    return weekFromDay.map(data => {
      return `${data.date}: ${data[property]}`
    })
  }
}

export default HealthMonitor;
