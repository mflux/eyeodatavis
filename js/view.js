/*
  View contains a THREE.js Renderer and a Scene
  Calling view.draw( camera ) to render the scene to canvas
*/

EYEO.View = function( args ){
  var renderWidth = args.renderWidth;
  var renderHeight = args.renderHeight;

  var renderer = new THREE.WebGLRenderer( {antialias:true} );
  renderer.setClearColor( 0xffffff );
  renderer.setSize( renderWidth, renderHeight );

  var scene = new THREE.Scene();

  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.9 );
  hemiLight.color.setHSL( 0.55, 1, 1.0 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.5 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  var pLight = new THREE.PointLight( 0xffffff, 1.0, 10000 );
  pLight.position.set( 500, 500, 500 );
  scene.add( pLight );

  var $render = $('#render');

  function draw( camera ){
    renderer.render( scene, camera );
  }

  function addCamera( camera ){
    scene.add( camera );

    //  maybe move this to a better location
    THREEx.WindowResize( renderer, camera );
  }

  function getCanvas(){
    return renderer.domElement;
  }

  function getRenderer(){
    return renderer;
  }

  function attachToElement( element ){
    $(element).append( $( getCanvas() ) );
  }

  function getScene(){
    return scene;
  }

  this.draw = draw;
  this.getCanvas = getCanvas;
  this.attachToElement = attachToElement;
  this.addCamera = addCamera;
  this.getScene = getScene;
  this.getRenderer = getRenderer;
}