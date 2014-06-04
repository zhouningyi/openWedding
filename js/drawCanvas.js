/**/
window.Draw = {};
(function (exports) {

    var segmentT = 15;
    var curveT = 200;

var CanvasDraw = function(data,canvas,ep,sprite,options){
    this.defaults = {};
    this.defaults.H = 200;
    this.defaults.type ="normal";
    this.setOptions(options);

    this.ep = ep;
    this.offsetX =0;
    this.canvas = canvas;
    this.len = data.length;
    this.data = data;
    this.index = 1;
    this.sprite = sprite;
    this.canvasDrawSegement();
}

CanvasDraw.prototype.setOptions = function (options) {
        return _.extend(this.defaults, options);
    };
CanvasDraw.prototype.canvasDrawSegement = function (){
    try{
        var index = this.index;
        var curveData = this.data[index].bezier;
        var p1x = curveData[0]*1.8;
        var p1y = curveData[1]*1.8;
        var p2x = curveData[2]*1.8;
        var p2y = curveData[3]*1.8;
        var p3x = curveData[4]*1.8;
        var p3y = curveData[5]*1.8;
        var p4x = curveData[6]*1.8;
        var p4y = curveData[7]*1.8;

        var ctx = this.canvas.getContext('2d');
        var sprite = this.sprite;
        var offset = 1;
        var H = this.defaults.H;
        // H = 180;
        
        // var color = Color({hue:180*this.index/100,saturation:0.6,lightness:0.5}).toString();
        // ctx.strokeStyle = "rgb("+gray+","+gray+","+gray+")";
        
        if(this.defaults.type === "light"){
        var r = (Math.abs(p1x-p4x)+Math.abs(p1y-p4y))*2;
        var cx = (p1x+p4x)/2;
        var cy = (p1y+p4y)/2;
        ctx.drawImage(sprite,cx-r/2,cy-r/2,r,r);
        }

        var lMax = 2;
        for(var l = lMax;l>=0;l--){
        var random = Math.random()*4;
        var lineWidth = parseInt(random*4+1);
        var kc = Math.pow(l/lMax,0.9);
        var kl = Math.pow(l/lMax,2);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = Color({hue:H+Math.cos(index/10)*10,saturation:0.7+kc*0.3,value:(0.9-kc*0.3)}).setAlpha(0.6).toString();
        // ctx.strokeStyle = Color({hue:0,saturation:0.0,value:0.3+kc*0.6}).toString();
        // ctx.strokeStyle = 'rgba(0,0,0,0.3)'
        ctx.beginPath();
        ctx.moveTo(p1x+offset*Math.random(),p1y+offset*Math.random());
        ctx.bezierCurveTo(p2x+offset*Math.random(),p2y+offset*Math.random(),p3x+offset*Math.random(),p3y+offset*Math.random(),p4x+offset*Math.random(),p4y+offset*Math.random());
        ctx.stroke();
        ctx.closePath();            
        }

    } catch (e) {
    }
    
    if (this.index < this.len) {
        setTimeout(this.canvasDrawSegement.bind(this), segmentT);
    }else{//绘制完一根线
        this.ep.emit('draw')
    }
    this.index++;
}

var CanvasDraws = function (data,canvas,callback,options){
    this.defaults = {};
    this.defaults.H = 180;
	var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(250,250,250,1)';
    this.setOptions(options);
    // ctx.fillRect(0,0,canvas.width,canvas.height);
    // ctx.globalCompositeOperation="lighter"

    var ep = new EventProxy();
    var sprite = generateSprite();
    var len = data.length
	for(var i = 0;i<len;i++){
		var obj = data[i];
        new CanvasDraw(obj, canvas, ep,sprite,options);
	}
    ep.after('draw',len,callback);
}
CanvasDraws.prototype.setOptions = function (options) {
        return _.extend(this.defaults, options);
    };

CanvasDraws.prototype.hue = function (h) {
    this.defaults.H = h;
}
function createCanvas(width,height,bgColor){
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    bgColor = bgColor||'#fff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    return canvas;
}

   function generateSprite(colorOut, colorIn) {
     if (!colorOut) {
       var colorOut = 'rgba(255,255,255,0)';
     }
     if (!colorIn) {
       var colorIn = 'rgba(255,255,255,0.1)';
     }

     var canvas = document.createElement('canvas'),
       context = canvas.getContext('2d'),
       gradient;

     canvas.width = 20;
     canvas.height = 20;

     gradient = context.createRadialGradient(
       canvas.width / 2, canvas.height / 2, 0,
       canvas.width / 2, canvas.height / 2, canvas.width / 2
     );

     gradient.addColorStop(1.0, colorOut);
     gradient.addColorStop(0.2, colorIn);
     gradient.addColorStop(0.0, colorIn);

     context.fillStyle = gradient;
     context.fillRect(0, 0, canvas.width, canvas.height);

     return canvas;
   }


exports.CanvasDraws = CanvasDraws;
exports.CanvasDraw = CanvasDraw;
exports.createCanvas = createCanvas;
})(window.Draw);