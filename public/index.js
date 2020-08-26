let cvs = document.getElementById('canvas'); 
let ctx = cvs.getContext('2d'); 

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

// Bike ride timer
let secs = 0;
let mins = 0;
let hrs = 0;
const SESSION_START_TIME = Date.now();

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
		if(musicOn) {
			jumpAudio.play();
		}
	}
});

// Oncoming pokemon
const RUNNING_HEIGHT = 445;
const FLYING_HEIGHT = RUNNING_HEIGHT - 175;
const ONCOMING_SPEED = 2;
const oncoming = [];
const firstPokemon = Math.random() < 0.50 ? 
	kabuto : 
	omanyte;
oncoming[0] = {
	pokemon: firstPokemon,
	x: cvs.width,
	y: RUNNING_HEIGHT,
};

// Infinite background scroll
let bgWidth = 0; // Start first image at (0,0)
const scrollSpeed = 1; // Must be divisible by cvs.width
let scrollReset = false;

function draw() {
	// Perpetually loop two background images
	ctx.drawImage(background, bgWidth, 0);
	ctx.drawImage(background, bgWidth + cvs.width, 0);
	scrollReset = (bgWidth == -cvs.width);
	if(scrollReset) {
		bgWidth = 0;
	} else {
		bgWidth -= scrollSpeed
	};

	// Biker
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

	// Timer (1000 millisecs per second; subtract secs already counted as mins (60000 milliseconds per minute))
	secs = Math.floor((Date.now() - SESSION_START_TIME) / 1000) - (Math.floor((Date.now() - SESSION_START_TIME) / 60000) * 60); 
	mins = Math.floor((Date.now() - SESSION_START_TIME) / 60000) - (Math.floor((Date.now() - SESSION_START_TIME) / 3600000) * 60); 
	hrs = Math.floor((Date.now() - SESSION_START_TIME) / 3600000);

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
		let pokemonInBIKER_X = (
			// Is front of pokemon (oncoming[i].x) within BIKER's range of x values?
				(BIKER_X <= oncoming[i].x && oncoming[i].x <= BIKER_X + biker.width)
			||
			// Is back of pokemon (oncoming[i].x + oncoming[i].pokemon.width) within BIKER's range of x values?
				(BIKER_X <= oncoming[i].x + oncoming[i].pokemon.width && oncoming[i].x + oncoming[i].pokemon.width <= BIKER_X + biker.width)
		)
		// Is the Pokemon within the BIKER's range of Y values?
		let pokemonInbikerY = (
			// Is top of pokemon (oncoming[i].y) within BIKER's range of y values?
				(bikerY <= oncoming[i].y && oncoming[i].y <= bikerY + biker.height)
			||
			// Is bottom of pokemon (oncoming[i].y + oncoming[i].pokemon.height) within BIKER's range of y values?
				(bikerY <= oncoming[i].y + oncoming[i].pokemon.height && oncoming[i].y + oncoming[i].pokemon.height <= bikerY + biker.height)
		)
		// If a collision has occured, reload the page
		if (pokemonInBIKER_X == true && pokemonInbikerY == true) location.reload();
	}
	requestAnimationFrame(draw);
}
draw();
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Bonus point: Can you figure out which episode of the Pokémon anime this is based on...? ¯\_(ツ)_/¯
// Bonus point: Can you figure out where in the world this game takes place...? ¯\_(ツ)_/¯