
 ////////提示图层
!(function(root) {
  var Slider = function(container,worldobj) {
    this.container = $(container);

    this.defaults = {};
    this.defaults.h = 180;

    this.grids = [];
    this.div();
    this.divs(worldobj);
    this.clicks();
  };
  Slider.prototype.setEP = function(ep){
    this.ep = ep;
  }
  
  Slider.prototype.divs = function(worldobj){
    var slider = this.slider;

    var lengthList =[];
    var picN = 0;
    for(var name in worldobj){
      var urls = worldobj[name].urls;
      var len = urls.length;
      lengthList.push({name:name,len:len})
      picN+=len;
    }

    for(var k in lengthList){
      var obj = lengthList[k];
      var name = (obj.name)
      name = name.substring(1,name.length-1)
      var len = obj.len;

      var percent = parseInt(len/picN*100);    

      var grayValue = 100+percent*2+50
      var gray = "rgb("+grayValue+","+grayValue+","+grayValue+")";

      var span = $('<div></div>')
      .css('position','absolute')
      .css('top','150%')
      .css('width','100%')
      .css('textAlign','center')
      .css('color',gray)
      .css('opacity',0)
      .text(name);

      var grid = $('<div></div>')
      .css('position','relative')
      .css('width',percent+'%')
      .css('float','left')
      .css('height','3px')
      .css('background',gray)
      .css('opacity',0.6)
      grid.span = span;
      grid.gray = gray;
      grid[0].index = k;
      
      grid.append(span);
      this.grids.push(grid);
      this.slider.append(grid);
    }
  }

  Slider.prototype.hide = function(){
    this.slider.css('opacity',0);
  }

  Slider.prototype.div = function(){
    var slider = this.slider = 
    $('<div></div>')
    .css('position','absolute')
    .css('top','95%')
    .css('height','3px')
    .css('left','10%')
    .css('width','80%')

    this.container.append(slider);
  }

   Slider.prototype.clicks = function() {
    var grids = this.grids;
    var self = this;
    for(var k in grids){
      var grid = grids[k];
      grid.click(function(){
        var index = this.index;
        self.ep.emit('click');
      })
    }
   }

    Slider.prototype.select = function(index,h) {
      this.cancelAll();

      h=h||180;
      var grid = this.grids[index];
      var bgColor = Color({hue:h,saturation:0.7,value:0.6}).toString();
      bgColor = '#fff'
      var span = grid.span;

      grid
      .css('-webkit-filter','drop-shadow(0px 0px 35px rgba(255, 255, 255, 1))')
      .css('background',bgColor)
      .css('opacity',1)

      span.css('color',bgColor)
      .css('opacity',1)
   }

   Slider.prototype.cancelAll = function() {
    var grids = this.grids;

    for(var k in grids){
      var grid = grids[k];
      grid.css('background',grid.gray)
      .css('-webkit-filter','drop-shadow(0px 0px 5px rgba(255, 255, 255, 0))')
      .css('opacity',0.6)
      ;

      grid.span.css('opacity',0);
    }
   }
 
  root.Slider = Slider;
})(window);