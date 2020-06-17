// Create the canvas and context variables

let cvs = document.getElementById("canvas"); 
let ctx = cvs.getContext("2d"); 

//////////////
/// IMAGES:///
//////////////

let biker 			= new Image();
let background		= new Image();
let kabutops		= new Image();
let aerodactyl 		= new Image();

biker.src			= "images/male-biker-right.gif";
background.src		= "images/ocean-background.jpg";
kabutops.src		= "images/kabutops.gif";
aerodactyl.src		= "images/aerodactyl.gif";

/////////////
/// AUDIO:///
/////////////

let soundtrack 		= new Audio();
let bounce 			= new Audio();
let scor 			= new Audio();

soundtrack.src 		= "audio/gen3-cycling-music.mp3";
bounce.src 			= "audio/mario-jump.mp3";
scor.src 			= "audio/sfx_point.mp3";

// Play background music
// soundtrack.play();

/////////////////
/// VARIABLES:///
/////////////////

// Set height at which biker cycles
let cyclingHeight = 700;

// Biker coordinates on the canvas.
let bikerX 	= 0;
let bikerY 	= cyclingHeight;

// Add gravity effect that causes biker to descend post-jump.
let gravity = 10;

// Gap between walking and flying pokemon
let gap = 150;

/////////////
/// TIMER:///
/////////////

// Initialize time units
let secs 	= 0;
let mins 	= 0;
let hrs 	= 0;

// Each time unit padded w/ two zeroes
let secsPad	= secs.toString().padStart(2, "0");
let minsPad	= mins.toString().padStart(2, "0");
let hrsPad	= hrs.toString().padStart(2, "0");

// Concatenate all time units
let timer = hrsPad + ":" + minsPad + ":" + secsPad;

/////////////////
/// FUNCTIONS:///
/////////////////

// Check if the biker is on the ground. If they're touching the ground then they can jump
function moveUp () {
	if (bikerY == cyclingHeight) { // If the biker is on the ground...
		bikerY -= 500; // ... Then let them jump...
		bounce.play(); // ... And play the jump sound.
	} else {
		null; // Otherwise, do nothing. (This prevents double-jumping)
	}
}

// Execute the jump function if the user presses the spcebar (key code "32")
document.addEventListener("keydown", event => {
	if (event.keyCode === 32) {
		moveUp();
	}
	null;
});

// Pokemon coordinates stored in array
let pokemon = [];

pokemon[0] = {
	x : cvs.width,
	y : 890
};

// Update time in timer (for time-played leaderboard)
let start = Date.now();
setInterval(function() {
	let delta = Date.now() - start; // milliseconds elapsed since start
	return (Math.floor(delta / 1000)); // in seconds
})

// Draw each animation frame
function draw () {

	// The scene
	ctx.drawImage(background, 0, 0); 

	// The biker
	ctx.drawImage(biker, bikerX, bikerY);

	bikerY = Math.min(cyclingHeight, bikerY+= gravity);

	// Timer
	ctx.font = "40px Verdana";

	ctx.fillText("Timer: " + timer, 10, cvs.height - 20);


	// Continuously draw and push new Pokemon to the Pokemon array
	for (let i = 0; i < pokemon.length; i++) {
		ctx.drawImage(kabutops,		pokemon[i].x, 	pokemon[i].y 		);
		//ctx.drawImage(aerodactyl, 	pokemon[i].x, 	pokemon[i].y - gap	);
		// Saved for when flying pokemon are eventually added
		pokemon[i].x -= 15;

		if (pokemon[i].x == 600) {
			pokemon.push({
				x : cvs.width,
				y : 890
			});
		}

		// Detect collision
		if (
			// Check if Biker has made contact with side of pokemon
			(bikerX + biker.width >= pokemon[i].x 
			&& bikerX <= pokemon[i].x + kabutops.width
			&& bikerY + biker.height >= pokemon[i].y)

			// Check if biker has made contact with top of pokemon
			|| bikerY >= pokemon[i].y
			) {
			location.reload();
		}

		// Increment timer
		let startTime = Date.now();

		secs = Math.floor((Date.now() - startTime) / 1000);

		if (secs == 60) {
			secs = 0;
			mins += 1;
		}

		if (mins == 60) {
			mins = 0;
			hrs += 1;
		}




		// Increment speed every 15 seconds


	}
	
	requestAnimationFrame(draw);
}

draw();