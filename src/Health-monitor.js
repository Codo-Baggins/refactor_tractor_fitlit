class HealthMonitor {
    constructor(dataSet) {
        this.dataSet = dataSet;
    }

    calculateAverage(id, property) {
        const perDayData = this.dataSet.filter(data => {
            return id === data.userID});
            
        return perDayData.reduce((sumSoFar, data) => {
            sumSoFar += data[property];
            return sumSoFar;
        }, 0) / perDayData.length;
    }

    calculateDaily(id, date, property) {
        const propertyByDate = this.dataSet.find(data => {
            return id === data.userID && date == data.date
        });
        return propertyByDate[property];
    }

    calculateSpecifiedWeekData(date, id, userRepo, property) {
        const weekFromDay = userRepo.getWeekFromDate(date, id, this.dataSet)
    
        return weekFromDay.map(data => {
            return `${data.date}: ${data[property]}`
        })
      }
}

export default HealthMonitor;