

let displayObject = {
  
    displayDayHydration(id, hydrationInfo, dateString) {
    const hydrationToday = document.getElementById('hydrationToday');
    const hydrationOunces = hydrationInfo.calculateDaily(id, dateString, 'numOunces');
    const hydrationBlock =
    `<p>You drank</p>
    <p><span class="number">${typeof hydrationOunces === "number" ? hydrationOunces : 0}</span></p>
    <p>oz water today.</p>`;
    hydrationToday.innerHTML = "";
    hydrationToday.insertAdjacentHTML('afterBegin', hydrationBlock);
  },

  displaySleepQualityToday(id, sleepInfo, dateString) {
    const sleepNumber = sleepInfo.calculateDaily(id, dateString, 'sleepQuality');
    const sleepQualityToday = document.getElementById('sleepQualityToday');
    const sleepBlock =
    `<p>Your sleep quality was</p>
    <p><span class="number">${typeof sleepNumber === "number" ? sleepNumber : 0}</span></p>
    <p>out of 5.</p>`;
    sleepQualityToday.innerHTML = "";
    sleepQualityToday.insertAdjacentHTML("afterBegin", sleepBlock);
  },

    displayAvgMinsToday(activityInfo, dateString, userStorage) {
    const avgMinutesToday = document.getElementById('avgMinutesToday');
    const minutesNumber = activityInfo.getAllUserAverageForDay(dateString, userStorage, 'minutesActive');
    const minsBlock =
    `<p>Active Minutes:</p>
    <p>All Users</p>
    <p>
    <span class="number">${typeof minutesNumber === "number" ? minutesNumber : 0}</span>
    </p>`;
    avgMinutesToday.innerText = "";
    avgMinutesToday.insertAdjacentHTML("afterBegin", minsBlock);
  }
}

export{ displayObject };

