var bird = {
	skyDuration: 5,
	birdTop: 250,
	birdStepY:0,
	maxTop: 570,
	minTop: 0,
	init: function () {
		this.initData();
		this.handleStart();
	},
	initData: function () {
		this.game = document.getElementById('game');
		this.oStart = document.getElementsByClassName('game_start')[0];
		this.oBird = document.getElementsByClassName('bird')[0]; 
		this.oScore = document.getElementsByClassName('score')[0];
	},
	handleStart: function () {
		this.oStart.onclick = () => {
			this.oStart.style.display = 'none';
			this.oScore.style.display = 'block';
			this.game.style.animationDuration = this.skyDuration +'s';

			this.oBird.style.left = 80 + 'px';
			this.oBird.classList.add('bird_2');
			this.timer = setInterval(() => {
				this.birdDrop();
			},30)
			this.handleClick();
		} 
	},
	handleClick: function () {
		this.game.onclick = (e) => {
			if(e.target == this.game){
				this.birdStepY = -10;
			}
		}
	},
	birdDrop: function() {
		this.birdTop += ++this.birdStepY;
		this.oBird.style.top = this.birdTop + 'px';
		this.judgeKnock();
	},
	judgeKnock: function() {
		if(this.birdTop >= this.maxTop || this.birdTop <= this.minTop){
			this.gameOver();
		}
	},
	gameOver: function () {
		clearInterval(this.timer);
		this.oBird.style.animationPlayState = 'paused';
		// console.log('over');
	}
}
bird.init();