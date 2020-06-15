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




// Magikarp coordinates

let karp = [];

karp[0] = {
	x: cvs.width,
	y: 0
}


// Draw images

function draw () {

	ctx.drawImage(background, 0, 0);
	ctx.drawImage(foreground, 0, 400);

	ctx.drawImage(biker, bikerX, bikerY);

	for (let i = 0; i < magikarp.length; i++){
		ctx.drawImage(magikarp, karp[i].x, pipe[i].y);

		karp[i].x--;

		if (karp[i].x == 125){
			karp.push({
				x: cvs.width,
				y: 100
			})
		}
	}

	requestAnimationFrame(draw);

}

draw();