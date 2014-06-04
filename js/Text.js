
 ////////提示图层
!(function(root) {
  var Text = function(container) {
    this.container = $(container);

    this.defaults = {};
    this.div();
    this.divs();
  };


  Text.prototype.text = function(obj){
    var name = obj.name||'';
    var region = obj.region||'';
    var helper = obj.helper;
    var area = obj.area||'';
    var color = obj.color||'';

    this.textDiv.css('opacity',1);

    this.regionDiv.text(region);
    this.nameDiv.text(name);
    this.areaDiv.text(area);
    this.helperDiv.text(helper);

    if(helper){
      this.helperDiv
      .css('background','rgba(0,0,0,0.2)')
      .text(helper+'供稿');
    }else{
      this.helperDiv
      .css('background','rgba(0,0,0,0)')
      .text('');
      ;
    }
  }
  
  Text.prototype.divs = function(){
    this.createDiv('regionDiv',180,80,0.8);
    this.createDiv('areaDiv',90,30,0.5);
    this.createDiv('nameDiv',90,30,0.3);
    this.createDiv('helperDiv',90,30,0.2);
  }

  Text.prototype.hide = function(){
  this.textDiv.css('opacity',0);
  }

  Text.prototype.createDiv = function(name, height, fontSize, alpha){
    var div = this[name]=
    $('<div></div>')
    .css('position','relative')
    .css('height',height+'px')
    .css('width','100%')
    .css('color','rgba(255,255,255,1)')
    .css('fontSize',fontSize+'px')
    .css('textAlign','center')
    .css('verticalAlign','middle')
    .css('background','rgba(0,0,0,'+alpha+')')
    .css('lineHeight',height+'px')

    this.textDiv.append(div);
  }

  Text.prototype.div = function(){
    var textDiv = this.textDiv = 
    $('<div></div>')
    .css( '-webkit-transition','all 1.0s ease-in-out')
    .css('position','absolute')
    .css('top','25%')
    .css('left','5%')
    .css('height','70%')
    .css('width','20%')
    .css('zIndex','100000')
    .css('opacity',0)
    // .css('background','rgba(255,2,22,0.1)');

    this.container.append(textDiv);
  }

   Text.prototype.clicks = function() {
   }

    Text.prototype.select = function(index,h) {
   }

   Text.prototype.cancelAll = function() {
   }
 
  root.Text = Text;
})(window);