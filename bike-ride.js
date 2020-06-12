// Create the canvas

/*create the canvas variable*/
let cvs = document.getElementById("canvas"); 

/* create the context variable */
let ctx = cvs.getContext("2d"); 

// Load images

let biker 		= new Image();
let background	= new Image();
let foreground 	= new Image();
let magikarp	= new Image();

biker.src		= "images/male-biker-right.gif";
background.src	= "images/ocean-background.jpg";
foreground.src	= "images/ocean-foreground.png";
magikarp.src	= "images/magikarp.gif";

// Define variables

let bikerX 	= 10;
let bikerY 	= 150;




// Draw images

function draw () {

	ctx.drawImage(background, 0, 0);
	ctx.drawImage(foreground, 0, 400);

	ctx.drawImage(biker, bikerX, bikerY);

	ctx.drawImage(magikarp, 50, 200);

	requestAnimationFrame(draw);

}

draw();