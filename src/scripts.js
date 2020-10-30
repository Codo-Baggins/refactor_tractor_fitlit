
import './css/base.scss';
import './css/style.scss';

import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';
import HealthMonitor from './Health-monitor';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const userForms = document.querySelector('.todays-metrics');

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// window.addEventListener('load', loadMonitorData);
userForms.addEventListener('click', handleMetricSubmits);

//window.addEventListener('load', defineVariables);
//window.addEventListener('load', getApiData);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


let userData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData')
  .then(response => response.json())
  .then(data => createRandomUser(data.userData))
  .catch(error => console.log(error.message))

function createRandomUser(userData) {
  let userList = [];
  makeUsers(userList, userData);
  global.userRepo = new UserRepo(userList);
  const userNowId = pickUser();
  global.userNow = getUserById(userNowId, userRepo);
  loadMonitorData()
}

function loadMonitorData(test) {

  let sleepData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData')
    .then(response => response.json())
    .then(data => data.sleepData)
    .catch(error => console.log("error.message"))

  let activityData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData')
    .then(response => response.json())
    .then(data => data.activityData)
    .catch(error => console.log(error.message))

  let hydrationData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData')
    .then(response => response.json())
    .then(data => data.hydrationData)
    .catch(error => console.log(error.message))

  Promise.all([sleepData, activityData, hydrationData]).then(data => {
    defineVariables(data[0], data[1], data[2])
  })
}

function handleMetricSubmits(event) {
  event.preventDefault();
  if (event.target.className === "hydration-submit") {
    evaluateHydrationInput();
  } else if (event.target.className === "sleep-submit") {
    evaluateSleepInput()
  } else if (event.target.className === "activity-submit") {
    evaluateActivityInput()
  }
}

  function evaluateHydrationInput(event) {
    const dateInput = document.querySelector('.hydration-date-input');
    const ouncesInput = document.querySelector('.hydration-ounces-input')
    if (dateInput.value !== "" && ouncesInput.value !== "") {
      const dataToPost = createHydrationObject(dateInput, ouncesInput);
      postHyrdationSubmission(dataToPost);
    }
  }

  function createHydrationObject(dateInput, ouncesInput) {
    const formattedDate = dateInput.value.replace(/-/g,"/");
    return {"userID": userNow.id, "date": formattedDate, "numOunces": parseInt(ouncesInput.value)}
  }

  function postHyrdationSubmission(dataToPost) {
    fetch("https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData", {
      method: 'POST',
      headers: {
  	'Content-Type': 'application/json'
    },
      body: JSON.stringify(dataToPost),
    })
    .then(response => response.json())
    .then(message => handleHydrationSuccess(message))
    .catch(error => console.log(error.message))
  }

  function handleHydrationSuccess(message) {
    loadMonitorData()
  }

  function evaluateSleepInput() {
    const dateInput = document.querySelector('.sleep-date-input')
    const sleepAmount = document.querySelector('.hours-slept-input')
    const sleepQuality = document.querySelector('.sleep-quality-input')
    if (dateInput.value !== "" && sleepAmount.value !== "" && sleepQuality.value !== "") {
      const dataToPost = createSleepObject(dateInput, sleepAmount, sleepQuality)
      postSleepSubmission(dataToPost);
    }
  }

  function createSleepObject(dateInput, sleepAmount, sleepQuality) {
    const formattedDate = dateInput.value.replace(/-/g,"/");
    return {"userID": user.id, "date": formattedDate, "hoursSlept": parseInt(sleepAmount.value), "sleepQuality": parseInt(sleepQuality.value)}
  }

  function postSleepSubmission(dataToPost) {
    fetch("https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData", {
      method: 'POST',
      headers: {
  	'Content-Type': 'application/json'
    },
      body: JSON.stringify(dataToPost),
    })
    .then(response => response.json())
    .catch(error => console.log(error.message))
  }

  function evaluateActivityInput() {
    const dateInput = document.querySelector('.activity-date-input')
    const stepCount = document.querySelector('.steps-walked-input')
    const minutesActive = document.querySelector('.minutes-active-input')
    const stairCount = document.querySelector('.stairs-input')
    if (dateInput.value !== "" && minutesActive.value !== "" && stepCount.value !== "" && stairCount.value !== "") {
      const dataToPost = createActivityObject(dateInput, stepCount, minutesActive, stairCount)
      postActvitySubmission(dataToPost);
    }
  }

  function createActivityObject(dateInput, stepCount, minutesActive, stairCount) {
    const formattedDate = dateInput.value.replace(/-/g,"/");
    return {"userID": user.id, "date": formattedDate, "numSteps": parseInt(stepCount.value), "minutesActive": parseInt(minutesActive.value), "flightsOfStairs": parseInt(stairCount.value)}
  }

  function postActvitySubmission(dataToPost) {
    console.log(dataToPost);
    fetch("https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData", {
      method: 'POST',
      headers: {
  	'Content-Type': 'application/json'
    },
      body: JSON.stringify(dataToPost),
    })
    .then(response => response.json())
    .catch(error => console.log(error.message))
  }

