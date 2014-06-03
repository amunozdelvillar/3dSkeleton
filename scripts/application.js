/**
 * Created by angel on 27/05/14.
 */
(function(exports,$){
    exports.Application = function(){
        //globals
        var container, scene, camera, renderer, controls, stats ,mesh , zmesh , geometry;
        var keyboard = new THREEx.KeyboardState();
        var clock = new THREE.Clock();
        var jump = false;
        var jumpDistance = 0;

        var MovingCube;

        //init();
        //animate();

        this.init = function(){
            //SCENE
            scene = new THREE.Scene();
            //CAM
            var SCREEN_WIDTH = window.innerWidth,SCREEN_HEIGHT = window.innerHeight;
            var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH/SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
            camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
            scene.add(camera);
            camera.position.set(0,150,400);
            camera.lookAt(scene.position);
            //RENDERER
            if(Detector.webgl){
                renderer = new THREE.WebGLRenderer({antialias:true});
            }else{
                renderer = new THREE.CanvasRenderer();
            }
            renderer.setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
            //container = $('#ThreeJS');
            container = document.getElementById('ThreeJS');
            container.appendChild(renderer.domElement);
            //EVENTS
            THREEx.WindowResize(renderer,camera);
            THREEx.FullScreen.bindKey({charCode: 'm'.charAt(0)});
            //CONTROLS
            controls = new THREE.OrbitControls(camera,renderer.domElement);
            //STATS
            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.botton = '0px';
            stats.domElement.style.zIndex = 100;
            container.appendChild(stats.domElement);
            //LIGHT
            var light = new THREE.PointLight(0xffffff);
            light.position.set(0,250,0);
            scene.add(light);
            //FLOOR
            var floorTexture = THREE.ImageUtils.loadTexture('resources/sand-512.jpg');
            floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
            floorTexture.repeat.set(10,10);
            var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture,side: THREE.DoubleSide});
            var floorGeometry = new THREE.PlaneGeometry(1000,1000,10,10);
            var floor = new THREE.Mesh(floorGeometry,floorMaterial);
            floor.position.y = -125;
            floor.rotation.x = Math.PI/2;
            scene.add(floor);
            //SKYBOX/FOG
            var skyBoxGeometry = new THREE.CubeGeometry(10000,10000,10000);
            var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide});
            var skybox = new THREE.Mesh(skyBoxGeometry,skyboxMaterial);
            scene.add(skybox);
            scene.fog = new THREE.FogExp2( 0x9999ff,0.00025);

            //CUBE
//            var materialArray = [];
//            materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('resources/nebula-xpos.png')}));
//            materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('resources/nebula-xneg.png')}));
//            materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('resources/nebula-ypos.png')}));
//            materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('resources/nebula-yneg.png')}));
//            materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('resources/nebula-zpos.png')}));
//            materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('resources/nebula-zneg.png')}));
//            var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
//            var MovingCubeGeometry = new THREE.CubeGeometry(50,50,50,1,1,1,materialArray);
//            MovingCube = new THREE.Mesh(MovingCubeGeometry,MovingCubeMat);
//            MovingCube.position.set(0,25.1,0);
//            scene.add(MovingCube);

            //this.Chick
            var loader = new THREE.UTF8Loader();
            loader.load('models/adult_female/adult_female.js', function(object){
                var s = 1;
                object.scale.set(s,s,s);
                object.position.x = 0;
                object.position.y = -125;
                mesh = object;
                scene.add(object);

//                object.transverse(function(node){
//                    node.castShadow = true;
//                    node.recieveShadow = true;
//                    if(node.material && node.material.name === 'skin'){
//                        console.log('derp');
//                    }
//                });
            },{normalizeRGB: true});
        };

        this.run = function(){
            this.init();
            animate();
        };

        function animate(){
          requestAnimationFrame(animate);
            render();
            update();
        }

        function update(){
            MovingCube = mesh.children[3];

            var delta = clock.getDelta();//seconds
            var moveDistance = 200 * delta;//200px per second
            var rotateAngle = Math.PI / 2 * delta // PI/2 radians (90 degrees) per second
            //local coordinates

            //local transformations

            //make the mofo jump!
            if(keyboard.pressed("space")){
                jump = true;
            }

            if(jump && jumpDistance <= 50){
                MovingCube.position.y += moveDistance;
                jumpDistance += moveDistance;
            }else if(jumpDistance === 50){
                MovingCube.position.y -= moveDistance;
                jumpDistance -= moveDistance;
            }

            //move forwards/backward/left/right
            if(keyboard.pressed("W"))
                MovingCube.translateZ(moveDistance);
            if(keyboard.pressed("S"))
                MovingCube.translateZ(-moveDistance);
            if(keyboard.pressed("Q"))
                MovingCube.translateX(-moveDistance);
            if(keyboard.pressed("E"))
                MovingCube.translateX( moveDistance);

            //rotate left/right/up/down
            var rotation_matrix = new THREE.Matrix4().identity();
            if(keyboard.pressed("A"))
                MovingCube.rotateOnAxis(new THREE.Vector3(0,1,0), rotateAngle);
            if(keyboard.pressed("D"))
                MovingCube.rotateOnAxis(new THREE.Vector3(0,1,0),-rotateAngle);
            if(keyboard.pressed("R"))
                MovingCube.rotateOnAxis(new THREE.Vector3(1,0,0), rotateAngle);
            if(keyboard.pressed("F"))
                MovingCube.rotateOnAxis(new THREE.Vector3(1,0,0),-rotateAngle);

            if(keyboard.pressed("Z")){
                MovingCube.position.set(0,25.1,0);
                MovingCube.rotation.set(0,0,0);
            }

            //global coordinates
            if(keyboard.pressed('left'))
                MovingCube.position.x -= moveDistance;
            if(keyboard.pressed('right'))
                MovingCube.position.x += moveDistance;
            if(keyboard.pressed('up'))
                MovingCube.position.z -= moveDistance;
            if(keyboard.pressed('left'))
                MovingCube.position.z += moveDistance;

            controls.update();
            stats.update();
        }

        function render(){
            renderer.render(scene,camera);
        }
    };
}(window,window.jQuery));