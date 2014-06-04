
window.Interactions = {};

(function(exports) {

	var mouse = {
		x: 0,
		y: 0
	};
	var mouseOnDown = {
		x: 0,
		y: 0
	};
	var target = {
		x: 4,
		y: 3
	};

	var rotation = {
		x: 0,
		y: 0
	};

	var targetOnDown = {
		x: 0,
		y: 0
	};

	var node;
	var PI = Math.PI;

	var dCameraX = 0;
	var dCameraY = 0;
	var dCameraZ = 0;

	var obj = {};

	obj.dCameraXTarget = 0;
	obj.dCameraYTarget = 0;
	obj.dCameraZTarget = 0;
	obj.distanceTarget = 408;

	var flyingObj ={obj:obj,target:rotation};

	var distance = 200;
	var distanceMax = 1600;
	var distanceMinmin = 1;
	var REarth = 1200;
	var overRenderer = false;

	var dCameraXTargetOnDown = 0;
	var dCameraYTargetOnDown = 0;
	var dCameraZTargetOnDown = 0;

    var self ={}


	var Init = function(containner, options) { //为node添加鼠标等交互事件
		this.defaults = {};
		this.w = containner.offsetWidth;
		this.h = containner.offsetHeight;
		this.cameraPos = Three.cameraPos;
		this.cameraTarget = Three.cameraTarget;

		containner.addEventListener('mousedown', onMouseDown, false);
		containner.addEventListener('mousewheel', onMouseWheel, false);
		containner.addEventListener('resize', onContainnerResize, false);
		containner.addEventListener('mouseover', function() {
			overRenderer = true;
		}, false);
		containner.addEventListener('mouseout', function() {
			overRenderer = false;
		}, false);

		this.containner = containner;
		self = this;
	}


	Init.prototype.loop = function(){
		var limit = 0.01;
		var rotateSpeed = 0.04;
		var scaleSpeed = 0.5;
		var moveSpeed = 0.3;
		if(Math.abs(target.x - rotation.x)+Math.abs(target.y - rotation.y)>limit){
			rotation.x += (target.x - rotation.x) * rotateSpeed;
			rotation.y += (target.y - rotation.y) * rotateSpeed;
		}

		if(Math.abs(obj.distanceTarget - distance)>limit){
			distance += (obj.distanceTarget - distance) * scaleSpeed;
		}

		target.x+=-0.002;

		if(Math.abs(obj.dCameraXTarget - dCameraX)+Math.abs(obj.dCameraYTarget - dCameraY)+Math.abs(obj.dCameraZTarget - dCameraZ)>limit){
		dCameraX += (obj.dCameraXTarget - dCameraX) * moveSpeed;
		dCameraY += (obj.dCameraYTarget - dCameraY) * moveSpeed;
		dCameraZ += (obj.dCameraZTarget - dCameraZ) * moveSpeed;			
		}
        
		positionx = distance * Math.sin(rotation.x) * Math.cos(rotation.y) + dCameraX;
		positiony = distance * Math.sin(rotation.y) + dCameraY;
		positionz = distance * Math.cos(rotation.x) * Math.cos(rotation.y) + dCameraZ;

		this.cameraPos.x = positionx//  = new THREE.Vector3(,dCameraY,dCameraZ);Three.camera.position.x = positionx
		this.cameraPos.y = positiony
		this.cameraPos.z = positionz

	 Three.camera.lookAt(new THREE.Vector3(dCameraX,dCameraY,dCameraZ));
     
		// var target = this.cameraTarget;
		// this.cameraTarget.x = dCameraX;
		// this.cameraTarget.y = dCameraY;
		// this.cameraTarget.z = dCameraZ;

		// viewX = REarth * Math.sin(rotation.x) * Math.cos(rotation.y);
		// viewY = REarth * Math.sin(rotation.y);
		// viewZ = REarth * Math.cos(rotation.x) * Math.cos(rotation.y);

		isChanging();
		window.requestAnimationFrame(this.loop.bind(this));
	}

	var onMouseDown = function(event) { //鼠标落下的瞬间
		var containner = self.containner;

		mouseOnDown.x = -event.clientX;
		mouseOnDown.y = event.clientY;

		targetOnDown.x = target.x;
		targetOnDown.y = target.y;

		obj.dCameraXTargetOnDown = obj.dCameraXTarget;
		obj.dCameraYTargetOnDown = obj.dCameraYTarget;
		obj.dCameraZTargetOnDown = obj.dCameraZTarget;

		containner.addEventListener('mousemove', onMouseMove, false);
		containner.addEventListener('mouseup', onMouseUp, false);
		containner.addEventListener('mouseout', onMouseOut, false);
		event.stopPropagation();
	}


	var onMouseMove = function(event) { //鼠标落下并且移动 并非仅仅移动
		mouse.x = -event.clientX;
		mouse.y = event.clientY;
		zoomDamp = distance / 1000;

		var which = event.which;
		if (which === 1 ) { //左击拖动则旋转画面 
			target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005;
			target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005;
			target.y = (target.y > PI/2) ? PI/2 : target.y;
			target.y = (target.y < -PI/2) ? -PI/2 : target.y;
		} else {//鼠标在左键时，移动画面;
			// obj.dCameraXTarget = obj.dCameraXTargetOnDown + (mouse.x - mouseOnDown.x) * zoomDamp*Math.cos(target.x);
			// obj.dCameraZTarget = obj.dCameraZTargetOnDown + (mouse.y - mouseOnDown.y) * zoomDamp*Math.sin(-target.x);
		}
		event.stopPropagation();
	}

	var onMouseUp = function(event) {
		var containner = self.containner;
		containner.removeEventListener('mousemove', onMouseMove, false);
		containner.removeEventListener('mouseup', onMouseUp, false);
		containner.removeEventListener('mouseout', onMouseOut, false);
		event.stopPropagation();
		// container.style.cursor = 'auto';
	}

	var onMouseOut = function(event) {
		var containner = self.containner;
		containner.removeEventListener('mousemove', onMouseMove, false);
		containner.removeEventListener('mouseup', onMouseUp, false);
		containner.removeEventListener('mouseout', onMouseOut, false);
		event.stopPropagation();
	}

	var onMouseWheel = function(event) {
		event.stopPropagation();
		if (overRenderer) {
			zoom(event.wheelDeltaY * 0.05);
		}
		return false;
	}


	var flyingTo = function(meshes, ratio, options) { //暂时只试用于平面情况

		var ratio = ratio || 0.75 // ratio为占屏幕的比重

		var max, min;
		for (var k in meshes) {
			var mesh = meshes[k]
			// mesh.material.color=color

			var geo = mesh.geometry;
			geo.computeBoundingBox();
			var boundingBox = geo.boundingBox;

			if (k == 0) {
				max = boundingBox.max.clone()
				min = boundingBox.min.clone()
			}

			if (max.x < boundingBox.max.x) {
				max.x = boundingBox.max.x
			}
			if (max.y < boundingBox.max.y) {
				max.y = boundingBox.max.y
			}
			if (max.z < boundingBox.max.z) {
				max.z = boundingBox.max.z
			}
			if (min.x > boundingBox.min.x) {
				min.x = boundingBox.min.x
			}
			if (min.y > boundingBox.min.y) {
				min.y = boundingBox.min.y
			}
			if (min.z > boundingBox.min.z) {
				min.z = boundingBox.min.z
			}
		}

		var width = Dom.w;
		var height = Dom.h;

		var xMax = max.x;
		var yMax = max.y;
		var zMax = max.z;
		var xMin = min.x;
		var yMin = min.y;
		var zMin = min.z;
		var width3D = Math.abs(xMax - xMin);
		var height3D = Math.abs(yMax - yMin);
		var cx = (xMax + xMin) / 2;
		var cy = (yMax + yMin) / 2;
		var cz = (zMax + zMin) / 2;
		var dx = (xMax - xMin)
		var dy = (yMax - yMin)
		var dz = (zMax - zMin)
		var center = new THREE.Vector3(cy, cz, cx);
		if (height3D) {
			if (width3D / height3D > self.w / self.h) {
				width3D = height3D * self.w / self.h;
			}
		}

		var camera = Three.getCamera();
		var angle = camera.fov / 360 * PI;

		obj.distanceTarget = width3D / Math.tan(angle) / 2 / ratio;

		obj.dCameraXTarget = -cy;
		obj.dCameraZTarget = -cx;
		obj.dCameraYTarget = 0

		target.x = PI;
		target.y = PI / 2
	}

	var flyingChina = function() {
		obj.dCameraXTarget = -18;
		obj.dCameraYTarget = 1;
		obj.dCameraZTarget = 6.9;
		obj.distanceTarget = 12;
		target.x = 3.226592653589794;
		target.y = 1.5687963267948966;
	}

	var flyingChinaLow = function() {
		obj.dCameraXTarget = -18;
		obj.dCameraYTarget = 3;
		obj.dCameraZTarget = 5.380 ;
		obj.distanceTarget = 10;
		target.x = 3.23;
		target.y = 0.51;
	}
	var flyingEngland = function() {
		obj.dCameraYTarget = 1;
		obj.distanceTarget=3.5;
		obj.dCameraXTarget=0.648;
		obj.dCameraZTarget=11.426;
		target.x = PI;
		target.y = PI / 2;
	}

	var flyingUSA = function() {
		obj.dCameraXTarget = 17.4;
		obj.dCameraYTarget = 1;
		obj.dCameraZTarget = 8.1;
		obj.distanceTarget = 10;
		target.x = PI;
		target.y = PI / 2;
	}
    
    var worldObj = {"obj":{"dCameraXTarget":0,"dCameraYTarget":0,"dCameraZTarget":6,"distanceTarget":60},"target":{"x":3.116702644796906,"y":0.6057808681121066}} 
      var flyingWorld = function() {
      	obj.flyingState = "world";
		flying(worldObj);
	}

	var flyingWorldLow = function() {
		obj.dCameraXTarget = -3;
		obj.dCameraYTarget = 15;
		obj.dCameraZTarget = 5;
		obj.distanceTarget = 53;
		target.x = 3.18;
		target.y = 0.16;
	}

    var topObj = {"obj":{"dCameraXTarget":0,"dCameraYTarget":0,"dCameraZTarget":6,"distanceTarget":60,"dCameraXTargetOnDown":-1.0795408730936549,"dCameraYTargetOnDown":0,"dCameraZTargetOnDown":5.9266946655371235},"target":{"x":3.1415480908652134,"y":1.5707916441776888}};
	var flyingTop = function() {
		obj.flyingState = "top";
		flying(topObj);
	}

	var flyingCover = function() {
		obj.distanceTarget=33;
		obj.dCameraXTarget=-15.746;
		obj.dCameraZTarget=9.079;
		obj.dCameraYTarget = -5;
		target.x = 2.99;
		target.y = PI / 2;
	}

    var farObj = {dCameraXTarget:-17,dCameraYTarget:-15,dCameraZTarget:71,distanceTarget:333,target:{x:-PI,y:-PI/2}}
	var flyingFar = function() {
		 // flying(farObj);
	}

	var flying = function(options){
	    obj.distanceTarget = options.obj.distanceTarget;
	    obj.dCameraXTarget = options.obj.dCameraXTarget;
	    obj.dCameraZTarget = options.obj.dCameraZTarget;
	    obj.dCameraYTarget = options.obj.dCameraYTarget;
		target.x = options.target.x;
		target.y = options.target.y;
	}

// flyingObj
	var distanceFlying = function(option1,option2){
		return Math.abs(option1.obj.dCameraXTarget-option2.obj.dCameraXTarget)
		+Math.abs(option1.obj.dCameraYTarget-option2.obj.dCameraYTarget)
		+Math.abs(option1.obj.dCameraZTarget-option2.obj.dCameraZTarget)
		+Math.abs(option1.target.x-option2.target.x)
		+Math.abs(option1.target.y-option2.target.y)
		;
	}

	obj.flyingState = "world";

	var flyingLatLng = function(obj){
		var lat = obj.lat;
		var lng = obj.lng;

	}


	var onContainnerResize = function(event) {
		event.stopPropagation();
		var camera = Three.getCamera();
		var containner = self.containner;
		var w = this.w;
		var h = this.h;
		camera.aspect = w / h;
		camera.VIEW_ANGLE = 260;
		Three.setSize(w, h);
	}

	var zoom = function(delta) {
		obj.distanceTarget -= delta;
		obj.distanceTarget = obj.distanceTarget > distanceMax ? distanceMax : obj.distanceTarget;
		obj.distanceTarget = obj.distanceTarget < distanceMinmin ? distanceMinmin : obj.distanceTarget;
	}

	var rotationOld = {
		x: 0,
		y: 0
	};
	var distanceOld = 0;
	var dCameraZOld = 0;
	var dCameraXOld = 0;
	var limit = 0.005;
	var changeBolOld = false //辅助3d的canvas都在containar2上，当移动事件发生的时候，会自动清除。
	var changingBol = false
	var changeBol = false;

	function clearCanva(){

	}

	function clearCanvas(){//清除2遍
		 clearCanva();
		var t = setTimeout(clearCanva,11);
	}

	var isChanging = function() {
		changeBol = false;
		var delta = Math.abs(rotation.x - rotationOld.x) + Math.abs(rotation.y - rotationOld.y) + Math.abs(distance - distanceOld) + Math.abs(dCameraZ - dCameraZOld) + Math.abs(dCameraX - dCameraXOld);

		if (delta > limit) { //当各种量的变化加起来超过一定，算运动
			changeBol = true;
		}
		if (changeBolOld != changeBol) {
            clearCanvas();
			changingBol = true;
		}
		if (changeBolOld == changeBol) {
			changingBol = false;
		}

		rotationOld.x = rotation.x;
		rotationOld.y = rotation.y;
		distanceOld = distance;
		dCameraXOld = dCameraX;
		dCameraZOld = dCameraZ;
		changeBolOld = changeBol;

		exports.changeBol = changeBol;
		exports.changingBol = changingBol;
	}



	exports.Init = Init;

	exports.flyingTo = flyingTo;
	exports.flyingFar = flyingFar
	exports.flyingCover = flyingCover
	exports.flyingTop = flyingTop;
	exports.flyingWorld = flyingWorld;
	exports.flyingUSA = flyingUSA;
	exports.flyingEngland = flyingEngland;
	exports.flyingChina = flyingChina;
	exports.flyingChinaLow = flyingChinaLow;
	exports.flyingWorldLow = flyingWorldLow;

	exports.target = target;
	exports.obj = obj;

})(window.Interactions);

