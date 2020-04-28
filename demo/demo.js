
// PointCloud with Custom, Dynamic Attribute
var renderer, scene, camera, parties, stats, moveLeft, moveRight, moveUp, moveDown, zoomOut, zoomIn;

init();
animate();

// init demo
function init() {

	// init as webgl2
	if (window.webgl2) {
		var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( 'webgl2', { alpha: false } );
		renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
	}
	// init as webgl1
	else {
		renderer = new THREE.WebGLRenderer();
	}
	
	// set size and clearcolor
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x001122, 1 )
    document.body.appendChild( renderer.domElement );
    
    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 200;

    // create particles systems
    parties = [];

    // initialize threejs stats
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    // add a demo particles system
    var addDemo = (system, offset) => {
        system.particleSystem.position.x = offset * 125 - 50;
        parties.push(system);
    }

    // global scale
    var globalScale = 400;

    // load texture
    // note: we use a trick and save image as data url so we can show this demo from local html file without having to serve files in order to load images
    // see 'explosion.js' for more details.
    var texture = new THREE.TextureLoader().load(window.explosionImage.src);

    // demo 1:
    addDemo(new Partykals.ParticlesSystem({
        container: scene,
        particles: {
            globalSize: 5,
            ttl: 12,
            velocity: new Partykals.Randomizers.SphereRandomizer(12.5),
            velocityBonus: new THREE.Vector3(0, 25, 0),
            gravity: -10,
            startAlpha: 1,
            endAlpha: 0,
            startColor: new Partykals.Randomizers.ColorsRandomizer(),
            endColor: new Partykals.Randomizers.ColorsRandomizer(),
            startAlphaChangeAt: 0,
            blending: "blend",
            onUpdate: (particle) => {
                floorY = -10;
                if (particle.position.y < floorY) {
                    particle.position.y = floorY;
                    particle.velocity.y *= -0.5;
                    particle.velocity.x *= 0.5;
                    particle.velocity.z *= 0.5;
                }
            }
        },
        system: {
            particlesCount: 1000,
            scale: globalScale,
            emitters: new Partykals.Emitter({
                onInterval: new Partykals.Randomizers.MinMaxRandomizer(0, 5),
                interval: new Partykals.Randomizers.MinMaxRandomizer(0, 0.25),
            }),
            speed: 1.5,
        }
    }), 0);

    // demo 2:
    addDemo(new Partykals.ParticlesSystem({
        container: scene,
        particles: {
            startAlpha: 1,
            endAlpha: 0,
            startSize: 3.5,
            endSize: 35,
            ttl: 5,
            velocity: new Partykals.Randomizers.SphereRandomizer(5),
            velocityBonus: new THREE.Vector3(0, 25, 0),
            colorize: true,
            startColor: new Partykals.Randomizers.ColorsRandomizer(new THREE.Color(0.5, 0.2, 0), new THREE.Color(1, 0.5, 0)),
            endColor: new THREE.Color(0, 0, 0),
            blending: "additive",
            worldPosition: true,
        },
        system: {
            particlesCount: 1000,
            scale: globalScale,
            emitters: new Partykals.Emitter({
                onInterval: new Partykals.Randomizers.MinMaxRandomizer(0, 5),
                interval: new Partykals.Randomizers.MinMaxRandomizer(0, 0.25),
            }),
            depthWrite: false,
            speed: 1,
            onUpdate: (system) => {
                system.startX = system.startX || system.particleSystem.position.x;
                system.particleSystem.position.x = system.startX + Math.sin(system.age * 2) * 5;
                system.particleSystem.position.z = -Math.sin(system.age * 2) * 5;
            },
        }
    }), 1);

    // demo 3:
    addDemo(new Partykals.ParticlesSystem({
        container: scene,
        particles: {
            startAlpha: 1,
            endAlpha: 0,
            startSize: 3.5,
            endSize: 15,
            ttl: 0.75,
            offset: new Partykals.Randomizers.SphereRandomizer(45, 35),
            startColor: new Partykals.Randomizers.ColorsRandomizer(),
            endColor: new Partykals.Randomizers.ColorsRandomizer(),
            blending: "additive",
        },
        system: {
            particlesCount: 2500,
            scale: globalScale,
            depthWrite: false,
            emitters: new Partykals.Emitter({
                onInterval: new Partykals.Randomizers.MinMaxRandomizer(35, 85),
                interval: new Partykals.Randomizers.MinMaxRandomizer(0, 0.015),
            }),
            speed: 1,
            onUpdate: (system) => {
                system.particleSystem.rotation.y += system.dt;
            },
        }
    }), 2);
   
    // demo 4:
    addDemo(new Partykals.ParticlesSystem({
        container: scene,
        particles: {
            startAlpha: 1,
            endAlpha: 0,
            startSize: new Partykals.Randomizers.MinMaxRandomizer(1, 5),
            endSize: new Partykals.Randomizers.MinMaxRandomizer(50, 150),
            ttl: 2,
            velocity: new Partykals.Randomizers.SphereRandomizer(55, 35),
            startColor: new Partykals.Randomizers.ColorsRandomizer(new THREE.Color(0.5, 0.2, 0), new THREE.Color(1, 0.5, 0)),
            endColor: new THREE.Color(0, 0, 0.5),
            blending: "additive",
            worldPosition: true,
            rotation: new Partykals.Randomizers.MinMaxRandomizer(0, 6.28319),
            rotationSpeed: new Partykals.Randomizers.MinMaxRandomizer(-10, 10),
            texture: texture,
        },
        system: {
            particlesCount: 500,
            scale: globalScale,
            depthWrite: false,
            emitters: new Partykals.Emitter({
                onInterval: new Partykals.Randomizers.MinMaxRandomizer(250, 500),
                interval: 2,
            }),
            speed: 1,
        }
    }), 3);

    // resize renderer and canvas when window resizes.
    var onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    window.addEventListener( 'resize', onWindowResize, false );

    // add controls
    window.addEventListener('keydown', (e) => {
        if (e.keyCode == '37' || e.keyCode == 'A'.charCodeAt()) {
            moveLeft = true;
        }
        else if (e.keyCode == '39' || e.keyCode == 'D'.charCodeAt()) {
            moveRight = true;
        }
        else if (e.keyCode == '38' || e.keyCode == 'W'.charCodeAt()) {
            moveUp = true;
        }
        else if (e.keyCode == '40' || e.keyCode == 'S'.charCodeAt()) {
            moveDown = true;
        }
        else if (e.keyCode == 'Z'.charCodeAt()) {
            zoomIn = true;
        }
        else if (e.keyCode == 'X'.charCodeAt()) {
            zoomOut = true;
        }
    });
    window.addEventListener('keyup', (e) => {
        if (e.keyCode == '37' || e.keyCode == 'A'.charCodeAt()) {
            moveLeft = false;
        }
        else if (e.keyCode == '39' || e.keyCode == 'D'.charCodeAt()) {
            moveRight = false;
        }
        else if (e.keyCode == '38' || e.keyCode == 'W'.charCodeAt()) {
            moveUp = false;
        }
        else if (e.keyCode == '40' || e.keyCode == 'S'.charCodeAt()) {
            moveDown = false;
        }
        else if (e.keyCode == 'Z'.charCodeAt()) {
            zoomIn = false;
        }
        else if (e.keyCode == 'X'.charCodeAt()) {
            zoomOut = false;
        }
    });
}

// animation main loop
function animate() {

    requestAnimationFrame( animate );
    render();

}

// update particles and render scene
function render() {

    // for stats (fps show ect)
    stats.begin();

    // update particle systems
    for (var i = 0; i < parties.length; ++i) {
        parties[i].update();
    }

    // move camera
    var dt = parties[0].dt;
    var moveSpeed = 100 * dt;
    if (moveLeft) { camera.position.x -= moveSpeed; }
    if (moveRight) { camera.position.x += moveSpeed; }
    if (moveUp) { camera.position.y += moveSpeed; }
    if (moveDown) { camera.position.y -= moveSpeed; }
    if (zoomOut) { camera.position.z += moveSpeed; }
    if (zoomIn) { camera.position.z -= moveSpeed; }

    // render scene
    renderer.render( scene, camera );

    // for stats (fps show ect)
    stats.end();
}