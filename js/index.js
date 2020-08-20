var bird = {
	skyDuration: 5,
	pipeStep:0,  //pipe每50ms移动的距离
	birdTop: 250,
	birdStepY:0,
	maxTop: 570,
	minTop: 0,
	pipeGap: 150,  //上下柱子间隙
	randomRange: 150, //柱子高度随机范围
	pipeLength: 6,
	pipeArr: [],
	firstIndex: 0,
	scoreList: [],
	init: function () {
		this.initData();
		this.handleStart();
	},
	initData: function () {
		this.game = document.getElementById('game');
		this.oStart = document.getElementsByClassName('game_start')[0];
		this.playing = document.getElementsByClassName('playing')[0];
		this.oBird = document.getElementsByClassName('bird')[0]; 
		this.oScore = document.getElementsByClassName('score')[0];
		this.end = document.getElementsByClassName('end')[0];
		this.mask = document.getElementsByClassName('mask')[0];
		this.finalScore = document.getElementsByClassName('finalScore')[0];
		this.rankList = document.getElementsByClassName('rank_list')[0];
		this.degree = document.getElementsByClassName('score_item_degree');
		this.resume = document.getElementsByClassName('resume')[0];
		// console.log(this.resume);

        this.pipeStep = (800/this.skyDuration)/(1000/50);//8
	},
	handleStart: function () {
		this.oStart.onclick = () => {
			this.oStart.style.display = 'none';
			this.playing.style.display = 'block';
			this.game.style.animationDuration = this.skyDuration +'s';

			this.oBird.style.left = 80 + 'px';
			this.oBird.classList.add('bird_2');
			this.timer = setInterval(() => {
				this.birdDrop();
				this.pipeMove();
			},50)
			this.handleClick();
			this.createPipe();
		};
		//跳过开始界面
		if(localStorage.getItem('flag') == 'true'){
			this.oStart.onclick();
		}
		localStorage.setItem('flag', false);
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
		var pipeLeft = this.pipeArr[this.firstIndex].up.offsetLeft;
		var pipeTop = parseInt(this.pipeArr[this.firstIndex].up.style.height);
		var birdTop = parseInt(this.oBird.style.top);

		if(this.birdTop >= this.maxTop || this.birdTop <= this.minTop){
			this.gameOver();

		}else if(pipeLeft >= 28 && pipeLeft <= 110){
			if(birdTop <= pipeTop || birdTop - pipeTop >= (this.pipeGap - 30)){
				this.gameOver();
			}
		}else if(pipeLeft <= 27 && pipeLeft > (27 - this.pipeStep)){
				this.oScore.innerText ++;
		}
	},
	createPipe: function () {
		var frag = document.createDocumentFragment();
		for(var i = 0;i < this.pipeLength;i ++){
			var upPipe = document.createElement('div');
			var downPipe = document.createElement('div');

			var left = 200 + 250 * i;
			this.randomHeight(upPipe,downPipe);

			upPipe.classList.add('pipe','pipeTop');
			downPipe.classList.add('pipe','pipeBottom');
			upPipe.style.left = downPipe.style.left = left + 'px';

			frag.appendChild(upPipe);
			frag.appendChild(downPipe);

			this.pipeArr.push({
				up: upPipe,
				down: downPipe
			})
		}
		this.playing.appendChild(frag);
	},
	pipeMove: function () {
		for(var i = 0;i < this.pipeLength;i ++){
	        var oUpPipe = this.pipeArr[i].up;
	        var oDownPipe = this.pipeArr[i].down;
	        var x = oUpPipe.offsetLeft - this.pipeStep;

			oUpPipe.style.left = oDownPipe.style.left = x + 'px';
		}
		var firstPipe = this.pipeArr[this.firstIndex];
		if(firstPipe.up.offsetLeft < -52){
			// console.log('copy');

			this.randomHeight(firstPipe.up,firstPipe.down);

			// var upHeight = Math.floor(Math.random()*100) + 150;
			// firstPipe.up.style.height = upHeight + 'px';
			// firstPipe.down.style.height = (450 - upHeight) + 'px';

			firstPipe.up.style.left = firstPipe.down.style.left = firstPipe.up.offsetLeft + 1500 +'px';
			// console.log(firstPipe.up.style.left);
			this.firstIndex = (++ this.firstIndex) % 6;
		}
	},
	randomHeight:function (pipe1,pipe2) {
		var upHeight = Math.floor(Math.random()*this.randomRange) + 150;
		pipe1.style.height = upHeight + 'px';
		pipe2.style.height = (600 - this.pipeGap - upHeight) + 'px';
	},
	gameOver: function () {
		this.oScore.style.display = 'none';
		this.end.style.display = 'block';
		this.mask.style.display = 'block';
		clearInterval(this.timer);
		this.oBird.style.animationPlayState = 'paused';
		this.game.style.animationPlayState = 'paused';
		this.finalScore.innerText = this.oScore.innerText;
		this.setStorage();
		this.getList();
		this.reStart();
	},
	getTime: function () {
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		month = month < 10 ? '0' + month : month;
		var date = d.getDate();
		date = date < 10 ? '0' + date : date;
		var h = d.getHours();
		h = h < 10 ? '0' + h : h;
		var m = d.getMinutes();
		m = m < 10 ? '0' + m : m;
		var s = d.getSeconds();
		s = s < 10 ? '0' + s : s;

		var template = `${year}.${month}.${date} ${h}:${m}:${s}`;
		return template;

	},
	setStorage: function () {
		var local = localStorage.getItem('score');
		this.scoreList = local ? JSON.parse(local) : [];

		this.scoreList.push({
			score: this.oScore.innerText,
			time: this.getTime(),
		})
		// console.log(this.scoreList);

		localStorage.setItem('score', JSON.stringify(this.scoreList));
	},
	getList: function() {
		this.scoreList = JSON.parse(localStorage.getItem('score'));
		// 使用sort比较器函数使列表按照score降序排列
		this.scoreList.sort(function(a,b){
			return b.score - a.score;
		})
		// console.log(this.scoreList);

		var template = ``;
		var len = this.scoreList.length > 8 ? 8 : this.scoreList.length;
		for(var i = 0;i < len;i ++){
			template += `
				<li class="rank_item">
					<span class="score_item_degree">${i + 1}</span>
					<span class="score_item_score">${this.scoreList[i].score}</span>
					<span class="score_item_time">${this.scoreList[i].time}</span>
				</li>
			`;
		}
		this.rankList.innerHTML = template;

		// 为前三添加样式
		for(var i = 0;i < 3;i ++){
			switch (this.degree[i].innerText) {
				case '1':
					this.degree[i].classList.add('first');
					break;
				case '2':
					this.degree[i].classList.add('second');
					break;
				case '3':
					this.degree[i].classList.add('third');
					break;
			}
		}
	},
	reStart: function() {
		this.resume.onclick = function() {
		// flag用于识别玩家是否通过 点击重新开始 进入游戏，是则跳过开始界面
			localStorage.setItem('flag', true);
			window.location.reload();
		}
	}
}
bird.init();