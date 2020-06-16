// Create the canvas and context variables

let cvs = document.getElementById("canvas"); 
let ctx = cvs.getContext("2d"); 

// IMAGES:

let biker 			= new Image();
let background		= new Image();
let kabutops		= new Image();
let aerodactyl 		= new Image();

biker.src			= "images/male-biker-right.gif";
background.src		= "images/ocean-background.jpg";
kabutops.src		= "images/kabutops.gif";
aerodactyl.src		= "images/aerodactyl.gif";

// AUDIO:

let soundtrack 	= new Audio();
let bounce 		= new Audio();
let scor 		= new Audio();

soundtrack.src 	= "audio/gen3-cycling-music.mp3";
bounce.src 		= "audio/mario-jump.mp3";
scor.src 		= "audio/sfx_point.mp3";

// Play background music
// soundtrack.play();

// VARIABLES:

// Set height at which biker cycles
let cyclingHeight = 700;

// Biker coordinates on the canvas.
let bikerX 	= 0;
let bikerY 	= cyclingHeight;

// Add gravity effect that causes biker to descend post-jump.
let gravity = 10;

// Gap between walking and flying pokemon
let gap = 150;

// TIMER:

// Initialize time units
let secs 	= 0;
let mins 	= 0;
let hrs 	= 0;

////////////////////////////////////////////////////////////

// Increment time units

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






////////////////////////////////////////////////////////////

// Each time unit padded w/ two zeroes
let secsPad	= secs.toString().padStart(2, "0");
let minsPad	= mins.toString().padStart(2, "0");
let hrsPad	= hrs.toString().padStart(2, "0");

// Concatenate all time units
let timer = hrsPad + ":" + minsPad + ":" + secsPad;

// FUNCTIONS:

// Make the biker jump when user presses any key.
function moveUp () {
	bikerY -= 500;
	bounce.play();
}

document.addEventListener("keydown", moveUp);

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


// Draw images
function draw () {

	// The scene
	ctx.drawImage(background, 0, 0); 

	// The biker
	ctx.drawImage(biker, bikerX, bikerY);

	bikerY = Math.min(cyclingHeight, bikerY+= gravity);

	// Timer
	ctx.font = "40px Verdana";

	ctx.fillText("Timer: " + timer, 10, cvs.height - 20);


	// Continuously draw new Pokemon and add them to the Pokemon array above
	for (let i = 0; i < pokemon.length; i++) {
		ctx.drawImage(kabutops,		pokemon[i].x, 	pokemon[i].y 		);
		//ctx.drawImage(aerodactyl, 	pokemon[i].x, 	pokemon[i].y - gap	);

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



		// Increment speed every 15 seconds


	}
	
	requestAnimationFrame(draw);
}

draw();