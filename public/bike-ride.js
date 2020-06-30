// Create the canvas and context variables
let cvs = document.getElementById("canvas"); 
let ctx = cvs.getContext("2d"); 

///////////////
/// IMAGES: ///
///////////////

// Concise function to create new image without duplicating initialize and assign lines
function newImage(src) {
	let tmp = new Image();
	tmp.src = src;
	return tmp;
}

const BIKER = newImage("images/male-biker-right.gif");
const BACKGROUND = newImage("images/ocean-background.jpg");
const KABUTO = newImage("images/kabuto.gif");
const OMANYTE = newImage("images/omanyte.gif");
const KABUTOPS = newImage("images/kabutops.gif");
const OMASTAR = newImage("images/omastar.gif");
const AERODACTYL = newImage("images/aerodactyl.gif");

//////////////
/// AUDIO: ///
//////////////

const SOUNDTRACK = new Audio();
const JUMP_SOUND = new Audio();
const SCOR = new Audio();

SOUNDTRACK.src = "audio/gen3-cycling-music.mp3";
JUMP_SOUND.src = "audio/mario-jump.mp3";
SCOR.src = "audio/sfx_point.mp3";

// Play BACKGROUND music in a loop
SOUNDTRACK.loop = true;
SOUNDTRACK.play();

//////////////
/// TIMER: ///
//////////////

// Initialize time units for timer tracking duration of bike ride (bottom left corner)
let secs = 0;
let mins = 0;
let hrs = 0;

// Initialize start time for timer tracking duration of bike ride (bottom left corner)
const START_TIME = Date.now();
// Note: the timer itself must be rendered in the draw function, as it must be redrawn every time a second passes

////////////////
/// HEIGHTS: ///
////////////////

// Pokemon running and flying heights
const RUNNING_HEIGHT = 445;
const FLYING_HEIGHT = RUNNING_HEIGHT - 175;

// BIKER cycling height
const CYCLING_HEIGHT = 360;

////////////////
/// POKEMON: ///
////////////////

// Oncoming pokemon coordinates stored in array
let oncoming = [];

// Create the first value for the oncoming array
let firstPokemon = Math.random() < 0.50 ? KABUTO : OMANYTE;

oncoming[0] = {
	pokemon : firstPokemon, // eventually, make this 50% chance of OMANYTE or KABUTO
	x 		: cvs.width,
	y 		: RUNNING_HEIGHT,
};

//////////////
/// BIKER: ///
//////////////

// BIKER coordinates on the canvas
const BIKER_X = 10;
let bikerY = CYCLING_HEIGHT;

/////////////
/// JUMP: ///
/////////////

// Set maximum jumping height
const JUMP_HEIGHT = CYCLING_HEIGHT - 210;

// Add GRAVITY effect that causes BIKER to descend post-jump
const GRAVITY = 3;

// Initialize jumpUp state as false (to prevent instant jump)
let jumpUp = false;

// Jump if user clicks or touches AND BIKER is already on ground
// The AND prevents double-jumps before they return to ground
document.addEventListener("click" || "touchend", event => {
	if (bikerY == CYCLING_HEIGHT) {
		jumpUp = true;
		JUMP_SOUND.play();
	}
	null;
});

///////////////////
/// BACKGROUND: ///
///////////////////

// BACKGROUND scroll variables that must exist in the global scope:
let bgWidth = 0; // Start the first image at (0,0)
let scrollSpeed = 1; // Must be divisible by cvs.width
let scrollReset = null;

////////////////////////
/// FRAME ANIMATION: ///
////////////////////////

function draw () {
	// Draw the BACKGROUND and have it scroll infinitely to the left
	// This only uses two BACKGROUND images. Once the entire first image is hidden, the loop resets
	ctx.drawImage(BACKGROUND, bgWidth, 0);
	ctx.drawImage(BACKGROUND, bgWidth + cvs.width, 0);

	// For looping the two BACKGROUND images infinitely
	// Reset the loop if the entire first image has exited the canvas window
	scrollReset = (bgWidth == -cvs.width);
	scrollReset == true ? bgWidth = 0 : bgWidth -= scrollSpeed;

	// Draw the BIKER
	ctx.drawImage(BIKER, BIKER_X, bikerY);
	
	// Set the maximum and minimum heights for the BIKER
	bikerY >= JUMP_HEIGHT && jumpUp == true ? jumpUp = true : jumpUp = false;

	// If jumpUp is set to true, BIKER rises upward at the force of GRAVITY. Else, sinks down at the force of GRAVITY
	jumpUp == true ? Math.max(bikerY -= GRAVITY, JUMP_HEIGHT) : bikerY = Math.min(CYCLING_HEIGHT, bikerY+= GRAVITY);

	//////////////
	/// TIMER: ///
	//////////////

	// Increment each time unit for the display timer using real UTC time:

	// Seconds:
	secs = 
	// Count total secs elapsed...
	Math.floor((Date.now() - START_TIME) / 1000) // 1000 milliseconds per second
	// ... then subtract secs already counted in mins
	- (Math.floor((Date.now() - START_TIME) / 60000) * 60); // 60000 milliseconds per minute

	// Minutes:
	mins = 
	// Count total mins elapsed...
	Math.floor((Date.now() - START_TIME) / 60000) // 60000 milliseconds per minute
	/// ... then subtract mins already counted in hrs
	- (Math.floor((Date.now() - START_TIME) / 3600000) * 60); // 3.6e+6 (3.6 million) milliseconds per hour

	// Hours:
	// Note: Hours is the largest time unit we track... Nobody should have a run that lasts more than 24 hrs... go outside!
	hrs =
	// Count total hrs elapsed
	Math.floor((Date.now() - START_TIME) / 3600000) // 3600000 milliseconds per hour

	// Each time unit padded w/ two zeroes
	let secsPad	= secs.toString().padStart(2, "0");
	let minsPad	= mins.toString().padStart(2, "0");
	let hrsPad	= hrs.toString().padStart(2, "0");

	// Concatenate all time units
	let timer = hrsPad + ":" + minsPad + ":" + secsPad;

	ctx.font = "20px Helvetica";
	ctx.fillText("Timer: " + timer, 10, cvs.height - 20);

	//////////////////////////////
	/// DRAW ONCOMING POKEMON: ///
	//////////////////////////////

	// Continuously draw and push new oncoming pokemon to the oncoming array
	for (let i = 0; i < oncoming.length; i++) {
		// Draw the oncoming pokemon
		ctx.drawImage(oncoming[i].pokemon, oncoming[i].x, oncoming[i].y);

		// Approach speed of oncoming pokemon (change of x-position measured in pixels per frame)
		let oncomingSpeed = 2;

		// Each oncoming pokemon should change its x position this many pixels closer to the BIKER with each passing frame
		oncoming[i].x -= oncomingSpeed;

		// Once the current oncoming pokemon gets within a certain range, draw a new one, starting it at the far right of the canvas
		if (oncoming[i].x == BIKER_X) {
			let pokemonOdds = Math.random()
			if (pokemonOdds < 0.325) {
				newPokemon = KABUTO;
			} else if (pokemonOdds < 0.650) {
				newPokemon = OMANYTE;
			} else if (pokemonOdds < 0.800) {
				newPokemon = KABUTOPS;
			} else if (pokemonOdds < .950) {
				newPokemon = OMASTAR;
			} else newPokemon = AERODACTYL;

			oncoming.push({
				pokemon : newPokemon,
				x : cvs.width,
				y : newPokemon == AERODACTYL ? FLYING_HEIGHT : RUNNING_HEIGHT
			});
		}

		// Collision detection variables:
		
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