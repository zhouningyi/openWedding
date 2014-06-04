/*global THREE*/
// window.Three = {};
(function(exports) {
    var scene;
    var GlobeScenes = function(nameArr, nameObj,delay) {
        this.nameObj = nameObj;
        this.nameArr = nameArr;
        this.ep = new EventProxy();
        this.index = 0;
        this.N = nameArr.length;

        this.init();
    };

    GlobeScenes.prototype.start = function () {
        setTimeout(this.next.bind(this),0);
        this.ep.on('next', this.next.bind(this));
    }

    GlobeScenes.prototype.init = function() {
        window.floatTag = new FloatTag(add, divData);
        var globe = this.globe = new Globe(); //世界国家加载
        var bgColor = '#fff';
        var bg = this.bg = new GeoTexture().canvasBg
        globe.initTextureMap(bg);
    };

    GlobeScenes.prototype.next = function() {
        // this.globeScence.clear();
        if(this.index<this.N){
        this.scene(this.index);
        this.index = this.index + 1;            
        }else{
         window.globalEP.emit('globalEnd')
        }
    };

    GlobeScenes.prototype.scene = function(index) {
        this.index = index;
        // if(index == 0){this.globe.clear();}

        var name = this.nameArr[this.index];
        var urlObj = this.nameObj[name];
        var urlJson = urlObj.urlJson;
        var urls = urlObj.urls;

        var h = this.h = (180 + 360*index/this.N)%360

        var self = this;
        this.globeScence = new GlobeScene(urlJson, urls, self);//

        var color =  Color({hue:h,saturation:0.7,value:0.2}).toString();
        window.controller.bg(color);//背景变色
        window.slider.select(index,h);//slider变色
    };

    GlobeScenes.prototype.loop = function() {
        var globe = this.globe;
        window.requestAnimationFrame(loop);
        globe.sphereTexture.needsUpdate = true;
        globe.loop();
        var pixel = globe.curCenter2D;
        floatTag.loop(pixel.x, pixel.y)
    };

    ///====================GlobeScene=========================///
    var GlobeScene = function(urlJson, urls, THIS) { //每个国家的播放、绘制过程
        
        this.urlJson = urlJson;
        this.urls = urls
        this.EP = THIS.ep;
        this.globe=THIS.globe;
        this.bg = THIS.bg;
        this.h = THIS.h;

        this.BroadCastDelay = 5400;
        var sceneDelay = this.sceneDelay = 200;

        this.ep = new EventProxy();
        this.index = 0;
        var N = this.N = urls.length;
        if(N){
        this.loadJson();
        // this.next();
        this.ep.on('next',this.next.bind(this));           
        }else{
            setTimeout(function(){this.EP.emit('next');}.bind(this),sceneDelay);
        //播放完了就往前一个场景
      }
    };

    GlobeScene.prototype.loadJson = function() { //绘制地图上国家的路径
        var self = this;

        var index = this.index;
        var urlJson = this.urlJson;
        var bg = this.bg;
        function callback(){
           floatTag.drawLines();
           self.ep.emit('next');
        }
        function success(data) {
            var info = data.info;

            var curvesData = data.curvesData;
            var H = self.h;
            var options = {
                H: H,
                type: "light"
            };

            var lnglat = info.center;
            self.region = info.areaName;
            self.globe.viewAt(lnglat);
            window.text.hide();

            self.canvasDraws = new Draw.CanvasDraws(curvesData, bg, callback, options);
        }

        $.ajax({
            url: urlJson,
            dataType: 'json',
            success: success,
            fail: function(e) {console.log(e);}
        });
    }

    GlobeScene.prototype.next = function() {
        var sceneDelay = this.sceneDelay;
        
        if (this.index < this.N) {
            this.loadBroadCast();
            this.index += 1;
        } else {
            floatTag.clear();
            if(this.N>0){
               setTimeout(function(){this.EP.emit('next');}.bind(this),sceneDelay);//播放完了就往前一个场景 
            }
        }
    }

    GlobeScene.prototype.loadBroadCast = function(){
        var delay = this.BroadCastDelay;
        var self = this;

        var index = this.index;
        var urlObj = this.urls[this.index];
        var url = urlObj.url;
        var type = urlObj.type;
        var info = getInfo(url);
        info.region = this.region;
        var h = this.h;
        info.color =  Color({hue:h,saturation:0.8,value:0.8}).toString();

        window.text.text(info);

        var lnglat = this.lnglat = getLnglat(url);
        this.globe.viewAt(lnglat);
        this.globe.addCenter(lnglat,this.h) //增加地理上的mark

        var lnglat = getLnglat(url);


        if(type ==='image'){
            var img = new Image();
            img.src = url;
            img.onload = function() {

                setTimeout(function(){self.globe.zoomIn();},1600);
                setTimeout(function(){
                    self.globe.zoomOut();
                    var lat = -self.lnglat.lat;
                    var lng = self.lnglat.lng+360;
                    self.globe.viewAt({lng:lng,lat:lat});
                },delay-1100);

                floatTag.broadCastImg(img,delay,info);
                setTimeout(function(){this.ep.emit('next');}.bind(this),delay);
            }.bind(this);
        }else if(type ==='video'){
            
        }else{
            this.ep.emit('next');
        }
    }

    function getInfo(url){
        var strs = url.split('/');
        var infos = strs[strs.length-1];
        var info = infos.split('.')[0];
        info = info.split('|');
        info = {name:info[0],area:info[1],'helper':info[2]}
        return info;
    }

    function getLnglat(url){
        var strs = url.split('/');
        var infos = strs[strs.length-3];

        var lng = parseFloat(infos.split('|')[1]);
        var lat = parseFloat(infos.split('|')[2]);

        return {lng:lng,lat:lat};
    }

    GlobeScene.prototype.loop = function() {

    };

    GlobeScene.prototype.clear = function() {

    };

    exports.GlobeScenes = GlobeScenes;

})(window);