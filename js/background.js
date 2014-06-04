(function(root) {
	var Color = net.brehaut.Color;

	////////////////////////////////////////////////////////
	////////////////////////universe////////////////////////
	////////////////////////////////////////////////////////
	var self;
	var Background = function(node) {
		self = this;

		var node = $(node);
		this.node = node;
		this.width = node.width();
		this.height = node.height();

		// this.load();
		this.initCanvas();
		this.generateBg('rgba(255,255,255,0)','rgba(255,255,255,1)',0.9);
		this.generateBg('rgba(255,255,255,0)','rgba(255,255,255,1)',0.8);
	}

	var imgEarth;
	Background.prototype.load = function() {
		var self = this;
		var node = this.node;
		imgBanner = new Image();
		imgBanner.src = "image/banner.png"
		imgBanner.onload = function() {
		}
	}

	Background.prototype.filter = function() {
	}

	Background.prototype.initCanvas = function() {
		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;

		this.node.append(canvas);
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
	}

	Background.prototype.render = function(){
		this.context.drawImage(this.imgBanner,0,0,this.width,this.height);
		this.filter();
	}

	Background.prototype.generateBg = function(colorOut, colorIn, r) {
    if (!colorOut) {
      var colorOut = 'rgba(255,255,255,0)';
    }
    if (!colorIn) {
      var colorIn = 'rgba(255,255,255,1)';
    }

    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      gradient;

    canvas.width = canvas.height = this.height;

    gradient = context.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );

    gradient.addColorStop(r, colorOut);
    gradient.addColorStop(0.0, colorIn);

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    this.sprite = canvas;
    var left = (this.width - this.height)/2;
    var top = 0;

    this.context.drawImage(canvas,left,top,this.height,this.height)
  }


	root.Background = Background;
})(window)