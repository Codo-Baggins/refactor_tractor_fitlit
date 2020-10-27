
import './css/base.scss';
import './css/style.scss';

import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import userData from './data/users';
import hydrationData from './data/hydration';
import sleepData from './data/sleep';
import activityData from './data/activity';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';

import HealthMonitor from './Health-monitor';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

window.addEventListener('load', startApp);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function startApp() {
  let userList = [];
  makeUsers(userList);
  const userRepo = new UserRepo(userList);
  const hydrationRepo = new Hydration(hydrationData);
  const sleepRepo = new Sleep(sleepData);
  const activityRepo = new Activity(activityData);
  const userNowId = pickUser();
  const userNow = getUserById(userNowId, userRepo);
  const today = makeToday(userRepo, userNowId, hydrationData);
  const randomHistory = makeRandomDate(userRepo, userNowId, hydrationData);
  const historicalWeek = document.querySelectorAll('.historicalWeek');
  historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
  addInfoToSidebar(userNow, userRepo);
  getHyrdationElements(userNowId, hydrationRepo, today, userRepo, randomHistory)
  getSleepElements(userNowId, sleepRepo, today, userRepo, randomHistory);
  let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
  getFriendInfoElements(userNowId, activityRepo, userRepo, today, randomHistory, userNow);
  getActivityElements(userNowId, activityRepo, today, userRepo, randomHistory, userNow, winnerNow);
}

function makeUsers(array) {
  userData.forEach(function(dataItem) {
    let user = new User(dataItem);
    array.push(user);
  })
}

function pickUser() {
  return Math.floor(Math.random() * 50);
}

function getUserById(id, listRepo) {
  return listRepo.getDataFromID(id);
};


function addInfoToSidebar(user, userStorage) {
  const sidebarName = document.getElementById('sidebarName'); // moved from global
  const stepGoalCard = document.getElementById('stepGoalCard');
  const headerText = document.getElementById('headerText');
  const userAddress = document.getElementById('userAddress');
  const userEmail = document.getElementById('userEmail');
  const userStridelength = document.getElementById('userStridelength');
  const friendList = document.getElementById('friendList');

  sidebarName.innerText = user.name;
  headerText.innerText = `${user.getFirstName()}'s Activity Tracker`;
  stepGoalCard.innerText = `Your daily step goal is ${user.dailyStepGoal}.`
  //avStepGoalCard.innerText = `The average daily step goal is ${userStorage.calculateAverageStepGoal()}`;
  userAddress.innerText = user.address;
  userEmail.innerText = user.email;
  userStridelength.innerText = `Your stridelength is ${user.strideLength} meters.`;
  friendList.insertAdjacentHTML('afterBegin', makeFriendHTML(user, userStorage))
};

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
  const hydrationToday = document.getElementById('hydrationToday');
  const hydrationAverage = document.getElementById('hydrationAverage');
  const hydrationThisWeek = document.getElementById('hydrationThisWeek');
  const hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');
  diplayDayHydration(id, hydrationInfo, hydrationToday, dateString);
  displayHydrationAvg(id, hydrationInfo, hydrationAverage)
  displayHyrdrationWeek(id, hydrationInfo, hydrationThisWeek, hydrationEarlierWeek, userStorage, laterDateString)
}

function diplayDayHydration(id, hydrationInfo, hydrationToday, dateString) {
  const hydrationBlock =
  `<p>You drank</p>
  <p><span class="number">${hydrationInfo.calculateDaily(id, dateString, 'numOunces')}</span></p>
  <p>oz water today.</p>`;
  hydrationToday.insertAdjacentHTML('afterBegin', hydrationBlock);
}

function displayHydrationAvg(id, hydrationInfo, hydrationAverage) {
  const hydrationBlock = `<p>Your average water intake is</p>
  <p><span class="number">${hydrationInfo.calculateAverage(id, 'numOunces')}</span></p>
  <p>oz per day.</p>`;
  hydrationAverage.insertAdjacentHTML('afterBegin', hydrationBlock)
}

