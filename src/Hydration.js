import HealthMonitor from './Health-monitor'

class Hydration extends HealthMonitor {
  constructor(hydrationData) {
    super(hydrationData)
  }

  calculateFirstWeekOunces(userRepo, id) {
    return userRepo.getFirstWeek(id, this.dataSet).map(data => {
      return `${data.date}: ${data.numOunces}`
    });
  }
}

export default Hydration;
