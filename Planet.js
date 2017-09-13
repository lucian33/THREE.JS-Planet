/**
 * A simple Galaxy
 * @author haoz2@illinois.edu
 */


/**
 * Initialize camera, scene and renderer
 */
let scene, camera, renderer;

let width = window.innerWidth, height = window.innerHeight;

let planet, particles;

initialize();

render();

function initialize(){

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, width / height, 1, 200);
  camera.lookAt(scene.position);
  camera.position.z = 150;

  renderer = new THREE.WebGLRenderer({alpha: true, antialias:true}); // enable anti alias
  renderer.setSize(width, height);
  renderer.setClearColor(0x0E2255);

  document.getElementById('canvas').appendChild(renderer.domElement);

  window.addEventListener('resize', onResize);
  

  drawPlanet();
  drawParticle(350);
  createLight();
}



function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

/**
 * createLight - crete light in the scene
 */
function createLight(){
  var ambientLight = new THREE.AmbientLight(0x404040); // ambient light
  scene.add(ambientLight);

  var light = new THREE.DirectionalLight();
  light.position.set(10, 50, 25);
  scene.add(light);
}

/**
 * drawPlanet - Create planet and ring geometry
 */
function drawPlanet(){
  // collection of geometry
  planet = new THREE.Group();

  scene.add(planet);
  //  origin for heartShape
  var x = -5, y = -5;
  const heartShape = new THREE.Shape();
  heartShape.moveTo( x + 5, y + 5 );
  heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
  heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
  heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
  heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
  heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
  heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

  // use extrude to make the 2d heartShape 3d
  var extrudeSettings = { amount: 2, bevelEnabled: true, bevelSegments: 4, steps: 15, bevelSize: 5, bevelThickness: 5 };

  var planetGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

  planetGeometry.scale(1.5, 1.5, 1,5);
  // object with phong shading
  var planetMaterial = new THREE.MeshPhongMaterial({
      color: "rgb(128, 223, 255)"
    });
  var p = new THREE.Mesh(planetGeometry, planetMaterial);

  p.rotation.x = degToRad(145); // rotate


  planet.position.set(0, 0, 0);

  planet.add(p);

  // create the ring for planet
  // TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
  var ringGeometry = new THREE.TorusGeometry(50, 2, 4, 16);

  var ringMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(242, 174, 84)",
    // use falt shading
    shading: THREE.FlatShading
  });

  var ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

  ringMesh.rotation.x = degToRad(95);
  ringMesh.position.y = -5;

  planet.add(ringMesh);

}

/**
 * drawParticle - Create particles that orbiting the planet
 *
 * @param  {type} num number of particles
 */
function drawParticle(num){
  particles = new THREE.Group();

  var colors = [
    0x37BE95,
    0xF3F3F3,
    0x6549C0,
    "rgb(199, 249, 212)",
    "rgb(237, 242, 238)"
  ];

  scene.add(particles);

  for(var i = 0; i < num; i ++){
    var geometry = new THREE.SphereGeometry(3, 8, 8);

    // set random size
    var scaleFactor = Math.random() ;

    geometry.scale(
      scaleFactor,
      scaleFactor,
      scaleFactor
    );

    // get random color
    var colorIndex = Math.floor(Math.random() * colors.length);
    var material = new THREE.MeshPhongMaterial({
      color: colors[colorIndex],
      shading: THREE.FlatShading
    });

    var particle = new THREE.Mesh(geometry, material);

    // set random position
    // from [-100, 100]
    particle.position.set(
      200 * (Math.random() - 0.5),
      200 * (Math.random() - 0.5),
      200 * (Math.random() - 0.5),
    );



    particles.add(particle);
  }
}

function render(){

  requestAnimationFrame(render);

  planet.rotation.y += degToRad(1);

  particles.rotation.y += degToRad(0.05);
  particles.rotation.x += degToRad(0.1);
  //planet.rotation.z += 0.03;
  renderer.render(scene, camera);
}


/**
 * degToRad - description
 *
 * @param  {type} deg degree
 * @return {type} radius return the radius
 */
function degToRad(deg){
    return deg / 180 * Math.PI;
}
