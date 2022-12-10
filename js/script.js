const timeInfo = document.querySelector('.time');
const dateInfo = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
let randomNum;
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const cityInput = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuoteButton = document.querySelector('.change-quote');
let isPlay = false;
const audio = new Audio();
const playButton = document.querySelector('.play');
const prevAudioButton = document.querySelector('.play-prev');
const nextAudioButton = document.querySelector('.play-next');
let playNum = 0;
const playListContainer = document.querySelector('.play-list');
import playList from './playList.js';

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  timeInfo.textContent = currentTime;
  setTimeout(showTime, 1000);
  showDate();
  showGreeting();
}

function showDate() {
  const date = new Date();
  const options = {weekday: 'long', month: 'long', day: 'numeric'};
  const currentDate = date.toLocaleDateString('en-US', options);
  dateInfo.textContent = currentDate;
}

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  const partOfDay = hours / 6;
  if (partOfDay < 1) {
    return 'night'
  } else if (partOfDay < 2) {
    return 'morning'
  } else if (partOfDay < 3) {
    return 'afternoon'
  } else {return 'evening'}
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  greeting.textContent = 'Good ' + timeOfDay;
}

showTime();

function getRandomNum() {
  const min = Math.ceil(1);
  const max = Math.floor(20);
  randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg() {  
  const img = new Image();
  const bgNum = randomNum.toString().padStart(2, "0");
  img.src = `https://raw.githubusercontent.com/newTimesNewRoman/momentum-images/assets/${getTimeOfDay()}/${bgNum}.webp`;
  img.onload = () => {      
    body.style.backgroundImage = `url(https://raw.githubusercontent.com/newTimesNewRoman/momentum-images/assets/${getTimeOfDay()}/${bgNum}.webp)`;
  }; 
}

getRandomNum()
setBg()

function getSlideNext() {
  (randomNum < 20) ?  (randomNum += 1) : (randomNum = 1);
  setBg()
}

function getSlidePrev() {
  (randomNum > 1) ? randomNum -= 1 : randomNum = 20;
  setBg()
}

slideNext.addEventListener('click', getSlideNext)
slidePrev.addEventListener('click', getSlidePrev)



function setLocalStorage() {
  localStorage.setItem('name', name.value);
  localStorage.setItem('city', cityInput.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
    cityInput.value = localStorage.getItem('city');
  }
}
window.addEventListener('load', getLocalStorage)

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&lang=en&appid=791037c06d6b5d23def0d91fd8708696&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
  humidity.textContent = `Humidity: ${data.main.humidity} %`;
}
getWeather()

async function getWeatherChange() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=en&appid=791037c06d6b5d23def0d91fd8708696&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.cod === '404') {
    weatherError.textContent = data.message;
    temperature.textContent = `--°C`;
    weatherDescription.textContent = 'none description';
    wind.textContent = `Wind speed: -- m/s`;
    humidity.textContent = `Humidity: -- %`;
  } else {
    weatherError.textContent = '';
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity} %`;
  }
}

cityInput.addEventListener('change', getWeatherChange);

function getRundomNumForQuotes() {
  const min = Math.ceil(0);
  const max = Math.floor(101);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getQuotes() {  
  const quotes = 'assets/quotes.json';
  const res = await fetch(quotes);
  const data = await res.json();
  const rundomNumberForQuotes = getRundomNumForQuotes();
  quote.textContent = data.quotes[rundomNumberForQuotes].quote;
  author.textContent = data.quotes[rundomNumberForQuotes].author;
}
getQuotes();

changeQuoteButton.addEventListener('click', getQuotes);

for(let i = 0; i < playList.length; i++) {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.classList.add(`track${i}`);
  li.textContent = playList[i].title;
  playListContainer.append(li);
};

function activeTrack() {
  const track = document.querySelector(`.track${playNum}`);
  track.classList.add('track-is-play');
}

function disactiveTrack() {
  const track = document.querySelector(`.track${playNum}`);
  track.classList.remove('track-is-play');
}

function playAudio() {
  if (!isPlay) {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
    activeTrack()
  } else {
    audio.pause();
    isPlay = false;
    disactiveTrack();
  }
}

function changeAudioButton() {
  if (!isPlay) {
    playButton.classList.remove('pause');
  }  else {
    playButton.classList.add('pause');
  }
}

playButton.addEventListener('click', playAudio);
playButton.addEventListener('click', changeAudioButton); 

function playPrevAudio() {
  disactiveTrack();
  playNum -= 1;
  if (playNum < 0) {playNum = 3};
  if (!isPlay) {
    playAudio();
    changeAudioButton();
  } else {
    isPlay = false;
    playAudio();
  }
}

function playNextAudio() {
  disactiveTrack();
  playNum += 1;
  if (playNum > 3) {playNum = 0};
  if (!isPlay) {
    playAudio();
    changeAudioButton();
  } else {
    isPlay = false;
    playAudio();
  }
}

prevAudioButton.addEventListener('click', playPrevAudio);
nextAudioButton.addEventListener('click', playNextAudio);
audio.addEventListener('ended', playNextAudio);