// TODO: Add 'clearCanvas' to util first, then worry about pokemon class
// Tackle pokemon class last. Do util Fns class first

const CVS = document.getElementById('canvas'); 
const CTX = CVS.getContext('2d');

// Images:
const KABUTO = loadImage('images/kabuto.gif');
const OMANYTE = loadImage('images/omanyte.gif');
const KABUTOPS = loadImage('images/kabutops.gif');
const OMASTAR = loadImage('images/omastar.gif');
const AERODACTYL = loadImage('images/aerodactyl.gif');

// State
const SESSION_START_TIME = Date.now();
let isGameOver = false;
const musicOn = false; // TODO: Disabled until DOM element is added to toggle music on/off. Will eventually be defined with 'let'

const background = {
	img: loadImage('images/background.jpg'),
	xPosition: 0,
	scrollSpeed: 1, // must be divisible by cvs.width
	scrollReset: false,
	// arrow Fns have no 'this' - only need explicit function declaration if 'this' is needed
	resetScroll: () => {
		if (background.scrollReset) return background.xPosition = 0;
		return background.xPosition -= background.scrollSpeed
	},
	draw: function () {
		CTX.drawImage(background.img, background.xPosition, 0);
		CTX.drawImage(background.img, background.xPosition + CVS.width, 0);
		background.scrollReset = (background.xPosition == -CVS.width);
		background.resetScroll()
		const draw = this.draw.bind(background) // without .bind, 'this' = window after 1st frame (1st two imgs will be drawn, but will not be re-looped after they scroll past. xPos gets increasingly negative)
		requestAnimationFrame(draw);
	}
}

const biker = {
	img: loadImage('images/biker.gif'),
	cyclingHeight: 370,
	yPosition: 370,
	xPosition: 10,
	jumpHeight: 160,
	gravity: 3,
	jumpUp: false,
	// arrow Fns have no 'this' - only need explicit function declaration if 'this' is needed
	didJump: () => biker.jumpUp = (biker.yPosition >= biker.jumpHeight && biker.jumpUp),
	handleJump: () => {
		if (biker.jumpUp) return Math.max(biker.yPosition -= biker.gravity, biker.jumpHeight);
		return biker.yPosition = Math.min(biker.cyclingHeight, biker.yPosition+= biker.gravity);
	},
	listenForJump: () => {
		document.addEventListener('click' || 'touchend', event => {
			if (biker.yPosition == biker.cyclingHeight) return (biker.jumpUp = true) && (musicOn && JUMP_AUDIO.play());
		});
	},
	draw: function() {
		CTX.drawImage(biker.img, biker.xPosition, biker.yPosition);
		this.didJump()
		this.handleJump()
		const draw = this.draw.bind(biker) // without .bind, 'this' = 'window' after 1st frame
		requestAnimationFrame(draw);
	}
}

const timer = {
	output: () => `${util.formatTime(3600000)}:${util.formatTime(60000)}:${util.formatTime(1000)}`,
	draw: function () {
		CTX.font = '20px Helvetica'
		CTX.fillText(`Timer: ${timer.output()}`, 10, CVS.height - 20)
		const draw = this.draw.bind(timer) // must .bind, 'this' = window after 1st frame
		requestAnimationFrame(draw)
	}
}

const util = {
	formatTime: (msPerUnit) => {
		return (Math.floor((Date.now() - SESSION_START_TIME) / msPerUnit) % 60).toString().padStart(2, '0');
	}
}

function clearCanvas() {
	CTX.clearRect(0, 0, canvas.width, canvas.height);
	setTimeout(clearCanvas, 1);
}

function handleGameOver () {
	if (isGameOver) return location.reload();
}

function loadImage(src) {
	let tmp = new Image();
	tmp.src = src;
	return tmp;
};

function loadAudio(src) {
	let tmp = new Audio();
	tmp.src = src;
	return tmp;
};

if (musicOn) THEME_AUDIO.loop = true && THEME_AUDIO.play();

const THEME_AUDIO = loadAudio('audio/theme-audio.mp3');
const JUMP_AUDIO = loadAudio('audio/jump-audio.mp3');
const SCORE_AUDIO = loadAudio('audio/score-audio.mp3'); // TODO: Will fire in future when user registers new high score


// TODO: This needs to be one class. It should be renamed to 'pokemon'. Its properties/methods should probably be renamed too

// Oncoming
const RUNNING_HEIGHT = 445;
const FLYING_HEIGHT = RUNNING_HEIGHT - 175;
const ONCOMING_SPEED = 2;
const ONCOMING = [];
ONCOMING[0] = {
	pokemon: Math.random() < 0.50 ? 
	KABUTO : 
	OMANYTE,
	x: CVS.width,
	y: RUNNING_HEIGHT,
};

// TODO: rename pokemon.generate
function generateRandomPokemon(pokemonOdds) {
	if (pokemonOdds < 0.325) return newPokemon = KABUTO;
	if (pokemonOdds < 0.650) return newPokemon = OMANYTE;
	if (pokemonOdds < 0.800) return newPokemon = KABUTOPS;
	if (pokemonOdds < 0.950) return newPokemon = OMASTAR;
	return newPokemon = AERODACTYL;
}

function detectCollision(maxIndex) {
	const DID_X_COLLIDE = (
		(biker.xPosition <= ONCOMING[maxIndex].x && ONCOMING[maxIndex].x <= biker.xPosition + biker.img.width)
		||
		(biker.xPosition <= ONCOMING[maxIndex].x + ONCOMING[maxIndex].pokemon.width && ONCOMING[maxIndex].x + ONCOMING[maxIndex].pokemon.width <= biker.xPosition + biker.img.width)
	)

	const DID_Y_COLLIDE = (
		(biker.yPosition <= ONCOMING[maxIndex].y && ONCOMING[maxIndex].y <= biker.yPosition + biker.img.height)
		||
		(biker.yPosition <= ONCOMING[maxIndex].y + ONCOMING[maxIndex].pokemon.height && ONCOMING[maxIndex].y + ONCOMING[maxIndex].pokemon.height <= biker.yPosition + biker.img.height)
	)

	const DID_COLLIDE = DID_X_COLLIDE && DID_Y_COLLIDE;
	if (DID_COLLIDE) return (isGameOver = true) && handleGameOver();
}

function drawOncoming() {
	const MAX_INDEX = ONCOMING.length - 1;
	CTX.drawImage(ONCOMING[MAX_INDEX].pokemon, ONCOMING[MAX_INDEX].x, ONCOMING[MAX_INDEX].y);
	ONCOMING[MAX_INDEX].x -= ONCOMING_SPEED;
	if (ONCOMING[MAX_INDEX].x + ONCOMING[MAX_INDEX].pokemon.width + 1 == 0) {
		generateRandomPokemon(Math.random());
		ONCOMING.push({
			pokemon: newPokemon,
			x: CVS.width,
			y: newPokemon == AERODACTYL ? 
				FLYING_HEIGHT : 
				RUNNING_HEIGHT
		});
	}
	requestAnimationFrame(drawOncoming);
	detectCollision(MAX_INDEX);
}

background.draw()
timer.draw();
biker.draw()
biker.listenForJump();
drawOncoming();
clearCanvas();
