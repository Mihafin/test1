Game.prototype.GAME_WIDTH = 10;
Game.prototype.BOX_WIDTH = 1;
Game.prototype.DEBUG = true;

function Game(viewport, stats) {
    this.viewport = viewport;
    this.stats_div = stats;

    this.stats = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.light = null;
    this.objs = [];
    this.controls = null;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.moved_obj = null;
    this.plane = null;
    this.intersects = null;

    this.init_events();
}

Game.prototype.update_animation = function(){
    this.scene.simulate();
    this.renderer.render(this.scene, this.camera);
    if (this.DEBUG) this.stats.update();
};

Game.prototype.init = function() {
    while (this.viewport.firstChild) {
        this.viewport.removeChild(this.viewport.firstChild);
    }

    this.init_scene();
    this.init_objects();
    if (this.DEBUG) this.init_stat();
};

Game.prototype.on_mouse_down = function(e){
    e.preventDefault();

    this.raycaster.setFromCamera( this.mouse, this.camera );
    this.intersects = this.raycaster.intersectObjects( this.objs );

    console.log("intersects=", this.intersects);

    if (this.intersects.length > 0){
        this.moved_obj = this.intersects[0];
        var _vector = new THREE.Vector3( 0, 0, 0 );
        this.intersects[0].object.setAngularFactor( _vector );
        this.intersects[0].object.setAngularVelocity( _vector );
        this.intersects[0].object.setLinearFactor( _vector );
        this.intersects[0].object.setLinearVelocity( _vector );

        //this.moved_obj.object.__dirtyPosition = true;
        if (this.controls) this.controls.enabled = false;
        console.log("moved_obj=", this.moved_obj);
    }
};

Game.prototype.on_mouse_move = function(e){
    e.preventDefault();

    this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (this.moved_obj) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.intersects = this.raycaster.intersectObject(this.plane);
        if (this.intersects.length > 0){
            var dif_x = this.intersects[0].point.x - this.moved_obj.object.position.x;
            var dif_y = this.intersects[0].point.y - this.moved_obj.object.position.y;
            var vel_v = new THREE.Vector3(dif_x, dif_y, 0).multiplyScalar(10);

            this.moved_obj.object.setLinearVelocity(vel_v);
            //this.moved_obj.object.position.x = this.intersects[0].point.x;
            //this.moved_obj.object.position.y = this.intersects[0].point.y;
        }
    }
};

Game.prototype.on_mouse_up = function(e){
    e.preventDefault();

    if (this.moved_obj) {
        //this.moved_obj.object.__dirtyPosition = false;
        var _vector = new THREE.Vector3( 1, 1, 1 );
        this.moved_obj.object.setAngularFactor( _vector );
        this.moved_obj.object.setLinearFactor( _vector );
        this.moved_obj = null;
        if (this.controls) this.controls.enabled = true;
    }
    this.viewport.style.cursor = 'auto';
};

Game.prototype.init_events = function (){
    var scope = this;
    this.viewport.addEventListener('mousemove', function(e){scope.on_mouse_move(e)}, false);
    this.viewport.addEventListener('mousedown', function(e){scope.on_mouse_down(e)}, false);
    this.viewport.addEventListener('mouseup',   function(e){scope.on_mouse_up(e)},   false);
};

Game.prototype.init_objects = function (){
    var x = this.GAME_WIDTH / 2;
    var texture = THREE.ImageUtils.loadTexture( "textures/disturb.jpg" );
    var objectMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );

    var cube = new Physijs.BoxMesh( geometry, objectMaterial );
    cube.castShadow = true;
    cube.rotation.z = Math.PI/4.01;
    cube.position.x = x;
    cube.position.y = 3;
    this.scene.add( cube );

    this.objs.push(cube);

    geometry = new THREE.BoxGeometry(1, .4, 1);
    var cube2 = new Physijs.BoxMesh( geometry, objectMaterial);
    cube2.castShadow = true;
    cube2.position.y = 4;
    cube2.position.x = x;
    this.scene.add( cube2 );

    this.objs.push(cube2);

    var boxgeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    var boxmaterial = new THREE.MeshLambertMaterial({color: 0x0aeedf, transparent: true, opacity: 0.4});
    var cube_targ1 = new THREE.Mesh(boxgeometry, boxmaterial);
    cube_targ1.position.y = 2;
    cube_targ1.position.x = x;
    this.scene.add(cube_targ1);
};

