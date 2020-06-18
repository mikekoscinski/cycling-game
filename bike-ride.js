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

// Set running and flying heights for oncoming pokemon
let runningHeight	= 890;
let flyingHeight 	= 1100;

// oncoming coordinates stored in array
let oncoming = [];

// rename this oncoming? and have "oncoming" be a property of the object? eg oncoming[0] = kabuto, x=cvs.width, y = runningHeight

oncoming[0] = {
	pokemon : kabutops, // eventually, make this 50% chance of omanyte or kabuto
	x 		: cvs.width,
	y 		: pokemon == aerodactyl ? flyingHeight : runningHeight, // need to make this contingent on the pokemon property value, both here and in the draw() function as well -- when the new mon is pushed to this array
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
let jumpHeight = cvs.height - cyclingHeight - 500;

// Add gravity effect that causes biker to descend post-jump.
let gravity = 25;

// Intialize jumpUp status
let jumpUp = null;

// jumpUp will become true when spacebar (keyCode == 32) is pressed AND the biker is already on the ground. The AND prevents double-jumps before they return to ground.

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

	// Increment each time unit using real time

	secs = 
	// Count total secs elapsed... 
	Math.floor((Date.now() - startTime) / 1000) // 1000 milliseconds per second
	// ... then subtract secs already counted in mins
	- (Math.floor((Date.now() - startTime) / 60000) * 60); // 60000 milliseconds per minute

	mins = 
	// Count total mins elapsed...
	Math.floor((Date.now() - startTime) / 60000) // 60000 milliseconds per minute
	/// ... then subtract mins already counted in hrs
	- (Math.floor((Date.now() - startTime) / 3600000) * 60); // 3.6e+6 (3.6 million) milliseconds per hour

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

	/////////////////////
	/// DRAW oncoming: ///
	/////////////////////

	// Continuously draw and push new oncoming to the oncoming array
	
	for (let i = 0; i < oncoming.length; i++) {
		


		ctx.drawImage(oncoming[i].pokemon, oncoming[i].x, oncoming[i].y);



		oncoming[i].x -= 15;

		// there is a relationship between this -15 and the oncoming[i].x == 600
		// this only works if [i].x == 15... why?

		if (oncoming[i].x == 600) {
			oncoming.push({
				pokemon : Math.random() < 0.70 ? kabutops : aerodactyl,
				x 		: cvs.width,
				y 		: 890
			});
		}

		// Detect collision
		if (
			// Check if Biker has made contact with side of oncoming
			(bikerX + biker.width >= oncoming[i].x 
			&& bikerX <= oncoming[i].x + kabutops.width
			&& bikerY + biker.height >= oncoming[i].y)

			// Check if biker has made contact with top of oncoming
			|| bikerY >= oncoming[i].y
			) {
			location.reload();
		}
	}





	requestAnimationFrame(draw);
}
draw();