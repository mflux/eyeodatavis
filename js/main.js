/*
  load() is called when body html (and scripts) are fully loaded
  this will asynchronously load the file in resourceList
  and call main() when all files are loaded
*/

EYEO.load = function(){
  var resourceList = [
    'data/minnesota_counties.svg',
    'data/USA_Counties.svg',
    'data/Census2010RaceCounty.csv'
  ];

  //  this will call main when finished, and pass in structs
  EYEO.LoadResource( resourceList, EYEO.main );
}

EYEO.main = function( resources )
{
  var setup = EYEO.setup( resources );
  var view = setup.view;
  var camera = setup.camera;
  var controls = setup.controls;
  var stats = setup.stats;
  var gui = setup.gui;
  var picker = setup.picker;
  var scene = view.getScene();
  var renderer = view.getRenderer();

  var visualization = new EYEO.Visualization( resources, scene, camera, controls, picker, renderer, gui );
  visualization.setup();

  window.debug = setup;
  window.resources = resources;

  $window = $(window);
  $window.bind( 'click', visualization.onClick );
  $window.bind( 'mousemove', visualization.onMouseMove );

  function mainLoop()
  {
    update();
    render();
    stats.update();
    requestAnimationFrame( mainLoop );
  }

  function render()
  {
    view.draw( camera );
  }

  function update()
  {
    controls.update();
    visualization.update();
    scene.traverse( function(o){
      if( o.update ){
        o.update();
      }
    });
  }

  //  start loop
  mainLoop();
}