Game.prototype.init_scene = function() {
    //CAMERA
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 200 );
    this.camera.position.x = this.GAME_WIDTH / 2;
    this.camera.position.z = 10;//10;
    this.camera.position.y = 5;//5;
    this.camera.lookAt(new THREE.Vector3(this.GAME_WIDTH / 2, this.GAME_WIDTH / 4, 0));

    //SCENE
    this.scene = new Physijs.Scene();
    this.scene.fog = new THREE.Fog( 0xDBFFEA, 1, 100);

    //RENDERER
    this.renderer = new THREE.WebGLRenderer(); //{ antialias: true|false }
    this.renderer.setClearColor( 0xDBFFEA );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.viewport.appendChild( this.renderer.domElement );
    this.renderer.shadowMapEnabled = true;

    // GROUND
    var groundTexture = THREE.ImageUtils.loadTexture( "textures/grasslight-big.jpg" );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 16, 16 );
    groundTexture.anisotropy = 16;
    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: groundTexture } );
    var mesh = new Physijs.BoxMesh( new THREE.PlaneBufferGeometry( 256, 256, 1, 1 ), groundMaterial );
    mesh.position.y = 0;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );

    //LIGHT
    this.scene.add(new THREE.AmbientLight( 0x666666 ));
    this.light = new THREE.SpotLight( 0xdfebff, 1.75 , 100);
    if (this.DEBUG) this.light.shadowCameraVisible = true;
    this.light.position.set( -5, 40, 10 );
    this.light.castShadow = true;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.light.shadowCameraNear = 1;
    this.light.shadowCameraFar = 4000;
    this.light.shadowCameraFov = 30;
    this.light.shadowDarkness = 0.5;
    this.scene.add(this.light);

    //controls
    if (this.DEBUG) {
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.target = new THREE.Vector3(0, 0, 0);
    }

    //GAME_BOX
    this.init_game_box();

    //COORD PLANE
    this.plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true } )
    );
    this.plane.visible = this.DEBUG;
    this.scene.add(this.plane);
};

Game.prototype.init_game_box = function(){
    var _w = this.GAME_WIDTH;
    var _h = this.GAME_WIDTH / 2;
    var cor = 0.0125;
    var opacity = this.DEBUG ? 0.2 : 0;
    var box_mat = new THREE.MeshBasicMaterial({color: 0xcccccc, opacity: opacity, transparent: true});

    var p = new THREE.PlaneBufferGeometry(_w, _h);

    var p1_mesh = new Physijs.BoxMesh(p, box_mat);
    p1_mesh.position.x = _w/2;
    p1_mesh.position.y = _h/2;
    p1_mesh.position.z = -this.BOX_WIDTH/2 - cor;
    this.scene.add(p1_mesh);

    var p2_mesh = new Physijs.BoxMesh(p, box_mat);
    p2_mesh.position.x = _w/2;
    p2_mesh.position.y = _h/2;
    p2_mesh.position.z = this.BOX_WIDTH/2 + cor;
    this.scene.add(p2_mesh);

    var plr = new THREE.PlaneBufferGeometry(this.BOX_WIDTH + 2*cor, _h);

    var p3_mesh = new Physijs.BoxMesh(plr, box_mat);
    p3_mesh.position.x = 0;
    p3_mesh.position.y = _h/2;
    p3_mesh.position.z = 0;
    p3_mesh.rotation.y = Math.PI/2;
    this.scene.add(p3_mesh);

    var p4_mesh = new Physijs.BoxMesh(plr, box_mat);
    p4_mesh.position.x = this.GAME_WIDTH;
    p4_mesh.position.y = _h/2;
    p4_mesh.position.z = 0;
    p4_mesh.rotation.y = Math.PI/2;
    this.scene.add(p4_mesh);
};

Game.prototype.init_stat = function(){
    //STATS
    this.stats = new Stats();
    this.stats_div.appendChild(this.stats.domElement);
    console.log("stat loaded");
};