function startApp(userRepo, hydrationRepo, sleepRepo, activityRepo, userNowId, userNow, today, randomHistory, historicalWeek) {
  console.log(userNowId)
  historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
  addInfoToSidebar(userNow, userRepo);
  getHyrdationElements(userNowId, hydrationRepo, today, userRepo, randomHistory)
  getSleepElements(userNowId, sleepRepo, today, userRepo, randomHistory);
  let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
  getFriendInfoElements(userNowId, activityRepo, userRepo, today, randomHistory, userNow);
  getActivityElements(userNowId, activityRepo, today, userRepo, randomHistory, userNow, winnerNow);
}

function defineVariables(sleepData, activityData, hydrationData) {
  global.hydrationRepo = new Hydration(hydrationData);
  global.sleepRepo = new Sleep(sleepData);
  global.activityRepo = new Activity(activityData);
  const today = makeToday(userRepo, userNow.id, hydrationData);
  const randomHistory = makeRandomDate(userRepo, userNow.id, hydrationData);
  const historicalWeek = document.querySelectorAll('.historicalWeek');
  startApp(userRepo, hydrationRepo, sleepRepo, activityRepo, userNow.id, userNow, today, randomHistory, historicalWeek);
}

function makeUsers(dataSet, userData) {
  userData.forEach(function(dataItem) {
    global.user = new User(dataItem);
    dataSet.push(user);
  })
}

function pickUser() {
  return Math.floor(Math.random() * 50);
}

function getUserById(id, listRepo) {
  return listRepo.getDataFromID(id);
};


function addInfoToSidebar(user, userStorage) {
  displaySideBarName(user)
  displayStepGoalCard(user)
  displayHeaderText(user)
  displayUserDetails(user)
  displayUserStride(user)
  displayUserFriends(user, userStorage);
};

function displayUserFriends(user, userStorage) {
  const friendList = document.getElementById('friendList');
  friendList.insertAdjacentHTML('afterBegin', makeFriendHTML(user, userStorage))
}

function displayUserStride(user) {
  const userStridelength = document.getElementById('userStridelength');
  userStridelength.innerText = `Your stridelength is ${user.strideLength} meters.`;
}

function displayUserDetails(user) {
  const userAddress = document.getElementById('userAddress');
  const userEmail = document.getElementById('userEmail');
  userAddress.innerText = user.address;
  userEmail.innerText = user.email;
}

function displayHeaderText(user) {
  const headerText = document.getElementById('headerText');
  headerText.innerText = `${user.getFirstName()}'s Activity Tracker`;
}

function displayStepGoalCard(user) {
  const stepGoalCard = document.getElementById('stepGoalCard');
  stepGoalCard.innerText = `Your daily step goal is ${user.dailyStepGoal}.`
}

function displaySideBarName(user) {
  const sidebarName = document.getElementById('sidebarName');
  sidebarName.innerText = user.name;
}

function makeFriendHTML(user, userStorage) {
  return user.getFriendsNames(userStorage).map(friendName => `<li class='historical-list-listItem'>${friendName}</li>`).join('');
}

