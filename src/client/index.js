import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

// Функція для ініціалізації гри після успішного завантаження ресурсів
function initializeGame() { 
playMenu.classList.remove('hidden'); 
usernameInput.focus(); 
playButton.onclick = handlePlayButtonClick;
}

// Обробник натискання на кнопку "Play"
function handlePlayButtonClick() { 
const username = usernameInput.value.trim(); 
if (!username) { 
alert('Please enter a username.'); 
return; 
} 

play(username); 
playMenu.classList.add('hidden'); 
initState(); 
startCapturingInput(); 
startRendering(); 
setLeaderboardHidden(false);
}

// Функція зворотного виклику після закінчення гри
function onGameOver() { 
stopCapturingInput(); 
stopRendering(); 
playMenu.classList.remove('hidden'); 
setLeaderboardHidden(true);
}

// Завантаження необхідних ресурсів та ініціалізація гри
Promise.all([ 
connect(onGameOver), 
downloadAssets(),
]) 
.then(initializeGame) 
.catch(handleInitializationError);

// Обробка помилок під час ініціалізації гри
function handleInitializationError(error) { 
console.error('Initialization error:', error); 
alert('Failed to initialize the game. Please try again later.');
}