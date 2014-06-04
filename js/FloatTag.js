/**/
(function (exports) {

var FloatTag = function(node,data){
    this.divData = data;
    node = this.node = $(node);
    this.expandBol = false;

    this.width = node.width();
    this.height = node.height();
   
    var floatTag = this.floatTag = $('<div class="floatTag" id="floatTag"></div>');
    var divDisplay = this.divDisplay = $('<div class="divDisplay" id="divDisplay"></div>');
    
    floatTag.append(divDisplay);
    node.append(floatTag);
}

FloatTag.prototype.setCss = function(){
    this.floatTag
    .css('position','absolute')
    .css({
        width:this.displayWidth+"px",
        height:this.displayHeight+"px",
        top:this.displayTop+"px",
        left:this.displayLeft+"px"
    });

    this.divDisplay
    .css('position','absolute')
    .css('top',0 +'px').css('left',0 +'px')
    .css('width','100%').css('height','100%')
};

FloatTag.prototype.determinSize = function(){
    var imgW = this.img.width||200;
    var imgH = this.img.height||200;
    if(this.expandBol){
      var width = this.width;
      var height = this.height;      
    } else{
        var width = 100;
        var height = 100;
    }

    var offset = 0;

    if(imgH&&imgW){
        if(imgW>=imgH*width/height){
            this.displayWidth = width-2*offset;
            this.displayHeight = parseInt(width * imgH/imgW,10)-2*offset;
            this.displayTop = (height - this.displayHeight)/2+offset;
            this.displayLeft = 0+offset;
        }else{
            this.displayHeight = height-2*offset;
            this.displayWidth = parseInt(height * imgW/imgH,10)-2*offset;
            this.displayTop = 0+offset;
            this.displayLeft = (width - this.displayWidth)/2+offset;
        }
    }
}

FloatTag.prototype.setExpand = function(){
    this.expandBol = true;

    this.determinSize();

    this.floatTag.removeClass('display-show').addClass('display-duration');
    // this.title();

    this.setCss();
    this.updateCanvas();
}


FloatTag.prototype.setNormal = function(){
    this.expandBol = false;

    this.determinSize();

    this.setCss();
    this.updateCanvas();
}

FloatTag.prototype.updateCanvas = function(){
    this.divDisplay.find('canvas').remove();
    this.floatTag.find('canvas').remove();
    var width = this.displayWidth;
    var height = this.displayHeight;

    var canvasDisplay = createCanvas(width,height);
    // console.log(canvasDisplay.resize)////////////resize!!!!!!!!!
    $(canvasDisplay).css('position','absolute').css('zIndex',210).css({top:'0%',left:'0%',width:'100%',height:'100%'});
    var ctxDisplay = this.ctxDisplay = canvasDisplay[0].getContext('2d');   
    this.divDisplay.append(canvasDisplay); 

    var canvas = this.canvas = createCanvas(width,height);
    var ctx = this.ctx = canvas[0].getContext('2d');
    canvas.css('position','absolute').css('zIndex',310);

    this.floatTag.append($(canvas));
    this.ctxDisplay.drawImage(this.img,0,0,width,height);
}

function createCanvas (width,height){
   var canvas = $('<canvas></canvas>');
    canvas[0].width = width;
    canvas[0].height = height;
    return canvas;
}

FloatTag.prototype.drawLines = function(){
   // new Draw.CanvasDraws(this.divData, this.canvas);
}

FloatTag.prototype.loop = function(x,y){
    var height = this.floatTag.height();
    this.x = x;
    this.y = y - height;
    if(!this.expandBol){
    this.floatTag.css({
      'left': this.x + 'px',
      'top': this.y + 'px',
    });        
}else{
}
}

FloatTag.prototype.clear = function(){
    this.ctx.clearRect(0,0,this.width,this.height);
    this.ctxDisplay.clearRect(0,0,this.width,this.height);
    this.img = null;
    this.info = '';
}

FloatTag.prototype.broadCastImg = function(img, time, info){
    this.imgW = img.width;
    this.imgH = img.height;
    this.img = img;
    this.info = info;


    var self = this;
    this.floatTag.removeClass('display-hide').addClass('display-show');
    this.setNormal();
    setTimeout(self.setExpand.bind(this),time*0.25);
    setTimeout(function(){self.floatTag.removeClass('display-duration').addClass('display-hide');},time*0.75);
    setTimeout(function(){self.clear();},time)
    // setTimeout(function(){self.expandBol=false;},3200);
}

FloatTag.prototype.broadCastVideo = function(vedio){
    
}

exports.FloatTag = FloatTag;
})(window);