function makeWinnerID(activityInfo, user, dateString, userStorage){
  return activityInfo.getWinnerId(user, dateString, userStorage)
}

function makeToday(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[0].date;
}

function makeRandomDate(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date
}

function getHyrdationElements(id, hydrationInfo, dateString, userStorage, laterDateString) {
  diplayDayHydration(id, hydrationInfo, dateString);
  displayHydrationAvg(id, hydrationInfo)
  displayHyrdrationWeek(id, hydrationInfo, userStorage, laterDateString)
}

function diplayDayHydration(id, hydrationInfo, dateString) {
  const hydrationToday = document.getElementById('hydrationToday');
  const hydrationBlock =
  `<p>You drank</p>
  <p><span class="number">${hydrationInfo.calculateDaily(id, dateString, 'numOunces')}</span></p>
  <p>oz water today.</p>`;
  hydrationToday.insertAdjacentHTML('afterBegin', hydrationBlock);
}

function displayHydrationAvg(id, hydrationInfo) {
  const hydrationAverage = document.getElementById('hydrationAverage');
  const hydrationBlock = `<p>Your average water intake is</p>
  <p><span class="number">${hydrationInfo.calculateAverage(id, 'numOunces')}</span></p>
  <p>oz per day.</p>`;
  hydrationAverage.insertAdjacentHTML('afterBegin', hydrationBlock)
}

function displayHyrdrationWeek(id, hydrationInfo, userStorage, laterDateString) {
  const hydrationThisWeek = document.getElementById('hydrationThisWeek');
  const hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');
  const thisWeekHydrationHTML = makeHydrationHTML(id, hydrationInfo, userStorage, hydrationInfo.calculateFirstWeekOunces(userStorage, id));
  const earlierWeekHydrationHTML = makeHydrationHTML(id, hydrationInfo, userStorage, hydrationInfo.calculateSpecifiedWeekData(laterDateString, id, userStorage, 'numOunces'));
  hydrationThisWeek.insertAdjacentHTML('afterBegin', thisWeekHydrationHTML);
  hydrationEarlierWeek.insertAdjacentHTML('afterBegin', earlierWeekHydrationHTML);
}

function makeHydrationHTML(id, hydrationInfo, userStorage, method) {
  return method.map(drinkData => `<li class="historical-list-listItem">On ${drinkData}oz</li>`).join('');
}

function getSleepElements(id, sleepInfo, dateString, userStorage, laterDateString) {
  displaySleepQualityToday(id, sleepInfo, dateString);
  displayAvgSleepQuality(sleepInfo, avUserSleepQuality)
  displaySleepWeek(id, sleepInfo, userStorage, dateString, laterDateString)
}

//THIS FUNCTION ISSUE
function displaySleepQualityToday(id, sleepInfo, dateString) {
  const sleepQualityToday = document.getElementById('sleepQualityToday');
  const sleepBlock =
  `<p>Your sleep quality was</p>
  <p><span class="number">${sleepInfo.calculateDaily(id, dateString, 'sleepQuality')}</span></p>
  <p>out of 5.</p>`
  sleepQualityToday.insertAdjacentHTML("afterBegin", sleepBlock);
}

function displayAvgSleepQuality(sleepInfo) {
  const avUserSleepQuality = document.getElementById('avUserSleepQuality');
  const sleepBlock =
  `<p>The average user's sleep quality is</p>
  <p><span class="number">${Math.round(sleepInfo.calculateAllUserSleepQuality() *100)/100}</span></p>
  <p>out of 5.</p>`
  avUserSleepQuality.insertAdjacentHTML("afterBegin", sleepBlock);
}

