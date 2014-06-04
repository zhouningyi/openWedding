//地理数据加工处理中心，将geojson的数据源在3d环境中建模、绘图，
//提取对后续操作有用的数据，在export.country之中
window.Globe = {};
var imgSRC = 'image/';
//////////参数：
(function(exports) {

  var REarthSphere = 130;
  var self;

  var Globe = function(options) { //每导入一次地理数据调用下这个函数，initGeography会判断输入类型并对数据进行处理
    this.defaults = {};
    this.defaults.REarth = REarthSphere;

    this.setOptions(options);
    this.setSource();

    this.meshes = [];
    
    this.curCenterPt = new THREE.Vector3();
  };

  Globe.prototype.setOptions = function(options) {
    return _.extend(this.defaults, options);
  };

  Globe.prototype.setSource = function() {
    // this.data = window[this.defaults.geoName];
  }
  Globe.prototype.viewAt = function(obj) {
    var lat = obj.lat;
    var lng = obj.lng;

    var REarth =80;
    var theta = -(270 - lng) * Math.PI / 180;
    var phi = (lat) * Math.PI / 180;

    Interactions.target.x = theta;
    Interactions.target.y = phi;
  }


  Globe.prototype.initTextureMap = function(canvas) {
    var conf = this.defaults;
    var REarth = conf.REarth;
    this.canvas = canvas

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
        });
        
        var sphereGeometry = new THREE.SphereGeometry(REarth, 50, 50);
        var sphere = new THREE.Mesh(sphereGeometry, material);
        
        sphere.id = "earthSphere"
        this.sphereBg = sphere;
        this.sphereBg.material.map.needsUpdate = true;
        this.sphereTexture = texture;

        Three.scene.add(sphere);
  }

  Globe.prototype.clear = function(){
    var canvas = this.canvas;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  function ptTo2D(pt3D){
    var vector = Three.projector.projectVector(pt3D.clone(), Three.camera);
    var vectorX = (vector.x / 2 + 0.5) * Three.w //+ window.offsetLeft;
    var vectorY = (-vector.y / 2 + 0.5) * Three.h //+ window.offsetTop;
    vectorX = Math.floor(vectorX);
    vectorY = Math.floor(vectorY);
    var pixel = {x:vectorX,y:vectorY}
    return pixel;
  }

  function latlngToPt(lng,lat,REarth){
        var theta = -(270 - lng) * Math.PI / 180;
        var phi = (lat) * Math.PI / 180;
        var kREarth = 1.01;

        ////kREarth是为了防止线距离贴图太近而效果模糊
        var x = REarth * Math.sin(theta) * Math.cos(phi) * kREarth;
        var y = REarth * Math.sin(phi) * kREarth;
        var z = REarth * Math.cos(theta) * Math.cos(phi) * kREarth;
        var pt = new THREE.Vector3(x,y,z);
        return pt;
}

Globe.prototype.clearSphereColor = function(){
  var meshes = this.meshes;
  for(var k in meshes){
    var mesh = meshes[k];
    mesh.material.color = new THREE.Color().setHSL(0,0,0.5);
  }
}


Globe.prototype.addCenter = function(latlng,h){
  // this.clearSphereColor();
  var lat = latlng.lat;
  var lng = latlng.lng;
  var REarth = this.defaults.REarth;

  var geo = new THREE.SphereGeometry(1.5,10,10);
  var random = Math.random()*0.3;
  var color = new THREE.Color().setHSL(h/360,0.8-random ,0.5+random);
  var mesh = new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:color}));
  this.meshes.push(mesh);
  Three.scene.add(mesh);

  this.curCenterPt = latlngToPt(lng,lat,REarth);
  mesh.position = this.curCenterPt;
}

Globe.prototype.loop=function(){
  this.loopCurCenter();
}

Globe.prototype.loopCurCenter = function(){
  this.curCenter2D = ptTo2D(this.curCenterPt);
}

Globe.prototype.zoomIn = function(){
  Interactions.obj.distanceTarget = 185;
}

Globe.prototype.zoomOut = function(){
  Interactions.obj.distanceTarget = 408;
}
    ///////////////////////////基础函数/////////////////////////////////
    function traverGeoJson(obj, initBase, init3D) {
      function traverArray(coordinates, item, name) { //MultiPolygon和Polygon经常不准确，所以直接遍历
        for (var k in coordinates) {
          if (typeof(coordinates[k][0]) !== "object") {
            init3D(coordinates, item, name);
            break;
          } else {
            traverArray(coordinates[k], item, name);
          }
        }
      }

      for (var k in obj) { //初步循环
        var obj1 = obj[k];
        if (obj1 && typeof(obj1) === "object") {
          if (k === "geometry") {
            var name = obj.properties.name;
            var coordinates = obj.geometry.coordinates;
            var coordinate = obj.coordinate;
            if (!coordinate) {
              coordinate = obj.properties.cp;
            } //另一份数据的情况

            var item = initBase(coordinate, name);
            traverArray(coordinates, item, name); //边界的坐标可能层层包裹

          } else {
            traverGeoJson(obj1, initBase, init3D);
          }
        }
      }
    }


    function pts2Mesh(pts, geoName, mapType, mat) {
      var yHeight = getYHeight(geoName)

      var shapeGeometry = latlng2MeshGeo(pts, mapType);

      var mesh = new THREE.Mesh(shapeGeometry, mat);
      mesh.lookAt(new THREE.Vector3(0, 1, 0));
      mesh.position.set(0, yHeight, 0);
      mesh.id = geoName;
      Three.scene.add(mesh);
      return mesh;
    }

    function pts2Boundary(pts, geoName, mapType, lineMaterial, REarth) {
      var yHeight = getYHeight(geoName) + 0.0001;

      var boundaryGeometry = latlng2BoundaryGeo(pts, mapType, REarth);

      var boundary = new THREE.Line(boundaryGeometry, lineMaterial, THREE.LineStrip)
      boundary.position.set(0, yHeight, 0);
      boundary.id = geoName;

      Three.scene.add(boundary);
      return boundary;
    }


    ////////////////////////web墨卡托的2个公式////////////////////////
    function lngPosX(lng, REarth) {
      return -lng / 180 * Math.PI * REarth
    }

    function latPosY(lat, REarth) {
      return REarth * Math.log(Math.tan((90 + lat) * Math.PI / 360))
    }


  exports.Globe = Globe;
})(window);