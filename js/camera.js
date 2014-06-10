/*
  Convenience function to create a THREE.js camera.
*/

EYEO.MakeCamera = function( args ){
  var screenWidth = args.screenWidth;
  var screenHeight = args.screenHeight;
  var fov = args.fov;

  var fov = 16;
  var aspect = screenWidth / screenHeight;
  var near = 10;
  var far = 5000;

  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far);
  camera.position.set( 300, 300, 300 );
  camera.lookAt( new THREE.Vector3(0,0,0) );
  return camera;
}