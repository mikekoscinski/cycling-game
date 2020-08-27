let cvs = document.getElementById('canvas'); 
let ctx = cvs.getContext('2d');

const SESSION_START_TIME = Date.now();

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

let backgroundX = 0; // Start first image at (0,0)
const scrollSpeed = 1; // Must be divisible by cvs.width
let scrollReset = false;
function drawBackground() {
	// Perpetually loop two background images
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
function drawOncoming() {
	// Continuously draw and push new oncoming pokemon to the oncoming array
	for (let i = 0; i < oncoming.length; i++) {
		ctx.drawImage(oncoming[i].pokemon, oncoming[i].x, oncoming[i].y);
		oncoming[i].x -= ONCOMING_SPEED;
		// Once the nearest oncoming pokemon reaches biker, draw a new oncoming at the far right of the canvas
		if (oncoming[i].x == BIKER_X) {
			let pokemonOdds = Math.random();
			if (pokemonOdds < 0.325) {
				newPokemon = kabuto;
			} else if (pokemonOdds < 0.650) {
				newPokemon = omanyte;
			} else if (pokemonOdds < 0.800) {
				newPokemon = kabutops;
			} else if (pokemonOdds < 0.950) {
				newPokemon = omastar;
			} else newPokemon = aerodactyl;
			oncoming.push({
				pokemon : newPokemon,
				x : cvs.width,
				y : newPokemon == aerodactyl ? 
					FLYING_HEIGHT : 
					RUNNING_HEIGHT
			});
		}
		// Collision detection:
		// Is the Pokemon within the BIKER's range of X values?
		let didXCollide = (
			// Is front of pokemon (oncoming[i].x) within BIKER's range of x values?
				(BIKER_X <= oncoming[i].x && oncoming[i].x <= BIKER_X + biker.width)
			||
			// Is back of pokemon (oncoming[i].x + oncoming[i].pokemon.width) within BIKER's range of x values?
				(BIKER_X <= oncoming[i].x + oncoming[i].pokemon.width && oncoming[i].x + oncoming[i].pokemon.width <= BIKER_X + biker.width)
		)
		// Is the Pokemon within the BIKER's range of Y values?
		let didYCollide = (
			// Is top of pokemon (oncoming[i].y) within BIKER's range of y values?
				(bikerY <= oncoming[i].y && oncoming[i].y <= bikerY + biker.height)
			||
			// Is bottom of pokemon (oncoming[i].y + oncoming[i].pokemon.height) within BIKER's range of y values?
				(bikerY <= oncoming[i].y + oncoming[i].pokemon.height && oncoming[i].y + oncoming[i].pokemon.height <= bikerY + biker.height)
		)
		// If a collision has occured, reload the page
		if (didXCollide == true && didYCollide == true) location.reload();
	}
	requestAnimationFrame(drawOncoming);
}

drawBackground();
drawTimer();
drawBiker();
didJump();
// drawOncoming();

// Bonus point: Can you figure out which episode of the Pokémon anime this is based on...? ¯\_(ツ)_/¯
// Bonus point: Can you figure out where in the world this game takes place...? ¯\_(ツ)_/¯