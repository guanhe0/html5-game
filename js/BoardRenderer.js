function BoardRenderer(context,model){
	this._ctx = context;
	this._model = model;
	
	//为方便保存
	this._cols = model.getCols();
	this._rows = model.getRows();
	//游戏盘左上角
	this._x = 0;
	this._y = 0;
	//游戏盘矩形的宽度和高度
	this._width = 0;
	this._height = 0;
	//游戏盘单元格的最佳大小
	this._cellSize = 0;
}
_p = BoardRenderer.prototype;
//定义半径
var radius = cellSize*0.4;
//渐变圆心
var gradientX = cellSize*0.1;
var gradientY = -cellSize*0.1;

var gradient = ctx.createRadialGradient(
gradientX,gradientY,cellSize*0.1,//内圆
gradientX,gradientY,radius*1.2);//外圆

//设置游戏中的UI参数，画布上游戏的位置和单元格大小
_p.setSize = function(x,y,cellSize){
	this._x = x;
	this._y = y;
	this._cellSize = cellSize;
	this._width = this._cellSize * this._cols;
	this._height = this._cellSize * this._rows;
}
_p._drawBackground = function(){
	var ctx = this._ctx;
	
	//background
	var gradient = ctx.createLinearGradient(0,0,0,this._height);
	gradient.addColorStop(0,"#fffb3");
	gradient.addColorStop(1,"f6f6b2");
	ctx.fillStyle = gradient;
	ctx.fillRect(0,0,this._width,this._height);
	
	//绘制曲线
	var co = this._width/6;
	ctx.strokeStyle = "#dad7ac";
	ctx.fillStyle = "#f6f6b2";
	
	//第一条曲线
	ctx.beginPath();
	ctx.moveTo(co,this._height);
	ctx.bezierCurveTo(this._width + co*3,-co,-co*3,-co,this._width-co,this._height);
	ctx.fill();
	
	//第二条曲线
	ctx.beginPath();
	ctx.moveTo(co,0);
	ctx.bezierCurveTo(this._width + co * 3,this._height + co,-co*3,this._height + co,this._width - co,0);
	ctx.fill();
}
_p._drawGrid = function(){
	var ctx = this._ctx;
	ctx.beginPath();
	//绘制垂直线
	for(var i = 0; i <= this._cols; i++){
		ctx.moveTo(i*this._cols + 0.5,0.5);
		ctx.lineTo(i*this._cols + 0.5,this._height + 0.5);
	}
	//绘制水平线
	for(var j = 0; j <= this._rows; j++){
		ctx.moveTo(0.5,j*this._cellSize + 0.5);
		ctx.moveTo(this._width + 0.5,j*this._cellSize + 0.5);
	}
	ctx.strokeStyle = "#ccc";
	ctx.stroke();
}
_p._drawToken = function(cellX,cellY){
	var ctx = this._ctx;
	var cellSize = this._cellSize;
	var tokenType = this._model.getPiece(cellX,cellY);
	
	if(!tokenType){
		return;
	}
	
	var colorCode = "black";
	switch(tokenType){
		case BoardModel.RED:
			colorCode = "red";
			break;
		case BoardModel.GREEN:
			colorCode = "green";
			break;
	}
	
	//标记圆心
	var x = this._x + (cellX + 0.5)*cellSize;
	var y = this._y + (cellY + 0.5)*cellSize;
	
	ctx.save();
	ctx.translate(x,y);
	
	//标记半径
	var radius = cellSize * 0.4;
	
	//渐变的中心
	var gradientX = cellSize * 0.1;
	var gradientY = -cellSize * 0.1;
	
	var gradient = ctx.createRadialGradient(
		gradientX,gradientY,cellSize * 0.1,
		gradientX,gradientY,radius * 1.2
	);
	
	gradient.addColorStop(0,"yellow");
	gradient.addColorStop(1,colorCode);
	ctx.fillStyle = gradient;
	
	ctx.beginPath();
	ctx.arc(0,0,radius,0,2*Math.PI,true);
	ctx.fill();
	ctx.restore();
}
_p._repaint = function(){
	this._ctx.save();
	this._ctx.translate(this._x,this._y);
	this._drawBackground();
	this._drawGrid();
	this._ctx.restore();
	
	for(var i = 0; i < this._cols; i++){
		for(var j = 0; j < this._rows; j++){
			this._drawToken(i,j);
		}
	}
}