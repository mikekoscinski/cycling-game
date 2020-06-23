// Create the canvas and context variables
let cvs = document.getElementById("canvas"); 
let ctx = cvs.getContext("2d"); 

///////////////
/// IMAGES: ///
///////////////

let biker 			= new Image();
let background		= new Image();
let kabuto 			= new Image();
let omanyte 		= new Image();
let kabutops		= new Image();
let omastar 		= new Image();
let aerodactyl 		= new Image();

biker.src			= "images/male-biker-right.gif";
background.src		= "images/ocean-background.jpg";
kabuto.src 			= "images/kabuto.gif";
omanyte.src 		= "images/omanyte.gif";
kabutops.src		= "images/kabutops.gif";
omastar.src 		= "images/omastar.gif";
aerodactyl.src		= "images/aerodactyl.gif";

//////////////
/// AUDIO: ///
//////////////

let soundtrack 		= new Audio();
let jumpSound		= new Audio();
let scor 			= new Audio();

soundtrack.src 		= "audio/gen3-cycling-music.mp3";
jumpSound.src 		= "audio/mario-jump.mp3";
scor.src 			= "audio/sfx_point.mp3";

// Play background music in a loop
soundtrack.loop = true;
soundtrack.play();

//////////////
/// TIMER: ///
//////////////

// Initialize time units
let secs 	= 0;
let mins 	= 0;
let hrs 	= 0;

// Initialize start time
let startTime = Date.now();
// Note: the timer itself must be rendered in the draw function, as it must be redrawn every time a second passes

////////////////
/// HEIGHTS: ///
////////////////

let runningHeight = 890;
let flyingHeight = runningHeight - 400;

// Biker cycling height
let cyclingHeight = 700;

////////////////
/// POKEMON: ///
////////////////

// Oncoming pokemon coordinates stored in array
let oncoming = [];

// Create the first value for the oncoming array

let firstPokemon = Math.random() < 0.50 ? kabuto : omanyte;

oncoming[0] = {
	pokemon : firstPokemon, // eventually, make this 50% chance of omanyte or kabuto
	x 		: cvs.width,
	y 		: runningHeight,
};

//////////////
/// BIKER: ///
//////////////

// Biker coordinates on the canvas.
let bikerX 	= 10;
let bikerY 	= cyclingHeight;

/////////////
/// JUMP: ///
/////////////

// Set maximum jumping height
let jumpHeight = cyclingHeight - 650;

// Add gravity effect that causes biker to descend post-jump.
let gravity = 25;

// Intialize jumpUp status
let jumpUp = null;

// Note: jumpUp will become true when spacebar (keyCode == 32) is pressed AND the biker is already on the ground. The AND prevents double-jumps before they return to ground.
document.addEventListener("keydown", event => {
	if (event.keyCode === 32 && bikerY == cyclingHeight) {
		jumpUp = true;
		jumpSound.play();
	}
	null;
});

///////////////////
/// BACKGROUND: ///
///////////////////

// Background scroll variables that must exist in the global scope:

let bgWidth = 0; // Start the first image at (0,0)
let scrollSpeed = 3; // Must be divisible by cvs.width
let scrollReset = null;

////////////////////////
/// FRAME ANIMATION: ///
////////////////////////

