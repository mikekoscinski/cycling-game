const CVS = document.getElementById('canvas'); 
const CTX = CVS.getContext('2d');

// Images:
const BACKGROUND = loadImage('images/background.jpg');
const KABUTO = loadImage('images/kabuto.gif');
const OMANYTE = loadImage('images/omanyte.gif');
const KABUTOPS = loadImage('images/kabutops.gif');
const OMASTAR = loadImage('images/omastar.gif');
const AERODACTYL = loadImage('images/aerodactyl.gif');

// State
const SESSION_START_TIME = Date.now();
let isGameOver = false;
const musicOn = false; // TODO: Disabled until DOM element is added to toggle music on/off. Will eventually be defined with 'let'

// Background
let backgroundX = 0;
const SCROLL_SPEED = 1; // Must be divisible by cvs.width
let scrollReset = false;

const biker = {
	img: loadImage('images/biker.gif'),
	cyclingHeight: 370,
	yPosition: 370,
	xPosition: 10,
	jumpHeight: 160,
	gravity: 3,
	jumpUp: false,
	draw: function() {
		CTX.drawImage(this.img, this.xPosition, this.yPosition);
		didBikerJump();
		handleBikerJump();
		const draw = this.draw.bind(biker)
		requestAnimationFrame(draw);
	}
}

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
const THEME_AUDIO = loadAudio('audio/theme-audio.mp3');
const JUMP_AUDIO = loadAudio('audio/jump-audio.mp3');
const SCORE_AUDIO = loadAudio('audio/score-audio.mp3'); // TODO: Will fire in future when user registers new high score
if (musicOn) THEME_AUDIO.loop = true && THEME_AUDIO.play();

// Infinitely loop two copies of background.jpg
function resetBackgroundScroll() {
	if (scrollReset) return backgroundX = 0;
	return backgroundX -= SCROLL_SPEED;
}
function drawBackground() {
	CTX.drawImage(BACKGROUND, backgroundX, 0);
	CTX.drawImage(BACKGROUND, backgroundX + CVS.width, 0);
	scrollReset = (backgroundX == -CVS.width);
	resetBackgroundScroll();
	requestAnimationFrame(drawBackground);
}

function drawTimer() {
	function formatTime(msPerUnit) {
		return (Math.floor((Date.now() - SESSION_START_TIME) / msPerUnit) % 60).toString().padStart(2, '0');
	}
	const TIMER = formatTime(3600000) + ':' + formatTime(60000) + ':' + formatTime(1000);
	CTX.font = '20px Helvetica';
	CTX.fillText('Timer: ' + TIMER, 10, CVS.height - 20);
	requestAnimationFrame(drawTimer);
}

function didBikerJump() {
	if (biker.yPosition >= biker.jumpHeight && biker.jumpUp) return biker.jumpUp = true;
	return biker.jumpUp = false;
}

function handleBikerJump() {
	if (biker.jumpUp) return Math.max(biker.yPosition -= biker.gravity, biker.jumpHeight);
	return biker.yPosition = Math.min(biker.cyclingHeight, biker.yPosition+= biker.gravity);
}

function didJump() {
	document.addEventListener('click' || 'touchend', event => {
		if (biker.yPosition == biker.cyclingHeight) return (biker.jumpUp = true) && (musicOn && JUMP_AUDIO.play());
	});
}

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

function clearCanvas() {
	CTX.clearRect(0, 0, canvas.width, canvas.height);
	setTimeout(clearCanvas, 1);
}

drawBackground();
drawTimer();
biker.draw()
didJump();
drawOncoming();
clearCanvas();
