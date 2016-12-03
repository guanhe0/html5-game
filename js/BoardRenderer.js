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