function draw () {
	// Draw the background and have it scroll infinitely to the left
	// This only uses two background images. Once the entire first image is hidden, the loop resets
	ctx.drawImage(background, bgWidth, 0);
	ctx.drawImage(background, bgWidth + cvs.width, 0);

	if (bgWidth == -cvs.width) {
		scrollReset = true;
	} else {
		scrollReset = false;
	}

	if (scrollReset == true) {
		bgWidth = 0;
	} else {
		bgWidth -= scrollSpeed;
	}

	// Draw the biker
	ctx.drawImage(biker, bikerX, bikerY);
	
	// Set the maximum and minimum heights for the biker.
	if (bikerY >= jumpHeight && jumpUp == true) {
		jumpUp = true;
	} else {
		jumpUp = false;
	}

	// If jumpUp is set to true, biker rises upward at the force of gravity. Else, sinks down at the force of gravity. 
	if (jumpUp == true) {
		Math.max(bikerY -= gravity, jumpHeight);
	} else {
		bikerY = Math.min(cyclingHeight, bikerY+= gravity);
	}

	//////////////
	/// TIMER: ///
	//////////////

	// Increment each time unit using real time:

	// Seconds:
	secs = 
	// Count total secs elapsed...
	Math.floor((Date.now() - startTime) / 1000) // 1000 milliseconds per second
	// ... then subtract secs already counted in mins
	- (Math.floor((Date.now() - startTime) / 60000) * 60); // 60000 milliseconds per minute

	// Minutes:
	mins = 
	// Count total mins elapsed...
	Math.floor((Date.now() - startTime) / 60000) // 60000 milliseconds per minute
	/// ... then subtract mins already counted in hrs
	- (Math.floor((Date.now() - startTime) / 3600000) * 60); // 3.6e+6 (3.6 million) milliseconds per hour

	// Hours:
	// Note: Hours is the largest time unit we track... Nobody should have a run that lasts more than 24 hrs... go outside!)
	hrs =
	// Count total hrs elapsed
	Math.floor((Date.now() - startTime) / 3600000) // 3600000 milliseconds per hour

	// Each time unit padded w/ two zeroes
	let secsPad	= secs.toString().padStart(2, "0");
	let minsPad	= mins.toString().padStart(2, "0");
	let hrsPad	= hrs.toString().padStart(2, "0");

	// Concatenate all time units
	let timer = hrsPad + ":" + minsPad + ":" + secsPad;

	ctx.font = "40px Verdana";
	ctx.fillText("Timer: " + timer, 10, cvs.height - 20);

	//////////////////////////////
	/// DRAW ONCOMING POKEMON: ///
	//////////////////////////////

	// Continuously draw and push new oncoming pokemon to the oncoming array
	for (let i = 0; i < oncoming.length; i++) {
		
		// Draw the oncoming pokemon
		ctx.drawImage(oncoming[i].pokemon, oncoming[i].x, oncoming[i].y);

		// Each oncoming pokemon should change its x position this many pixels closer to the biker with each passing frame
		oncoming[i].x -= 15;



		// Speed of pokemon // the time bewteen each one starting to run

		// there is a relationship between this -15 and the oncoming[i].x == 600
		// this only works if [i].x == 15... why?

		// Need to figure this out so I can send mons at the biker at randomly generated times... 
		// ... so you can't just hit spacebar every 3 seconds and keep going forever...




		// Once the current oncoming pokemon gets within a certain range, draw a new one, starting it at the far right of the canvas
		if (oncoming[i].x == 600) {
			let pokemonOdds = Math.random()
			if (pokemonOdds < 0.325) {
				newPokemon = kabuto;
			} else if (pokemonOdds < 0.650) {
				newPokemon = omanyte;
			} else if (pokemonOdds < 0.800) {
				newPokemon = kabutops;
			} else if (pokemonOdds < .950) {
				newPokemon = omastar;
			} else newPokemon = aerodactyl;

			oncoming.push({
				pokemon : newPokemon,
				x 		: cvs.width,
				y 		: newPokemon == aerodactyl ? flyingHeight : runningHeight
			});
		}

		// Detect collision
		if (
			// First, check pokemon vs. biker's x values:
				(
					// Is front of pokemon (oncoming[i].x) within biker's range of x values?
					(bikerX <= oncoming[i].x && oncoming[i].x <= bikerX + biker.width)
					||
					// Is back of pokemon (oncoming[i].x + oncoming[i].pokemon.width) within biker's range of x values?
					(bikerX <= oncoming[i].x + oncoming[i].pokemon.width && oncoming[i].x + oncoming[i].pokemon.width <= bikerX + biker.width)
				)
			&&
			// Then, check pokemon vs. biker's y values
				(
					// Is top of pokemon (oncoming[i].y) within biker's range of y values?
					(bikerY <= oncoming[i].y && oncoming[i].y <= bikerY + biker.height)
					||
					// Is bottom of pokemon (oncoming[i].y + oncoming[i].pokemon.height) within biker's range of y values?
					(bikerY <= oncoming[i].y + oncoming[i].pokemon.height && oncoming[i].y + oncoming[i].pokemon.height <= bikerY + biker.height)
				)
			)
		{
			// If contact has been made, reload the page
			location.reload();
		}
	}
	requestAnimationFrame(draw);
}
draw();

// Bonus points: Can you figure out which episode of the Pokémon anime this is based on...? ¯\_(ツ)_/¯

// Bonus points: Can you figure out where in the world this game takes place...? ¯\_(ツ)_/¯