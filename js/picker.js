/*
  Utility class for picking via ray-casting in a scene
  Use via picker.pick( screenX, screenY, listOfTHREEObjects )
*/

EYEO.Picker = function( args ){
  var projector = new THREE.Projector();
  var raycaster = new THREE.Raycaster();
  var renderer = args.renderer;
  var camera = args.camera;

  function pick( x, y, objects ){
    x = ( x / window.innerWidth ) * 2 - 1;
    y = -( y / window.innerHeight ) * 2 + 1;
    var vector = new THREE.Vector3( x, y, 1 );
    projector.unprojectVector( vector, camera );
    vector.sub( camera.position );
    vector.normalize();

    raycaster.set( camera.position, vector );
    var intersects = raycaster.intersectObjects( objects.children, true );
    if( intersects.length > 0 ){
      return intersects[0].object;
    }
    return undefined;
  }

  this.pick = pick;
}