function displayHyrdrationWeek(id, hydrationInfo, hydrationThisWeek, hydrationEarlierWeek, userStorage, laterDateString) {
  hydrationThisWeek.insertAdjacentHTML('afterBegin', makeHydrationHTML(id, hydrationInfo, userStorage, hydrationInfo.calculateFirstWeekOunces(userStorage, id)));
  hydrationEarlierWeek.insertAdjacentHTML('afterBegin', makeHydrationHTML(id, hydrationInfo, userStorage, hydrationInfo.calculateSpecifiedWeekData(laterDateString, id, userStorage, 'numOunces')));
}

function makeHydrationHTML(id, hydrationInfo, userStorage, method) {
  return method.map(drinkData => `<li class="historical-list-listItem">On ${drinkData}oz</li>`).join('');
}

function getSleepElements(id, sleepInfo, dateString, userStorage, laterDateString) {
  const sleepQualityToday = document.getElementById('sleepQualityToday');
  const avUserSleepQuality = document.getElementById('avUserSleepQuality');
  const sleepThisWeek = document.getElementById('sleepThisWeek');
  const sleepEarlierWeek = document.getElementById('sleepEarlierWeek');
  displaySleepQualityToday(id, sleepInfo, dateString, sleepQualityToday);
  displayAvgSleepQuality(sleepInfo, avUserSleepQuality)
  displaySleepWeek(id, sleepInfo, userStorage, sleepThisWeek, dateString, laterDateString)
}

function displaySleepQualityToday(id, sleepInfo, dateString, sleepQualityToday) {
  const sleepBlock =
  `<p>Your sleep quality was</p>
  <p><span class="number">${sleepInfo.calculateDaily(id, dateString, 'sleepQuality')}</span></p>
  <p>out of 5.</p>`
  sleepQualityToday.insertAdjacentHTML("afterBegin", sleepBlock);
}

function displayAvgSleepQuality(sleepInfo, avUserSleepQuality) {
  const sleepBlock =
  `<p>The average user's sleep quality is</p>
  <p><span class="number">${Math.round(sleepInfo.calculateAllUserSleepQuality() *100)/100}</span></p>
  <p>out of 5.</p>`
  avUserSleepQuality.insertAdjacentHTML("afterBegin", sleepBlock);
}

function displaySleepWeek(id, sleepInfo, userStorage, sleepThisWeek, dateString, laterDateString) {
  sleepThisWeek.insertAdjacentHTML('afterBegin', makeSleepHTML(id, sleepInfo, userStorage, sleepInfo.calculateSpecifiedWeekData(dateString, id, userStorage, 'hoursSlept')));
  sleepEarlierWeek.insertAdjacentHTML('afterBegin', makeSleepHTML(id, sleepInfo, userStorage, sleepInfo.calculateSpecifiedWeekData(laterDateString, id, userStorage, 'hoursSlept')));
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
  displayUserStepsWeek(id, activityInfo, userStorage, activityInfo, dateString)
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
  bestUserSteps.insertAdjacentHTML("afterBegin", );
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
  const friendChallengeListToday = document.getElementById('friendChallengeListToday');
  const streakList = document.getElementById('streakList');
  const streakListMinutes = document.getElementById('streakListMinutes')
  const friendChallengeListHistory = document.getElementById('friendChallengeListHistory');
  const bigWinner = document.getElementById('bigWinner');
  addFriendGameInfo(id, activityInfo, userStorage, dateString, laterDateString, user)
}

function addFriendGameInfo(id, activityInfo, userStorage, dateString, laterDateString, user) {
  friendChallengeListToday.insertAdjacentHTML("afterBegin", makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.showChallengeListAndWinner(user, dateString, userStorage)));
  streakList.insertAdjacentHTML("afterBegin", makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'numSteps')));
  streakListMinutes.insertAdjacentHTML("afterBegin", makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'minutesActive')));
  friendChallengeListHistory.insertAdjacentHTML("afterBegin", makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.showChallengeListAndWinner(user, dateString, userStorage)));
  bigWinner.insertAdjacentHTML('afterBegin', `THIS WEEK'S WINNER! ${activityInfo.showcaseWinner(user, dateString, userStorage)} steps`)
}

function makeFriendChallengeHTML(id, activityInfo, userStorage, method) {
  return method.map(friendChallengeData => `<li class="historical-list-listItem">Your friend ${friendChallengeData} average steps.</li>`).join('');
}

function makeStepStreakHTML(id, activityInfo, userStorage, method) {
  return method.map(streakData => `<li class="historical-list-listItem">${streakData}!</li>`).join('');
}
