// Create the canvas and context variables
let cvs = document.getElementById("canvas"); 
let ctx = cvs.getContext("2d"); 

///////////////
/// IMAGES: ///
///////////////

let biker 			= new Image();
let background		= new Image();
let kabutops		= new Image();
let aerodactyl 		= new Image();

biker.src			= "images/male-biker-right.gif";
background.src		= "images/ocean-background.jpg";
kabutops.src		= "images/kabutops.gif";
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

// Play background music
// soundtrack.play();

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
/// POKEMON: ///
////////////////




// Height concept to explore:
// masterHeight -- this is the # of pixels that everything on the ground (biker, running pokemon) should be elevated from the bottom of the canvas

// So everything is standardized and I don't have to set individual heights for every type of image/gif

// cyclingHeight 	= cvs.height - biker.height - masterHeight

// omanyteHeight	= cvs.height - omanyte.height - masterHeight
// kabutoHeight 	= cvs.height - kabuto.height - masterHeight
// omastarHeight 	= cvs.height - omastar.height - masterHeight
// kabutopsHeight 	= cvs.height - kabutops.height - masterHeight





// Set running and flying heights for oncoming pokemon
let runningHeight	= 890;
let flyingHeight 	= runningHeight - 400;

// Oncoming pokemon coordinates stored in array
let oncoming = [];

// Create the first value for the oncoming array
oncoming[0] = {
	pokemon : kabutops, // eventually, make this 50% chance of omanyte or kabuto
	x 		: cvs.width,
	y 		: runningHeight,
};

//////////////
/// BIKER: ///
//////////////

// Set height at which biker cycles
let cyclingHeight = 700;

// Biker coordinates on the canvas.
let bikerX 	= 10;
let bikerY 	= cyclingHeight;

/////////////
/// JUMP: ///
/////////////

// Set maximum jumping height
let jumpHeight = cyclingHeight - 700;

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

////////////////////////
/// FRAME ANIMATION: ///
////////////////////////

function draw () {

	// The scene
	ctx.drawImage(background, 0, 0);

	// Scroll the background from right to left, indefinitely





	// The biker
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




		// there is a relationship between this -15 and the oncoming[i].x == 600
		// this only works if [i].x == 15... why?

		// Need to figure this out so I can send mons at the biker at randomly generated times... 
		// ... so you can't just hit spacebar every 3 seconds and keep going forever...




		// Once the current oncoming pokemon gets within a certain range, draw a new one, starting it at the far right of the canvas
		if (oncoming[i].x == 600) {
			let newPokemon = Math.random() < 0.70 ? kabutops : aerodactyl;
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