window.articleText = '作为一个爱旅行的码农，俺长着一颗漂泊的心和大腿，但我和同样喜欢旅行的她站在民政局的台子边，我想起我们还没有一起去过很多地方。所以俺写了这个网站，并且召集了世界各处的各路难兄难弟靠谱基友驴友狐朋狗友，在地球上的某个角落，举一块“余晓瑞嫁给周宁奕”的牌子。这其中，确实冒出了很多非常感动的片段，比如在委瑞内拉，数不相识Katrin Klingenberg同学拿着一块木牌子在各地拍了十几张照片，又比如在太行山大美女杨思同学在大家要启程回家赶路的时候还认真导演了惊艳的小剧本，又比如在尼泊尔珠穆朗玛峰南坡登山abc营地，登山家罗静在昨天还是大雪崩山难的地方前拍下照片，最后很兴奋的是，在一次开会的间隙，成功地拦截了大老板jack马，啊哈哈哈哈！！！.....感谢照片拍与被拍的:马云、飞鸟、杨思、登山家罗静、june、Katrin Klingenberg、格布、三刀、襄爷、鱼姐、刘博、黄如燕、彭心怡、候总、小欣、狒狒、王越、浩浩等'
window.titleText = '这个星球上的祝福 - the world wishes';
////////提示图层
!(function(root) {
  var Controller = function(delay, startFunc) {
    this.delay = delay; //延迟几分钟开始
    this.startFunc = startFunc;
    this.clicks();
    this.time();
    this.text(window.articleText);
    this.title(window.titleText);
    this.show();
  };

  Controller.prototype.start = function() {
    //场景开始后，面板开始有交互
    this.hover();
    this.hide();
    this.startFunc();
  }

  Controller.prototype.clicks = function() {
    var self = this;
    //开始按钮
    $('#start').click(
      function() {
        self.clickBol = true;
        self.start();
        self.hide();
      }
    );
  }

  Controller.prototype.hover = function() {
    var self = this;
    $('#controller').hover(
      function() {
        self.show();
      },
      function() {
        self.hide();
      }
    );
  }

  Controller.prototype.time = function(title) { //进去一个状态，过一段时间发生变化
    var self = this;
    var delay = 12000;

    setTimeout(
      function() {
        if (!self.clickBol) {
          $('#background').css('background', 'rgb(0,180,180)')
        }
      }, (delay - 2000)
    );

    setTimeout(function() {
      if (!self.clickBol) {
        self.hide;
        self.start();
      }
    }, delay);
  }

  Controller.prototype.text = function(text) {
    $('#article')
    .text(text)
    .attr("href", "http://www.52zhongtou.com/ProjectView/Detail/pid/560") 
    .css('cursor','pointer')
  }
  
  Controller.prototype.title = function(title) {
    var len = title.length;
    for(var k = 0; k < len;k++){
      var str = title[k];
      var h = 200 + 160*k/len;
      // var color = Color({hue:h, saturation:1, value:0.9}).toString();
      var color = 'rgb(0,200,200)';
      var span = $('<div></div>')
      .css('color',color)
      .css('fontWeight','bold')
      .css('float','left')
      .css('fontSize','30px')
      .css('textShadow', 'rgba(255, 255, 255, 1) 1px 1px 1px')
      .text(str);
      $('#articleTitle').append(span);
    }
  }


  Controller.prototype.hide = function() {
    $('#controller').css('top', '-82%').css('opacity', 0.3);
    // $('#webgl').removeClass('blur');
    // $('#divDisplay').removeClass('blur');
  }
  Controller.prototype.show = function() {
    $('#controller').css('top', '0%').css('opacity', 0.7)
    // $('#webgl').addClass('blur');
    // $('#divDisplay').addClass('blur');
  }


  Controller.prototype.bg = function(color) {
    $('#background').css('background', '#111');
    setTimeout(function() {
      $('#background').css('background', color);
    }, 1000);
  }

  Controller.prototype.all = function(dataObj) {
    //设置标题
    var title = dataObj.title;
    this.title(title);

    //设置kpi指标
    var kpiArrs = dataObj.kpis;
    for (var k = 0; k < kpiArrs.length; k++) {
      var kpiArr = kpiArrs[k];
      this.kpi(kpiArr, k);
    }
  }

  function clearDiv(div) { ///////////////////
    $(div).find('div').remove();
  }

  root.Controller = Controller;
})(window);