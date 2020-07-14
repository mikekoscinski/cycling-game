// Canvas & Context
let cvs = document.getElementById('canvas'); 
let ctx = cvs.getContext('2d'); 

// Images
function loadImage(src) {
	let tmp = new Image();
	tmp.src = src;
	return tmp;
}
const BIKER = loadImage('images/male-biker-right.gif');
const BACKGROUND = loadImage('images/ocean-background.jpg');
const KABUTO = loadImage('images/kabuto.gif');
const OMANYTE = loadImage('images/omanyte.gif');
const KABUTOPS = loadImage('images/kabutops.gif');
const OMASTAR = loadImage('images/omastar.gif');
const AERODACTYL = loadImage('images/aerodactyl.gif');

// Audio
const SOUNDTRACK = new Audio();
const JUMP_SOUND = new Audio();
const SCOR = new Audio();
SOUNDTRACK.src = 'audio/gen3-cycling-music.mp3';
JUMP_SOUND.src = 'audio/mario-jump.mp3';
SCOR.src = 'audio/sfx_point.mp3';

SOUNDTRACK.loop = true;
SOUNDTRACK.play();

// Bike ride timer
let secs = 0;
let mins = 0;
let hrs = 0;
const START_TIME = Date.now();

// Biker
const CYCLING_HEIGHT = 370;
const JUMP_HEIGHT = CYCLING_HEIGHT - 210;
const GRAVITY = 3;
const BIKER_X = 10;
let bikerY = CYCLING_HEIGHT;
let jumpUp = false;
document.addEventListener('click' || 'touchend', event => {
	if (bikerY == CYCLING_HEIGHT) {
		jumpUp = true;
		JUMP_SOUND.play();
	}
});

// Oncoming pokemon
const RUNNING_HEIGHT = 445;
const FLYING_HEIGHT = RUNNING_HEIGHT - 175;
const ONCOMING_SPEED = 2;

let oncoming = [];
let firstPokemon = Math.random() < 0.50 ? KABUTO : OMANYTE;

oncoming[0] = {
	pokemon: firstPokemon,
	x: cvs.width,
	y: RUNNING_HEIGHT,
};

// Infinite background scroll
let bgWidth = 0; // Start the first image at (0,0)
let scrollSpeed = 1; // Must be divisible by cvs.width
let scrollReset = false;

function draw () {
	// Infinite background scroll; reset once 1st image entirely exits canvas (uses two images)
	ctx.drawImage(BACKGROUND, bgWidth, 0);
	ctx.drawImage(BACKGROUND, bgWidth + cvs.width, 0);
	scrollReset = (bgWidth == -cvs.width);
	scrollReset == true ? bgWidth = 0 : bgWidth -= scrollSpeed;

	// Biker
	ctx.drawImage(BIKER, BIKER_X, bikerY);
	bikerY >= JUMP_HEIGHT && jumpUp == true ? jumpUp = true : jumpUp = false; // Max & min heights for biker
	jumpUp == true ? Math.max(bikerY -= GRAVITY, JUMP_HEIGHT) : bikerY = Math.min(CYCLING_HEIGHT, bikerY+= GRAVITY); // Did biker jump (Y/N)? -> gravity effect

	// Timer (1000 millisecs per second; subtract secs already counted as mins (60000 milliseconds per minute))
	secs = Math.floor((Date.now() - START_TIME) / 1000) - (Math.floor((Date.now() - START_TIME) / 60000) * 60); 
	mins = Math.floor((Date.now() - START_TIME) / 60000) - (Math.floor((Date.now() - START_TIME) / 3600000) * 60); 
	hrs = Math.floor((Date.now() - START_TIME) / 3600000);

	let secsPad	= secs.toString().padStart(2, '0');
	let minsPad	= mins.toString().padStart(2, '0');
	let hrsPad	= hrs.toString().padStart(2, '0');

	let timer = hrsPad + ':' + minsPad + ':' + secsPad;
	ctx.font = '20px Helvetica';
	ctx.fillText('Timer: ' + timer, 10, cvs.height - 20);

	// Continuously draw and push new oncoming pokemon to the oncoming array
	for (let i = 0; i < oncoming.length; i++) {
		ctx.drawImage(oncoming[i].pokemon, oncoming[i].x, oncoming[i].y);
		
		oncoming[i].x -= ONCOMING_SPEED;

		// Once the current oncoming pokemon gets within a certain range, draw a new one, starting it at the far right of the canvas
		if (oncoming[i].x == BIKER_X) {
			let pokemonOdds = Math.random();
			if (pokemonOdds < 0.325) {
				newPokemon = KABUTO;
			} else if (pokemonOdds < 0.650) {
				newPokemon = OMANYTE;
			} else if (pokemonOdds < 0.800) {
				newPokemon = KABUTOPS;
			} else if (pokemonOdds < 0.950) {
				newPokemon = OMASTAR;
			} else newPokemon = AERODACTYL;

			oncoming.push({
				pokemon : newPokemon,
				x : cvs.width,
				y : newPokemon == AERODACTYL ? FLYING_HEIGHT : RUNNING_HEIGHT
			});
		}
		
		// Collision detection:
		
		// Is the Pokemon within the BIKER's range of X values?
		let pokemonInBIKER_X = (
			// Is front of pokemon (oncoming[i].x) within BIKER's range of x values?
				(BIKER_X <= oncoming[i].x && oncoming[i].x <= BIKER_X + BIKER.width)
			||
			// Is back of pokemon (oncoming[i].x + oncoming[i].pokemon.width) within BIKER's range of x values?
				(BIKER_X <= oncoming[i].x + oncoming[i].pokemon.width && oncoming[i].x + oncoming[i].pokemon.width <= BIKER_X + BIKER.width)
		)
		// Is the Pokemon within the BIKER's range of Y values?
		let pokemonInbikerY = (
			// Is top of pokemon (oncoming[i].y) within BIKER's range of y values?
				(bikerY <= oncoming[i].y && oncoming[i].y <= bikerY + BIKER.height)
			||
			// Is bottom of pokemon (oncoming[i].y + oncoming[i].pokemon.height) within BIKER's range of y values?
				(bikerY <= oncoming[i].y + oncoming[i].pokemon.height && oncoming[i].y + oncoming[i].pokemon.height <= bikerY + BIKER.height)
		)
		// If a collision has occured, reload the page
		if (pokemonInBIKER_X == true && pokemonInbikerY == true) location.reload();
	}
	requestAnimationFrame(draw);
}
draw();

// Bonus point: Can you figure out which episode of the Pokémon anime this is based on...? ¯\_(ツ)_/¯

// Bonus point: Can you figure out where in the world this game takes place...? ¯\_(ツ)_/¯