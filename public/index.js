const CVS = document.getElementById('canvas'); 
const CTX = CVS.getContext('2d');

const util = {
	sanitize: (text) => text.toString().toLowerCase(),
	load: (fileType) => {
		const supportedMedia = ['audio', 'image']
		if (!supportedMedia.includes(util.sanitize(fileType))) throw new Error('Error: Attempted to load unsupported media.')
		return (src) => {
			let tmp
			if (util.sanitize(fileType) === 'audio') tmp = new Audio()
			if (util.sanitize(fileType) === 'image') tmp = new Image()
			tmp.src = src
			return tmp
		}
	},
	clearCanvas: () => {
		CTX.clearRect(0, 0, canvas.width, canvas.height);
		setTimeout(util.clearCanvas, 1) // delete accumulated frames every 1 ms
	}
}

const game = {
	isOver: false,
	handleIsOver: () => {
		if (game.isOver) return location.reload()
	}
}

const background = {
	img: util.load('image')('images/background.jpg'),
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
	img: util.load('image')('images/biker.gif'),
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
			if (biker.yPosition == biker.cyclingHeight) return (biker.jumpUp = true) && (audio.on && audio.jump.play());
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
	start: Date.now(),
	format: (msPerUnit) => {
		return (Math.floor((Date.now() - timer.start) / msPerUnit) % 60).toString().padStart(2, '0');
	},
	output: () => {
		return `${timer.format(3600000)}:${timer.format(60000)}:${timer.format(1000)}`
	},
	draw: function () {
		CTX.font = '20px Helvetica'
		CTX.fillText(`Timer: ${timer.output()}`, 10, CVS.height - 20)
		const draw = this.draw.bind(timer) // must .bind, 'this' = window after 1st frame
		requestAnimationFrame(draw)
	}
}

const audio = {
	theme: util.load('audio')('audio/theme-audio.mp3'),
	jump: util.load('audio')('audio/jump-audio.mp3'),
	score: util.load('audio')('audio/score-audio.mp3'),
	on: false,
	play: () => {
		if (audio.on) audio.theme.loop = true && audio.theme.play()
	}
}

const pokemon = {
	height: {
		running: 445,
		flying: 270
	},
	speed: 2, // speed = change in pokemon's xPosition per frame
	kabuto: util.load('image')('images/kabuto.gif'),
	omanyte: util.load('image')('images/omanyte.gif'),
	kabutops: util.load('image')('images/kabutops.gif'),
	omastar: util.load('image')('images/omastar.gif'),
	aerodactyl: util.load('image')('images/aerodactyl.gif'),
	oncoming: [],
	generateFirst: () => {
		pokemon.oncoming.push({
			species: Math.random() < 0.50 ? 
				pokemon.kabuto : 
				pokemon.omanyte,
			x: CVS.width,
			y: pokemon.height.running,
		}
	)},
	generate: (rand) => {
		if (rand < 0.325) return pokemon.kabuto;
		if (rand < 0.650) return pokemon.omanyte;
		if (rand < 0.800) return pokemon.kabutops;
		if (rand < 0.950) return pokemon.omastar;
		return pokemon.aerodactyl;
	},
	detectCollision: (maxIndex) => {
		const DID_X_COLLIDE = (
			(biker.xPosition <= pokemon.oncoming[maxIndex].x && pokemon.oncoming[maxIndex].x <= biker.xPosition + biker.img.width)
			||
			(biker.xPosition <= pokemon.oncoming[maxIndex].x + pokemon.oncoming[maxIndex].species.width && pokemon.oncoming[maxIndex].x + pokemon.oncoming[maxIndex].species.width <= biker.xPosition + biker.img.width)
		)
		const DID_Y_COLLIDE = (
			(biker.yPosition <= pokemon.oncoming[maxIndex].y && pokemon.oncoming[maxIndex].y <= biker.yPosition + biker.img.height)
			||
			(biker.yPosition <= pokemon.oncoming[maxIndex].y + pokemon.oncoming[maxIndex].species.height && pokemon.oncoming[maxIndex].y + pokemon.oncoming[maxIndex].species.height <= biker.yPosition + biker.img.height)
		)
		const DID_COLLIDE = DID_X_COLLIDE && DID_Y_COLLIDE;
		if (DID_COLLIDE) return (game.isOver = true) && game.handleIsOver();
	},
	draw: function () {
		const MAX_INDEX = pokemon.oncoming.length - 1;
		CTX.drawImage(pokemon.oncoming[MAX_INDEX].species, pokemon.oncoming[MAX_INDEX].x, pokemon.oncoming[MAX_INDEX].y);
		pokemon.oncoming[MAX_INDEX].x -= pokemon.speed;
		if (pokemon.oncoming[MAX_INDEX].x + pokemon.oncoming[MAX_INDEX].species.width + 1 == 0) {
			const species = pokemon.generate(Math.random())
			pokemon.oncoming.push({
				species,
				x: CVS.width,
				y: species == pokemon.aerodactyl ? 
					pokemon.height.flying : 
					pokemon.height.running
			});
		}
		const draw = this.draw.bind(pokemon)
		requestAnimationFrame(draw);
		pokemon.detectCollision(MAX_INDEX);
	}
}

background.draw()
pokemon.generateFirst()
timer.draw();
biker.draw()
biker.listenForJump();
audio.play()
pokemon.draw()
util.clearCanvas();
