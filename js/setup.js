/*
  hooks various chunks of code together, such as renderer, camera, controls
  returns these as objects in a collection
*/

EYEO.setup = function( resource ){
  $render = $('#render');
  $window = $(window);
  var viewWidth = window.innerWidth;
  var viewHeight = window.innerHeight;

  var camera = EYEO.MakeCamera({
    screenWidth: viewWidth,
    screenHeight: viewHeight,
    fov: 16,
  });

  var view = new EYEO.View({
    renderWidth: viewWidth,
    renderHeight: viewHeight,
  });
  view.addCamera( camera );
  view.attachToElement( $render );

  var controls = new THREE.OrbitControls( camera, view.getCanvas() );
  controls.center.set( 0, 0, 0 );
  controls.userPanSpeed = 0.3;

  var picker = new EYEO.Picker({
    camera: camera,
    scene: view.getScene(),
    renderer: view.getRenderer()
  });

  var stats = new Stats();
  document.body.appendChild( stats.domElement );

  var gui = new dat.GUI();

  return {
    view: view,
    camera: camera,
    controls: controls,
    stats: stats,
    picker: picker,
    gui: gui,
  };
}