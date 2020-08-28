const CVS = document.getElementById('canvas'); 
const CTX = CVS.getContext('2d');

const SESSION_START_TIME = Date.now();

let isGameOver = false;
function handleGameOver() {
	if(isGameOver) {
		location.reload();
	}
}

function loadImage(src) {
	let tmp = new Image();
	tmp.src = src;
	return tmp;
};
const BIKER = loadImage('images/biker.gif');
const BACKGROUND = loadImage('images/background.jpg');
const KABUTO = loadImage('images/kabuto.gif');
const OMANYTE = loadImage('images/omanyte.gif');
const KABUTOPS = loadImage('images/kabutops.gif');
const OMASTAR = loadImage('images/omastar.gif');
const AERODACTYL = loadImage('images/aerodactyl.gif');

function loadAudio(src) {
	let tmp = new Audio();
	tmp.src = src;
	return tmp;
};
const THEME_AUDIO = loadAudio('audio/theme-audio.mp3');
const JUMP_AUDIO = loadAudio('audio/jump-audio.mp3');
const SCORE_AUDIO = loadAudio('audio/score-audio.mp3'); // TODO: Will fire in future when user registers new high score
const musicOn = false; // TODO: Disabled until DOM element is added to toggle music on/off. Will eventually be defined with 'let'
if(musicOn) {
	THEME_AUDIO.loop = true;
	THEME_AUDIO.play();
};

// Infinitely loop two copies of background.jpg
let backgroundX = 0;
const SCROLL_SPEED = 1; // Must be divisible by cvs.width
let scrollReset = false;
function drawBackground() {
	CTX.drawImage(BACKGROUND, backgroundX, 0);
	CTX.drawImage(BACKGROUND, backgroundX + CVS.width, 0);
	scrollReset = (backgroundX == -CVS.width);
	if(scrollReset) {
		backgroundX = 0;
	} else {
		backgroundX -= SCROLL_SPEED
	};
	requestAnimationFrame(drawBackground);
}

function drawTimer() {
	function formatTime(msPerUnit) {
		return (Math.floor((Date.now() - SESSION_START_TIME) / msPerUnit) % 60).toString().padStart(2, '0');
	}
	const TIMER = formatTime(3600000) + ':' + formatTime(60000) + ':' + formatTime(1000);
	CTX.font = '20px Helvetica';
	CTX.fillText('Timer: ' + TIMER, 10, CVS.height - 20);
	requestAnimationFrame(drawTimer);
}

// Biker
const CYCLING_HEIGHT = 370;
const JUMP_HEIGHT = CYCLING_HEIGHT - 210;
const GRAVITY = 3;
const BIKER_X = 10;
let bikerY = CYCLING_HEIGHT;
function drawBiker() {
	CTX.drawImage(BIKER, BIKER_X, bikerY);
	if(bikerY >= JUMP_HEIGHT && jumpUp) {
		jumpUp = true;
	} else {
		jumpUp = false;
	}
	if(jumpUp) {
		Math.max(bikerY -= GRAVITY, JUMP_HEIGHT);
	} else {
		bikerY = Math.min(CYCLING_HEIGHT, bikerY+= GRAVITY);
	}
	requestAnimationFrame(drawBiker);
}
let jumpUp = false;
function didJump() {
	document.addEventListener('click' || 'touchend', event => {
		if (bikerY == CYCLING_HEIGHT) {
			jumpUp = true;
			if(musicOn) {
				JUMP_AUDIO.play();
			}
		}
	});
}

// Oncoming
const RUNNING_HEIGHT = 445;
const FLYING_HEIGHT = RUNNING_HEIGHT - 175;
const ONCOMING_SPEED = 2;
const ONCOMING = [];
ONCOMING[0] = {
	pokemon: Math.random() < 0.50 ? 
		KABUTO : 
		OMANYTE,
	x: CVS.width,
	y: RUNNING_HEIGHT,
};
function generateRandomPokemon(pokemonOdds) {
	if (pokemonOdds < 0.325) {
		newPokemon = KABUTO;
	} else if (pokemonOdds < 0.650) {
		newPokemon = OMANYTE;
	} else if (pokemonOdds < 0.800) {
		newPokemon = KABUTOPS;
	} else if (pokemonOdds < 0.950) {
		newPokemon = OMASTAR;
	} else newPokemon = AERODACTYL;
}
function detectCollision(maxIndex) {
	const DID_X_COLLIDE = (
		(BIKER_X <= ONCOMING[maxIndex].x && ONCOMING[maxIndex].x <= BIKER_X + BIKER.width)
		||
		(BIKER_X <= ONCOMING[maxIndex].x + ONCOMING[maxIndex].pokemon.width && ONCOMING[maxIndex].x + ONCOMING[maxIndex].pokemon.width <= BIKER_X + BIKER.width)
	)
	const DID_Y_COLLIDE = (
		(bikerY <= ONCOMING[maxIndex].y && ONCOMING[maxIndex].y <= bikerY + BIKER.height)
		||
		(bikerY <= ONCOMING[maxIndex].y + ONCOMING[maxIndex].pokemon.height && ONCOMING[maxIndex].y + ONCOMING[maxIndex].pokemon.height <= bikerY + BIKER.height)
	)
	const DID_COLLIDE = DID_X_COLLIDE && DID_Y_COLLIDE;
	if(DID_COLLIDE) {
		isGameOver = true;
		if(isGameOver) {
			handleGameOver();
		}
	}
}

function drawOncoming() {
	const MAX_INDEX = ONCOMING.length - 1;
	CTX.drawImage(ONCOMING[MAX_INDEX].pokemon, ONCOMING[MAX_INDEX].x, ONCOMING[MAX_INDEX].y);
	ONCOMING[MAX_INDEX].x -= ONCOMING_SPEED;
	if (ONCOMING[MAX_INDEX].x + ONCOMING[MAX_INDEX].pokemon.width + 1 == 0) {
		generateRandomPokemon(Math.random());
		ONCOMING.push({
			pokemon: newPokemon,
			x: CVS.width,
			y: newPokemon == AERODACTYL ? 
				FLYING_HEIGHT : 
				RUNNING_HEIGHT
		});
	}
	requestAnimationFrame(drawOncoming);
	detectCollision(MAX_INDEX);
}

function clearCanvas() {
	CTX.clearRect(0, 0, canvas.width, canvas.height);
	setTimeout(clearCanvas, 1);
}

drawBackground();
drawTimer();
drawBiker();
didJump();
drawOncoming();
clearCanvas();

// Quiz: Which episode of the Pokémon anime this is based on? ¯\_(ツ)_/¯
// Quiz: Where does this game take place? ¯\_(ツ)_/¯