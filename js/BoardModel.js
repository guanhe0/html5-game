function BoardModel(cols,rows){
	this._cols = cols || 7;
	this._rows = rows || 6;
	this._data = [];
	this._currentPlayer = BoardModel.RED;
	this._totalTokens = 0;
	this.reset();
}
_p = BoardModel.prototype;
BoardModel.EMPTY = 0;
BoardModel.RED = 1;
BoardModel.GREEN = 2;
BoardModel.ILLEGAL_TURN = -1;

_p.reset = function(){
	this._data = [];
	for(var i = 0; i < this._rows; i++){
		this._data[i] = [];
		for(var j = 0; j < this._cols; j++){
			this._data[i][j] = BoardModel.EMPTY;
		}
	}
	
	this._currentPlayer = BoardModel.RED;
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
			status:BoardModel.ILLEGAL_TURN
		}
	}
	
	//检查指定列上没有空行
	//如果没有空行
	//则回合无效
	var row = this._getEmptyRow(column);
	if(row == -1){
		return{
			status:BoardModel.ILLEGAL_TURN
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
_p._getEmptyRow = function(column){
	for(var i = this._rows - 1;i >= 0; i--){
		if(!this.getPiece(column,i)){
			return i;
		}
	}
	return -1;
}
_p._toggleCurrentPlayer = function(){
	if(this._currentPlayer == BoardModel.RED)
		this._currentPlayer = BoardModel.GREEN;
	else
		this._currentPlayer = BoardModel.RED;
}
BoardModel.NONE = 0;//no win or fail
BoardModel.WIN = 1;//current player win
BoardModel.DRAW = 2;//no win and no fail
BoardModel.ILLEGAL_TURN = 3;//上次试图放置球的操作无效

_p._checkWinDirection = function(column,row,deltaX,deltaY){
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
_p._getGameState = function(column,row){
	if(this._totalTokens == Game.BOARD_WINDT*Game.BOARD_HEIGHT)
		return BoardModel.DRAW;
	
	for(var deltaX = -1;deltaX < 2; deltaX++){
		for(var deltaY = -1;deltaY < 2; deltaY++){
			if(deltaX == 0 && deltaY = 0)
				continue;
			var count = this._checkWinDirection(column,row,deltaX,deltaY)
			+ this._checkWinDirection(column,row,-deltaX,-deltaY) + 1;
			
			if(count >= 4){
				return BoardModel.WIN;
			}
		}
	}
	return BoardModel.NONE;
}