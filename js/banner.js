(function(root) {
  var Color = net.brehaut.Color;

  function generateBackground(node) {

    var colorOut = 'rgba(0,50,50,0.3)';
    var colorIn = 'rgba(20,120,150,0.3)';

    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      gradient;

    var width = canvas.width = node.width();
    var height = canvas.height = node.height();

    gradient = context.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(1, colorOut);
    gradient.addColorStop(0, colorIn);

    return gradient
  }

  function generateSprite(colorOut, colorIn) {
    if (!colorOut) {
      var colorOut = 'rgba(0,55,55,0)';
    }
    if (!colorIn) {
      var colorIn = 'rgba(255,255,255,0.5)';
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


  var colorFuncs = {};
  colorFuncs.colorPure = function() {}

  ///////////////////////////////////////////////////////////////////////// 
  //////////////////////////////////shape//////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  var shapeFuncs = {};

  shapeFuncs.funcX0 = function() { ////文字
    var originX = this.originX;
    var mx = this.mx;
    var index = this.index;
    var t = this.t/40;
    var r = 2 * Math.cos(mx);
    this.xTarget = (originX + r * Math.cos(t * index + mx/4));
  }

  shapeFuncs.funcY0 = function() {
    var originY = this.originY;
    var my = this.my;
    var index = this.index;
    var t = this.t/40;
    var r = 3 * Math.cos(my);
    this.yTarget = (originY + r * Math.cos(t * index + my/4));

    //临时
    this.size = Math.abs(Math.cos(index) * 5) + 1;
  }
  shapeFuncs.funcY1 = function() { ///三角函数
    var index = this.index;
    var mx = this.mx;
    var my = this.my;
    var h = this.h
    var value1 = Math.sin(index * mx * 0.03);
    var value2 = 0.5 * Math.cos(index * my * 0.11);
    var value3 = 0.25 * Math.cos(index * my * 0.15);
    this.yTarget = h * ((value1 + value2 + value3) / 10 + 0.5);
  }

  shapeFuncs.funcX1 = function() {
    var index = this.index;
    var w = this.w;
    var indexN = this.indexN;
    this.xTarget = index / indexN * w

    //临时
    this.size = Math.abs(Math.cos(index) * 2) + 1;
  }


  shapeFuncs.funcY2 = function() { ///////星空
    var index = this.index;
    var indexN = this.indexN;
    var size = this.size;
    var mx = this.mx;
    var my = this.my;
    var h = this.h
    var centerY = this.centerY;
    var t = this.t;

    var rH = h * Math.sin(size) / 2*0.8;

    var phi = my * index / indexN * 1 * size - index + mx * 2;
    this.yTarget = centerY + rH * Math.sin(phi);
  }

  shapeFuncs.funcX2 = function() {
    var index = this.index;
    var size = this.size;
    var indexN = this.indexN;
    var w = this.w;
    var my = this.my;
    var centerX = this.centerX;
    var t = this.t;

    var rW = w * Math.sin(size) / 4;
    var phi = my * index / indexN * 1 * size - index;
    this.xTarget = centerX + rW * Math.cos(phi);
    //临时
    this.size = Math.abs(Math.cos(index) * 4) + 1;
  }


  var Shape = function(canvas, img, index, indexN, fontIndexes, t) {
    this.index = index;
    this.indexN = indexN;
    this.canvas = canvas;
    this.fontIndexes = fontIndexes;
    this.context = canvas.getContext("2d");
    this.img = img;
    this.w = canvas.width;
    this.h = canvas.height;
    this.t = 0;
    this.typeIndex = 1;

    this.centerX = this.w * 0.6;
    this.centerY = this.h / 2;

    var pt = fontIndexes[index];
    this.originX = pt[0];
    this.originY = pt[1];

    this.initVal();
    this.initFunc();
    this.initShape();
  }

  Shape.prototype.initVal = function() {
    var index = this.index;
    this.size =Math.abs(Math.cos(index))* 4 + 1;

    this.vPosition = this.size * 0.08;

    this.x = 0;
    this.y = 0;
    this.xTarget = 0;
    this.yTarget = 0;
    this.mx = 0.4;
    this.my = 0.7;
  }

  Shape.prototype.initFunc = function() { //选择映射函数
    var typeIndex = this.typeIndex;
    this.yFunc = shapeFuncs["funcY" + typeIndex];
    this.xFunc = shapeFuncs["funcX" + typeIndex];
  }

  Shape.prototype.change = function(typeIndex) {
    this.typeIndex = typeIndex;
    this.initFunc();
  }

  Shape.prototype.initShape = function() {}

  Shape.prototype.updateVal = function() {

    var vPosition = this.vPosition;

    this.x += (this.xTarget - this.x) * vPosition;
    this.y += (this.yTarget - this.y) * vPosition;
    // this.H += (this.HTarget - this.H) * 0.1;
  };

  /////////////////////shape之内的更新///////////////////
  Shape.prototype.updateColor = function() { //colorFuncs.pure;
    // var H = this.H;
    // this.fillColor = new Color({
    //   hue: H + this.index * 30,
    //   saturation: 0.9, //0.5
    //   value: 1
    // })
    //   .setAlpha(0.3);
  }

  Shape.prototype.updatePosition = function() {
    var index = this.index;
    var indexN = this.indexN;
    var w = this.w;
    var h = this.h;
    var mx = this.mx; //类似mouseX的一个量，0-1标准化
    var my = this.my;
    this.xFunc();
    this.yFunc();
  }

  Shape.prototype.updateShape = function() {
    var fillColor = this.fillColor;
    var shape = this.shape;
    var size = this.size;
    var index = this.index;
    var indexN = this.indexN;
    var w = this.w;
    var h = this.h;
    var centerX = this.centerX;
    var centerY = this.centerY;

    this.updateColor();
    this.updatePosition();
    this.context.drawImage(this.img, this.x, this.y, size, size);

    if (this.typeIndex === 2) {
      if (index === parseInt(indexN / 2)) {
        this.context.drawImage(imgEarth, centerX - 10, centerY - 10, 20, 20);
      }
    }
  }
  /////////////////////shape之内的更新///////////////////
  Shape.prototype.update = function(mx, my, t) {
    this.mx = mx;
    this.my = my;
    this.t = t;

    this.updateVal();
    this.updateShape();
  }


  ////////////////////////////////////////////////////////
  ////////////////////////universe////////////////////////
  ////////////////////////////////////////////////////////
  var self;
  var Universe = function(node) {
    self = this;

    var node = $(node);
    this.node = node;
    this.width = node.width();
    this.height = node.height();
    this.mx = 0; //鼠标的xy坐标占container的比例
    this.my = 0;
    this.px = 0;
    this.py = 0;
    this.t = 0;

    this.load();
  }

  var imgEarth;

  Universe.prototype.load = function() {
    var self = this;
    var node = this.node;
    imgEarth = new Image();
    imgEarth.src = "image/earth.png"
    imgComputer = new Image();
    imgComputer.src = "image/banner.png"
    imgCity = new Image();
    imgCity.style.width = '800px';
    imgCity.style.height = '600px'
    imgCity.src = "image/city.svg"
    imgEarth.onload = function() {
      imgComputer.onload = function() {
        imgCity.onload = function() {
        self.imgEarth = imgEarth;
        self.imgComputer = imgComputer;
        self.imgCity = imgCity;
        self.typeIndex = 0;
        self.speed = 0.0003; //默认的变化速度
        self.initCanvas();
        self.initDivs();

        var gradientBg = self.gradientBg = generateBackground(node);
        var context = self.context;

        self.generateFontPts();
        self.shapeN = self.fontIndexes.length - 1; //85
        var imgHead = self.imgHead = generateSprite();

        self.initShapes();
        self.event();
        self.render();
      }
    }
    }
  }

  Universe.prototype.event = function() {
    this.node
      .mousemove(self.onMouseMove)
      .mouseover(self.onMouseOver);
  }

  Universe.prototype.initCanvas = function() {
    var canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    this.node.append(canvas);
    this.canvas = canvas;
    this.context = canvas.getContext('2d')
  }

  Universe.prototype.initDiv = function(name, fontSize1, value) {
    var fontSize = parseInt(fontSize1);
    var color = 'rgb(220,250,250)'
    var div = $('<div></div>')
      .css({
        fontFamily: "Microsoft YaHei",
        top: '0px',
        left: '0px',
        color: color,
        position: 'absolute',
        fontSize: fontSize,
        textShadow: "1px 2px 1px #000 ",
        opacity: value,
        '-webkit-transition': 'all 0.2s ease-in-out'
      }).text("");
    this.node.append(div);
    this[name] = div;
  }

  Universe.prototype.initDivs = function() {
    var height = this.height;
    this.initDiv('divTitle', height * 0.4, 0.1);
    this.initDiv('divViceTitle', 18, 1);
  }

  Universe.prototype.generateFontPts = function() {
    var canvas = document.createElement('canvas');
    var context1 = canvas.getContext('2d');

    var imgComputer = this.imgComputer;

    var width = canvas.width = self.width;
    var height = canvas.height = self.height;

    context1.fillStyle = "#000";
    context1.fillRect(0, 0, width, height);
    context1.fillStyle = "#fff"
    var fontSize = parseInt(height * 0.5);
    context1.font = fontSize + "px Mircosoft-Yahei";
    context1.fillText("观象台", parseInt(width / 3 - height * 0.75), height * 0.75);

    var data = context1.getImageData(0, 0, width, height)
    var data = data.data;
    var fontIndexes = []
    for (var k = 0; k < data.length; k += 56) {
      if (data[k] > 180) {
        var index = k / 4;
        var x = index % width;
        var y = parseInt(index / width);
        fontIndexes.push([x, y]);
      }
    }
    this.fontIndexes = fontIndexes;
  }

  Universe.prototype.initShapes = function() {
    var shapeN = this.shapeN;
    var shapes = this.shapes = [];
    var canvas = this.canvas;
    var imgHead = this.imgHead;
    var fontIndexes = this.fontIndexes;

    for (var i = 0; i < shapeN; i += 1) {
      var index = i
      var shape = new Shape(canvas, imgHead, index, shapeN, fontIndexes);
      shapes.push(shape);
    }
  }

  Universe.prototype.render = function() {
    self.loop();
  }

  Universe.prototype.loop = function() {
    var shapeN = self.shapeN;
    var shapes = self.shapes;
    var mx = self.mx;
    var my = self.my;
    var context = self.context;
    var height = self.height;
    var width = self.width;
    var speed = self.speed;

    self.mx = (self.mx + speed) % 1;
    self.my = (self.my + speed) % 1;

    self.t += 0.0005;
    var t = self.t;

    var fontIndexes = self.fontIndexes;
    var fontPtN = fontIndexes.length;

    var gradientBg = self.gradientBg;
    for (var i = 0; i < shapeN; i++) {
      var shape = shapes[i];
      shape.update(mx, my, t);
    }

    context.fillStyle = gradientBg; //"rgba(0,0,0,1)" 
    context.fillRect(0, 0, width, height);
    self.drawImages.bind(self)();
    window.requestAnimationFrame(self.loop)
    // setTimeout(, 20);
  }
  Universe.prototype.changeShapes = function() {
    for (var i = 0; i < self.shapeN; i++) {
      var shape = self.shapes[i];
      shape.change(self.typeIndex);
    }
  }

  Universe.prototype.drawImages = function() {
    var image;
    var height = self.height;
    var width = self.width;
    var context = self.context;
    var font = context.font;
    if (self.typeIndex === 0) { //观象台 文字
      var h = parseInt(width / 3 - height * 0.75);
      self.divViceTitle
        .text(' 5 0 0 + 大 企 业 ， 1 3 0 0 万 + 中 小 企 业')
        .css({
          left: h + "px",
          top: parseInt(height * 0.85) + "px"
        });

      self.divTitle
        .text('')
        .css({
          left: h + "px",
          top: parseInt(height * 0.1) + "px"
        });
        context.drawImage(self.imgCity, 0, 0, width *1, height * 1.0);
    }

    if (self.typeIndex === 1) { //波动函数
      var h = parseInt(width / 3 - height * 0.6);
      self.divViceTitle
        .text(' 海 量 数 据 挖 掘 可 视 技 术')
        .css({
          left: h + "px",
          top: parseInt(height * 0.8) + "px"
        });

      self.divTitle
        .text('精准')
        .css({
          left: h + "px",
          top: parseInt(height * 0.3) + "px"
        });

      context.drawImage(self.imgComputer, width * 0.5, -height / 4, height * 1.2, height * 1.3);
    }
    if (self.typeIndex === 2) { //地球旋转
      var h = parseInt(width / 3 - height * 0.75);
      var tVice =
        self.divViceTitle
        .text(' 私 有 数 据 和 阿 里 数 据 融 合 , ' + ' 绘 制 数 据 全 貌')
        .css({
          left: h + "px",
          top: parseInt(height * 0.6) + "px"
        });

      self.divTitle
        .text('全景')
        .css({
          left: h + "px",
          top: parseInt(height * 0.1) + "px"
        });
    }
    // if(self.)
  }

  Universe.prototype.onMouseMove = function(ev) {
    //HTarget = 360 * ev.pageX / w
    // lightness=ev.pageY / h
    // lightness=0.5+lightness/2
    var width = self.width;
    var height = self.height;
    var mx = ev.pageX / width;
    var my = ev.pageY / height;
    var delta = 0.04; //阈值 当速度超过一定程度的时候运行
    if (Math.abs(self.px - mx) + Math.abs(self.py - my) > delta) {
      self.mx = mx;
      self.my = my;
    }
    self.px = mx;
    self.py = my;
  }



  Universe.prototype.changeType = function() {
    self.typeIndex = (self.typeIndex + 1) % 3;
    self.changeShapes();
  }
  Universe.prototype.onMouseOver = Universe.prototype.changeType;
  root.Universe = Universe;
  root.Shape = Shape;

})(window)