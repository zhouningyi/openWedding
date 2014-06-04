/*global THREE*/
window.Three = {};
(function(exports) {

    var scene;
    var InitThree = function(node, options) {
        exports.node = node;
        exports.w = node.offsetWidth;
        exports.h = node.offsetHeight;

        this.defaults = {};

        this.initScene();
        // this.initCamera(this.defaults);
        // initLight(scene, 0)
        this.initCamera();
        this.initRender();
        this.loop();
    };

    InitThree.prototype.initScene = function() {
        scene = new THREE.Scene();
        // scene.fog = new THREE.FogExp2(0xffffff, 0.0000025);
        exports.scene = scene;
    };

    InitThree.prototype.initCamera = function(defaults) {
        var camera = exports.camera = new THREE.PerspectiveCamera(50, exports.w / exports.h, 0.1, 10000);
        camera.VIEW_ANGLE = 160;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;

        
        var cameraPos = exports.cameraPos = new THREE.Vector3(323, 1222, 333);
        camera.position = cameraPos;
        var cameraTarget = exports.cameraTarget = new THREE.Vector3(0, 0, 0)
        camera.lookAt(cameraTarget);
        var interaction = this.interaction = new Interactions.Init(exports.node);
        interaction.loop();
    }

    function initTexture() {}


    //渲染器配置  
    InitThree.prototype.initRender = function() {
        exports.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        var renderer = exports.renderer;
        renderer.setClearColor(0x000000, 0); //exports.scene.fog.color
        renderer.setSize(exports.w, exports.h);
        renderer.autoClear = false;
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.top = 0 + "px";
        renderer.domElement.style.left = 0 + "px";
        // renderer.domElement.width = exports.w;
        // renderer.domElement.height = exports.h;

        // renderer.domElement.width = exports.w;//'100%';
        // renderer.domElement.height = exports.h;//'100%';
        // console.log(exports.w, exports.h)
        exports.node.appendChild(exports.renderer.domElement);
    };


    function loop() {
        //console.log(target.x + " " + target.y + " " + distanceTarget);

        var renderer = exports.renderer;
        renderer.clear();
        renderer.render(exports.scene, exports.camera);
        // exports.loopID=window.setInterval("loop()",16);
    }

    InitThree.prototype.loop = loop;

    InitThree.prototype.stop = function() {
        //console.log(target.x + " " + target.y + " " + distanceTarget);
        exports.loopID = window.clearInterval(exports.loopID)
    };

    exports.Init = InitThree;
    exports.scene = scene;
    exports.projector = new THREE.Projector(); //为日后3d投影到2d平面之用
})(window.Three);