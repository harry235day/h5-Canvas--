window.onload = function(){

	var drawing = document.getElementById('canvas');
	var p = document.getElementById('p');
	if(drawing.getContext){
		var cxt = drawing.getContext('2d');
		// 设置canvas的大小
		var W = drawing.width = 400;
		var H = drawing.height = 400;
		//半径
		var R = W / 2;
		//线宽
		var cw = cxt.lineWith = 0.1 * R;

		//静态时钟
		function drawStatics(){
			//绘制外边框
			//保存当前环境			
			cxt.save();
			// 重新映射画布上的 (0,0) 位置
			cxt.translate(R,R);
			//起始一条路径，或重置当前路径
			cxt.beginPath();
			//设置当前线条的宽度
			cxt.lineWith = 0.1*R;
			//画圆 context.arc(x,y,r,sAngle,eAngle,counterclockwise);
			// x	圆的中心的 x 坐标。
			// y	圆的中心的 y 坐标。
			// r	圆的半径。
			// sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
			// eAngle	结束角，以弧度计。
			// counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
			//math.pi 圆周率
			cxt.arc(0,0,R-cw/2,0,2*Math.PI,false);
			// fill或者stroke在画布上绘制实际的弧。
			cxt.stroke(); 
			//绘制内层数字
			cxt.beginPath();
			cxt.font = 0.2 * R + 'px 宋体';
			cxt.textAlign = 'center';
			// 设置或返回在绘制文本时使用的当前文本基线
			cxt.textBaseline = 'middle';
			//设置半径
			var r1 = 0.8 * R - cw/2;
			for(var i=12;i>0;i--){
				//从1.5math.pi 开始绘制
				var radius = 2*Math.PI/12 *i+1.5*Math.PI;
				var x = Math.cos(radius)*r1;	
				var y = Math.sin(radius)*r1;
					// 在画布上绘制“被填充的”文本
					//text	规定在画布上输出的文本。
					// x	开始绘制文本的 x 坐标位置（相对于画布）。
					// y	开始绘制文本的 y 坐标位置（相对于画布）。
					// maxWidth	可选。允许的最大文本宽度，以像素计。
					cxt.fillText(i,x,y);	
				}
			//绘制内层原点
			cxt.beginPath();
			var r2 = 0.9*R - cw/2;
			for (var i = 0; i<60; i++) {
				var radius = 2 *Math.PI/60*i +1.5 * Math.PI;
				var x = Math.cos(radius)*r2;
				var y = Math.sin(radius)*r2;
				cxt.beginPath();
				if(i%5===0){
					cxt.arc(x,y,cw/5,0,2*Math.PI,false);
				}else{
					cxt.arc(x,y,cw/8,0,2*Math.PI,false);
				}
				cxt.fill();
			}
			cxt.closePath();	
			// 返回之前保存过的路径状态和属性
			cxt.restore();
		}

		//绘制中心纽扣
		function drawDot(){
			cxt.save();
			cxt.translate(R,R);
			cxt.beginPath();
			cxt.arc(0,0,cw/3,0,2*Math.PI,false);
			cxt.fillStyle = '#000';
			cxt.fill();
			cxt.restore();
			cxt.closePath();
		}
		
		//绘制秒
		function drawSecond(second){
			cxt.save();
			cxt.translate(R,R);
			cxt.beginPath();
			var radius = 2*Math.PI/60*second;
			// 旋转当前绘图
			cxt.rotate(radius);
			cxt.lineWith = 2;
			cxt.moveTo(0,cw*2);
			cxt.lineTo(0,-0.8*R);
			cxt.strokeStyle ='red';
			cxt.stroke();
			cxt.restore();

		}
		//绘制分钟
		function drawMinute(minute,second){
			cxt.save();
			cxt.translate(R,R);
			cxt.beginPath();
			var radius = 2*Math.PI/60*minute;
			var sRadius = 2*Math.PI/60/60*second;
			cxt.rotate(radius+sRadius);
			cxt.lineWith =4;
			// 设置或返回线条的结束端点样式
			cxt.lineCap ='round';
			cxt.moveTo(0,cw);
			cxt.lineTo(0,-(0.8*R-cw/2));
			cxt.stroke();
			cxt.restore();
		}

		//绘制小时
		function drawHour(hour,minute){
			cxt.save();
			cxt.translate(R,R);
			cxt.beginPath();
			var radius = 2*Math.PI/12*hour;
			var mRadius = 2*Math.PI/12/60*minute;
			cxt.rotate(radius+mRadius);
			cxt.lineWith =6;
			cxt.lineCap ='round';
			cxt.moveTo(0,cw/2);
			cxt.lineTo(0,-(0.8*R-cw*2));
			cxt.stroke();
			cxt.restore();
		}

		//时间格式化
		Date.prototype.Format = function (fmt) { //author: meizz
			var o = {
			    "M+": this.getMonth() + 1, //月份
			    "d+": this.getDate(), //日
			    "h+": this.getHours(), //小时
			    "m+": this.getMinutes(), //分
			    "s+": this.getSeconds(), //秒
			    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
			    "S": this.getMilliseconds() //毫秒
			};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
		}


function draw(){
	cxt.clearRect(0,0,W,H);
	drawStatics();
	var now = new Date();
	drawHour(now.getHours(),now.getMinutes());
	drawMinute(now.getMinutes(),now.getSeconds());
	drawSecond(now.getSeconds());
	drawDot();
	p.innerText = new Date().Format("yyyy-MM-dd hh:mm:ss") ;
}

draw();


		//开启定时
		setInterval(draw,500);
	}
}