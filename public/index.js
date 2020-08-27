const cvs = document.getElementById('canvas'); 
const ctx = cvs.getContext('2d');

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
const biker = loadImage('images/biker.gif');
const background = loadImage('images/background.jpg');
const kabuto = loadImage('images/kabuto.gif');
const omanyte = loadImage('images/omanyte.gif');
const kabutops = loadImage('images/kabutops.gif');
const omastar = loadImage('images/omastar.gif');
const aerodactyl = loadImage('images/aerodactyl.gif');

function loadAudio(src) {
	let tmp = new Audio();
	tmp.src = src;
	return tmp;
};
const themeAudio = loadAudio('audio/theme-audio.mp3');
const jumpAudio = loadAudio('audio/jump-audio.mp3');
const scoreAudio = loadAudio('audio/score-audio.mp3');
const musicOn = false;
if(musicOn) {
	themeAudio.loop = true;
	themeAudio.play();
};

// Infinitely loop two copies of background.jpg
let backgroundX = 0;
const scrollSpeed = 1; // Must be divisible by cvs.width
let scrollReset = false;
function drawBackground() {
	ctx.drawImage(background, backgroundX, 0);
	ctx.drawImage(background, backgroundX + cvs.width, 0);
	scrollReset = (backgroundX == -cvs.width);
	if(scrollReset) {
		backgroundX = 0;
	} else {
		backgroundX -= scrollSpeed
	};
	requestAnimationFrame(drawBackground);
}

function drawTimer() {
	function formatTime(msPerUnit) {
		return (Math.floor((Date.now() - SESSION_START_TIME) / msPerUnit) % 60).toString().padStart(2, '0');
	}
	const timer = formatTime(3600000) + ':' + formatTime(60000) + ':' + formatTime(1000);
	ctx.font = '20px Helvetica';
	ctx.fillText('Timer: ' + timer, 10, cvs.height - 20);
	requestAnimationFrame(drawTimer);
}

// Biker
const CYCLING_HEIGHT = 370;
const JUMP_HEIGHT = CYCLING_HEIGHT - 210;
const GRAVITY = 3;
const BIKER_X = 10;
let bikerY = CYCLING_HEIGHT;
function drawBiker() {
	ctx.drawImage(biker, BIKER_X, bikerY);
	if(bikerY >= JUMP_HEIGHT && jumpUp == true) {
		jumpUp = true;
	} else {
		jumpUp = false;
	}
	if(jumpUp == true) {
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
				jumpAudio.play();
			}
		}
	});
}

// Oncoming
const RUNNING_HEIGHT = 445;
const FLYING_HEIGHT = RUNNING_HEIGHT - 175;
const ONCOMING_SPEED = 2;
const oncoming = [];
oncoming[0] = {
	pokemon: Math.random() < 0.50 ? 
		kabuto : 
		omanyte,
	x: cvs.width,
	y: RUNNING_HEIGHT,
};
function generateRandomPokemon(pokemonOdds) {
	if (pokemonOdds < 0.325) {
		newPokemon = kabuto;
	} else if (pokemonOdds < 0.650) {
		newPokemon = omanyte;
	} else if (pokemonOdds < 0.800) {
		newPokemon = kabutops;
	} else if (pokemonOdds < 0.950) {
		newPokemon = omastar;
	} else newPokemon = aerodactyl;
}
function detectCollision(maxIndex) {
	const didXCollide = (
		(BIKER_X <= oncoming[maxIndex].x && oncoming[maxIndex].x <= BIKER_X + biker.width)
		||
		(BIKER_X <= oncoming[maxIndex].x + oncoming[maxIndex].pokemon.width && oncoming[maxIndex].x + oncoming[maxIndex].pokemon.width <= BIKER_X + biker.width)
	)
	const didYCollide = (
		(bikerY <= oncoming[maxIndex].y && oncoming[maxIndex].y <= bikerY + biker.height)
		||
		(bikerY <= oncoming[maxIndex].y + oncoming[maxIndex].pokemon.height && oncoming[maxIndex].y + oncoming[maxIndex].pokemon.height <= bikerY + biker.height)
	)
	const didCollide = didXCollide && didYCollide;
	if(didCollide) {
		isGameOver = true;
		handleGameOver();
	}
}
function drawOncoming() {
	const maxIndex = oncoming.length - 1;
	ctx.drawImage(oncoming[maxIndex].pokemon, oncoming[maxIndex].x, oncoming[maxIndex].y);
	oncoming[maxIndex].x -= ONCOMING_SPEED;
	if (oncoming[maxIndex].x + oncoming[maxIndex].pokemon.width + 1 == 0) {
		generateRandomPokemon(Math.random());
		oncoming.push({
			pokemon: newPokemon,
			x: cvs.width,
			y: newPokemon == aerodactyl ? 
				FLYING_HEIGHT : 
				RUNNING_HEIGHT
		});
	}
	requestAnimationFrame(drawOncoming);
	detectCollision(maxIndex);
}

drawBackground();
drawTimer();
drawBiker();
didJump();
drawOncoming();

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	setTimeout(clearCanvas, 1);
}
clearCanvas();

// Quiz: Which episode of the Pokémon anime this is based on? ¯\_(ツ)_/¯
// Quiz: Where does this game take place? ¯\_(ツ)_/¯