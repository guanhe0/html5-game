var cBoardModel = {};
cBoardModel.EMPTY = 0;
cBoardModel.RED = 1;
cBoardModel.GREEN = 2;
cBoardModel.ILLEGAL_TURN = -1;

function BoardModel(cols,rows){
	this._cols = cols || 7;
	this._rows = rows || 6;
	this._data = [];
	this._currentPlayer = cBoardModel.RED;
	this._totalTokens = 0;
	this.reset();
}
_p = BoardModel.prototype;

_p.reset = function(){//初始化棋盘数据
	this._data = [];
	for(var i = 0; i < this._rows; i++){
		this._data[i] = [];
		for(var j = 0; j < this._cols; j++){
			this._data[i][j] = cBoardModel.EMPTY;
		}
	}
	
	this._currentPlayer = cBoardModel.RED;
	this._totalTokens = 0;
}
_p.getPiece = function(col,row){
	return this._data[row][col];
};
_p.getCols = function(){
	return this._cols;
};
_p.getRows = function(){
	return this._rows;
};
_p.makeTurn = function(column){
	//我们正放置的小球颜色
	var piece = this._currentPlayer;
	
	//检查列是否有效
	if(column < 0 | column > this._cols){
		return{
			status:cBoardModel.ILLEGAL_TURN
		}
	}
	
	//检查指定列上没有空行
	//如果没有空行
	//则回合无效
	var row = this._getEmptyRow(column);
	if(row == -1){
		return{
			status:cBoardModel.ILLEGAL_TURN
		}
	}
	
	//发现空行，所以可以放置小球
	this._totalTokens++;
	this._data[row][column] = piece;
	
	//轮到下一玩家
	this._toggleCurrentPlayer();
	//将游戏的回合验证和新的游戏状态一起返回
	return{
		status:this._getGameState(column,row),
		x:column,
		y:row,
		piece:piece
	}
};
_p._getEmptyRow = function(column){//获取指定列的空行，如果有则返回行号;
	for(var i = this._rows - 1;i >= 0; i--){
		if(!this.getPiece(column,i)){
			return i;
		}
	}
	return -1;
}
_p._toggleCurrentPlayer = function(){//交换玩家，如果当前玩家是红，则轮到绿;如果当前玩家是绿，则轮到红;
	if(this._currentPlayer == cBoardModel.RED)
		this._currentPlayer = cBoardModel.GREEN;
	else
		this._currentPlayer = cBoardModel.RED;
}
cBoardModel.NONE = 0;//no win or fail
cBoardModel.WIN = 1;//current player win
cBoardModel.DRAW = 2;//no win and no fail
cBoardModel.ILLEGAL_TURN = 3;//上次试图放置球的操作无效

_p._checkWinDirection = function(column,row,deltaX,deltaY){//从column,row发射(deltaX,deltaY)出去计算相同颜色的球有多少
	var pieceColor = this.getPiece(column,row);
	var tokenCounter = 0;
	var c = column + deltaX;
	var r = row + deltaY;
	while(c >= 0 && r >= 0 && c < this._cols && r < this._rows && this.getPiece(c,r) == pieceColor){
		c += deltaX;
		r +=deltaY;
		tokenCounter++;
	}
	return tokenCounter;
};
_p._getGameState = function(column,row){//获取游戏状态，平局或者还没有结果，每下一个棋判断一次当前棋导致的状态
	if(this._totalTokens == Game.BOARD_WINDT*Game.BOARD_HEIGHT)
		return cBoardModel.DRAW;
	
	for(var deltaX = -1;deltaX < 2; deltaX++){
		for(var deltaY = -1;deltaY < 2; deltaY++){
			if(deltaX == 0 && deltaY = 0)
				continue;
			var count = this._checkWinDirection(column,row,deltaX,deltaY)
			+ this._checkWinDirection(column,row,-deltaX,-deltaY) + 1;
			
			if(count >= 4){
				return cBoardModel.WIN;
			}
		}
	}
	return cBoardModel.NONE;
}