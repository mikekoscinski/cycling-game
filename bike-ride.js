// Create the canvas

/*create the canvas variable*/
let cvs = document.getElementById("canvas"); 

/* create the context variable */
let ctx = cvs.getContext("2d"); 

// Load images

let biker 			= new Image();
let background		= new Image();
let foreground 		= new Image();
let magikarp		= new Image();
let zubat 			= new Image();

biker.src			= "images/male-biker-right.gif";
background.src		= "images/ocean-background.jpg";
foreground.src		= "images/ocean-foreground.png";
magikarp.src		= "images/magikarp.gif";
zubat.src			= "images/zubat.gif";


// Define variables

// BIKER-RELATED CODE:

// Biker coordinates on the canvas.

let bikerX 	= 0;
let bikerY 	= 550;

// Make the biker jump when user presses any key.

function moveUp () {
	bikerY -= 200;
}

document.addEventListener("keydown", moveUp);

// Add gravity effect that causes biker to descend post-jump.

let gravity = 10;



// MAGIKARP-RELATED CODE:

// Magikarp coordinates

let pokemon = [];

pokemon[0] = {
	x : cvs.width,
	y : 0
} 

// Constant for flying pokemon

let constant = 10;

// Draw images

function draw () {

	ctx.drawImage(background, 0, 0); 

	for (let i = 0; i < pokemon.length; i++) {
		ctx.drawImage(magikarp, pokemon[i].x, pokemon[i].y);
		ctx.drawImage(zubat, pokemon[i].x, pokemon[i].y + constant)

		pokemon[i].x-= 6;

	}


	ctx.drawImage(foreground, 0, 978);

	ctx.drawImage(biker, bikerX, bikerY);

	bikerY += gravity;

	requestAnimationFrame(draw);
}

draw();