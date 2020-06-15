// Create the canvas and context variables

let cvs = document.getElementById("canvas"); 
let ctx = cvs.getContext("2d"); 

// IMAGES:

let biker 			= new Image();
let background		= new Image();
let foreground 		= new Image();
let kabutops		= new Image();
let aerodactyl 		= new Image();

biker.src			= "images/male-biker-right.gif";
background.src		= "images/ocean-background.jpg";
foreground.src		= "images/ocean-foreground.png";
kabutops.src		= "images/kabutops.gif";
aerodactyl.src		= "images/aerodactyl.gif";

// VARIABLES:

// Biker coordinates on the canvas.
let bikerX 	= 0;
let bikerY 	= 550;

// Add gravity effect that causes biker to descend post-jump.
let gravity = 10;

// Gap between walking and flying pokemon

let gap = 100;

// FUNCTIONS:

// Make the biker jump when user presses any key.
function moveUp () {
	bikerY -= 200;
}

document.addEventListener("keydown", moveUp);

// Pokemon coordinates

let pokemon = [];

pokemon[0] = {
	x : cvs.width,
	y : 930
};

// Draw images

function draw () {

	ctx.drawImage(background, 0, 0); 

	ctx.drawImage(foreground, 0, 970);

	ctx.drawImage(biker, bikerX, bikerY);

	bikerY += gravity;

	for (let i = 0; i < pokemon.length; i++) {
		ctx.drawImage(kabutops,		pokemon[i].x, 	pokemon[i].y 		);
		ctx.drawImage(aerodactyl, 	pokemon[i].x, 	pokemon[i].y - gap	);

		pokemon[i].x -= 10;

		if (pokemon[i].x == 1000) {
			pokemon.push({
				x : cvs.width,
				y : 930
			});
		}

		// Detect collision

		



		// Increase score


		// Increment speed every 15 points


	}
	
	requestAnimationFrame(draw);
}

draw();




