function displaySleepWeek(id, sleepInfo, userStorage, dateString, laterDateString) {
  const sleepEarlierWeek = document.getElementById('sleepEarlierWeek');
  const sleepThisWeek = document.getElementById('sleepThisWeek');
  const thisWeekSleepHTML = makeSleepHTML(id, sleepInfo, userStorage, sleepInfo.calculateSpecifiedWeekData(dateString, id, userStorage, 'hoursSlept'));
  const earlierWeekSleepHTML = makeSleepHTML(id, sleepInfo, userStorage, sleepInfo.calculateSpecifiedWeekData(laterDateString, id, userStorage, 'hoursSlept'));
  sleepThisWeek.insertAdjacentHTML('afterBegin', thisWeekSleepHTML);
  sleepEarlierWeek.insertAdjacentHTML('afterBegin', earlierWeekSleepHTML);
}

function makeSleepHTML(id, sleepInfo, userStorage, method) {
  return method.map(sleepData => `<li class="historical-list-listItem">On ${sleepData} hours</li>`).join('');
}

function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
  return method.map(sleepQualityData => `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`).join('');
}

function getActivityElements(id, activityInfo, dateString, userStorage, laterDateString, user, winnerId) {
  displayBestUserSteps(user, activityInfo, userStorage, winnerId, dateString)
  displayUserMinsWeek(id, activityInfo, userStorage, dateString);
  displayUserStairsWeek(id, activityInfo, userStorage, dateString)
  displayUserStepsWeek(id, activityInfo, userStorage, dateString);
  displayAvgMinsToday(activityInfo, dateString, userStorage)
  displayUserMinsToday(activityInfo, id, dateString, userStorage);
  displayAvgStepsToday(activityInfo, dateString, userStorage)
  displayUserStepsToday(activityInfo, id, dateString, userStorage)
  displayAvgStairsToday(activityInfo, dateString, userStorage)
  displayUserStairsToday(activityInfo, id, dateString, userStorage);
}

function displayBestUserSteps(user, activityInfo, userStorage, winnerId, dateString) {
  const bestUserSteps = document.getElementById('bestUserSteps');
  const stepsBlock = makeStepsHTML(user, activityInfo, userStorage, activityInfo.userDataForWeek(winnerId, dateString, userStorage, "numSteps"))
  bestUserSteps.insertAdjacentHTML("afterBegin", stepsBlock);
}

function displayUserMinsWeek(id, activityInfo, userStorage, dateString) {
  const userMinutesThisWeek = document.getElementById('userMinutesThisWeek');
  const minsBlock = makeMinutesHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "minutesActive"))
  userMinutesThisWeek.insertAdjacentHTML("afterBegin", minsBlock);
}

function displayUserStairsWeek(id, activityInfo, userStorage, dateString) {
  const userStairsThisWeek = document.getElementById('userStairsThisWeek');
  const stairsBlock = makeStairsHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "flightsOfStairs"))
  userStairsThisWeek.insertAdjacentHTML("afterBegin", stairsBlock);
}

function displayUserStepsWeek(id, activityInfo, userStorage, dateString) {
  const userStepsThisWeek = document.getElementById('userStepsThisWeek');
  const stepsBlock = makeStepsHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "numSteps"))
  userStepsThisWeek.insertAdjacentHTML("afterBegin", stepsBlock);
}

function displayAvgMinsToday(activityInfo, dateString, userStorage) {
  const avgMinutesToday = document.getElementById('avgMinutesToday');
  const minsBlock =
  `<p>Active Minutes:</p>
  <p>All Users</p>
  <p>
  <span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'minutesActive')}</span>
  </p>`
  avgMinutesToday.insertAdjacentHTML("afterBegin", minsBlock)
}

function displayUserMinsToday(activityInfo, id, dateString, userStorage) {
  const userMinutesToday = document.getElementById('userMinutesToday');
  const minsBlock =
  `<p>Active Minutes:</p>
  <p>You</p>
  <p>
  <span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'minutesActive')}</span>
  </p>`
  userMinutesToday.insertAdjacentHTML("afterBegin", minsBlock);
}

function displayAvgStepsToday(activityInfo, dateString, userStorage) {
  const avgStepsToday = document.getElementById('avgStepsToday');
  const stepsBlock =
  `<p>Step Count:</p>
  <p>All Users</p>
  <p>
  <span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'numSteps')}</span>
  </p>`
  avgStepsToday.insertAdjacentHTML("afterBegin", stepsBlock)
}

