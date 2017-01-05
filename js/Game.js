
function Game(canvas){
	this._boardRect = null;
	this._canvas = canvas;
	this._ctx = canvas.getContext("2d");
	this._boardModel = new BoardModel();
	this._firstpart = "red";
	this._secondpart = "green";
	this._adraw = "It is a draw";
	this._boardRenderer = new BoardRenderer(this._ctx,this._boardModel);
	this.handleResize();
}
_p = Game.prototype;
_p.handleResize = function(){
	this._clearCanvas();
	this._boardRect = this._getBoardRect();
	this._boardRenderer._setSize(this._boardRect.x,this._boardRect.y,this._boardRect.cellSize);
	this._boardRenderer._repaint();
}
_p._getBoardRect = function(){
	var cols = this._boardModel.getCols();
	var rows = this._boardModel.getRows();
	var cellSize = Math.floor(
		Math.min(this._canvas.width/cols,this._canvas.height/rows)
	);
	var boardWidth = cellSize*cols;
	var boardHeight = cellSize*rows;
	
	return{//棋盘左上角位置和cellSize
		x:Math.floor((this._canvas.width - boardWidth)/2),
		y:Math.floor((this._canvas.height - boardHeight)/2),
		cellSize:cellSize
	}
};
_p.handleClick = function(x,y){
	//获取列的索引
	var column = Math.floor((x-this._boardRect.x)/this._boardRect.cellSize);
	var row = Math.floor((y-this._boardRect.y)/this._boardRect.cellSize);
	
	//生成回合并检查效果
	var turn = this._boardModel.makeTurn(column,row);
	
	//如果回合无效，则更新游戏盘
	//绘制新球
	if(turn.status != cBoardModel.ILLEGAL_TURN){
		this._boardRenderer._drawToken_d(turn.x,turn.y);	
	}
	
	//上一回合过后有没有产生赢家？
	if(turn.status == cBoardModel.WIN){
		//通知游戏状态并为下轮游戏重置游戏盘
		
		var theWin = turn.piece == BoardModel.RED ? this._firstpart:this._secondpart;
		var result = theWin + 'won the match!'
		var that = this;
		
	//	setTimeout(function(){alert(result)},2000)
	
		setTimeout(function(){alert(result);that._reset()},1000)
		
	//	alert((turn.piece == BoardModel.RED ? 'red':'green') + 'won the match!');
		

	//	this._reset();
	}
	
	if(turn.status == cBoardModel.DRAW){
		var result = this._adraw;
		var that = this;
		setTimeout(function(){alert(result);that._reset()},1000);
	}
}
_p._alert = function(){	
		this._reset();
}

_p._reset = function(){//游戏重置，包括游戏绘制重置，游戏数据重置
	this._clearCanvas();
	this._boardModel.reset();
	this._boardRenderer._repaint();
};
_p._clearCanvas = function(){//填充canvas 矩形
	this._ctx.fillStyle = "white";
	this._ctx.fillRect(0,0,this._canvas.width,this._canvas.height);
}