function displayUserStepsToday(activityInfo, id, dateString, userStorage) {
  const userStepsToday = document.getElementById('userStepsToday');
  const stepsBlock =
  `<p>Step Count:</p><p>You</p>
  <p>
  <span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'numSteps')}</span>
  </p>`
  userStepsToday.insertAdjacentHTML("afterBegin", stepsBlock);
}

function displayAvgStairsToday(activityInfo, dateString, userStorage) {
  const avgStairsToday = document.getElementById('avgStairsToday');
  const stairsBlock = `<p>Stair Count: </p>
  <p>All Users</p>
  <p>
  <span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'flightsOfStairs')}</span>
  </p>`
  avgStairsToday.insertAdjacentHTML("afterBegin", stairsBlock)
}

function displayUserStairsToday(activityInfo, id, dateString, userStorage) {
  const userStairsToday = document.getElementById('userStairsToday');
  const stairsBlock =
  `<p>Stair Count:</p>
  <p>You</><p>
  <span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'flightsOfStairs')}</span>
  </p>`
  userStairsToday.insertAdjacentHTML("afterBegin", stairsBlock)
}

function makeStepsHTML(id, activityInfo, userStorage, method) {
  return method.map(activityData => `<li class="historical-list-listItem">On ${activityData} steps</li>`).join('');
}

function makeStairsHTML(id, activityInfo, userStorage, method) {
  return method.map(data => `<li class="historical-list-listItem">On ${data} flights</li>`).join('');
}

function makeMinutesHTML(id, activityInfo, userStorage, method) {
  return method.map(data => `<li class="historical-list-listItem">On ${data} minutes</li>`).join('');
}

function getFriendInfoElements(id, activityInfo, userStorage, dateString, laterDateString, user) {
  displayBigWinner(activityInfo, user, dateString, userStorage)
  displayFriendListHistory(id, activityInfo, userStorage, user, dateString)
  displayStreakListMins(id, activityInfo, userStorage);
  displayStreakList(id, activityInfo, userStorage)
  displayFriendChallengeListToday(id, activityInfo, userStorage, user, dateString);
}

function displayBigWinner(activityInfo, user, dateString, userStorage) {
  const bigWinner = document.getElementById('bigWinner');
  bigWinner.insertAdjacentHTML('afterBegin', `THIS WEEK'S WINNER! ${activityInfo.showcaseWinner(user, dateString, userStorage)} steps`)
}

function displayFriendListHistory(id, activityInfo, userStorage, user, dateString) {
  const friendChallengeListHistory = document.getElementById('friendChallengeListHistory');
  const friendBlock = makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.showChallengeListAndWinner(user, dateString, userStorage))
  friendChallengeListHistory.insertAdjacentHTML("afterBegin", friendBlock);
}

function displayStreakListMins(id, activityInfo, userStorage) {
  const streakListMinutes = document.getElementById('streakListMinutes')
  const streakBlock = makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'minutesActive'))
  streakListMinutes.insertAdjacentHTML("afterBegin", streakBlock);
}

function displayStreakList(id, activityInfo, userStorage) {
  const streakList = document.getElementById('streakList');
  const streakBlock = makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'numSteps'))
  streakList.insertAdjacentHTML("afterBegin", streakBlock);
}

function displayFriendChallengeListToday(id, activityInfo, userStorage, user, dateString) {
  const friendChallengeListToday = document.getElementById('friendChallengeListToday');
  const challengeBlock = makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.showChallengeListAndWinner(user, dateString, userStorage))
  friendChallengeListToday.insertAdjacentHTML("afterBegin", challengeBlock);
}

function makeFriendChallengeHTML(id, activityInfo, userStorage, method) {
  return method.map(friendChallengeData => `<li class="historical-list-listItem">Your friend ${friendChallengeData} average steps.</li>`).join('');
}

function makeStepStreakHTML(id, activityInfo, userStorage, method) {
  return method.map(streakData => `<li class="historical-list-listItem">${streakData}!</li>`).join('');
}
