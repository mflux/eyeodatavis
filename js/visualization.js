EYEO.Visualization = function( resources, scene, camera, controls, picker, renderer, gui ){

  //  rotate scene so z is up
  //  when adding new meshes, add to container
  var container = new THREE.Object3D();
  scene.add( container );
  container.rotation.x = Math.PI / 2 * 3;

  this.setup = function(){

    //  get the svg data
    var svgResource = resources.get('minnesota_counties');
    var svg = svgResource.children[0];

    //  turn it into shapes
    var shape = EYEO.Util.svgToShape( svg );

    //  turn shapes into meshes
    var meshes = EYEO.Util.parseChildren( shape );
    container.add( meshes );

    //  center the view
    controls.center.set( 310, 0, 70 );


    var data = EYEO.Parse( 'Census2010RaceCounty', resources );
    console.log(data);

    var counties = data.counties;

    var opts = {
      ethnicity: 'Asian',
      scale: 50,
      proportionalToCounty: true,
    }

    function updateEthnicity(){
      console.log('updating');
      visualizeEthnicity( opts.ethnicity, counties, meshes, opts.scale, opts.proportionalToCounty );
    }

    var raceKey = [
      'One race total',
      'White',
      'Black or African American',
      'American Indian and Alaska Native',
      'Asian',
      'Native Hawaiian and Other Pacific Islander',
      'Some Other Race',
      'Two or More Races',
      'Hispanic or Latino (of any race)'
    ];

    gui.add( opts, 'ethnicity', raceKey ).onFinishChange( updateEthnicity );
    gui.add( opts, 'scale', 10, 1000 ).onFinishChange( updateEthnicity );

    updateEthnicity();

    // EYEO.Util.addLabels( meshes, camera, renderer, counties, opts.ethnicity );
  }

  /*
    This function takes an ethnicity name, the counties data, and extracts population from the data
    This value is then applied to the mesh scale z property

    ethnicityName - Any valid property found in the census2010 records, eg 'Asian', 'American Indian and Alaska Native', etc
    counties - The extracted county data
    meshes - The county meshes that belong to THREE.js
    height - How much to scale the height of the visualization
    local - True: Visualizes the race distribution of each county compared to the county itself
            False: Visualizes the race distribution of each county compared to the entire state
  */
  function visualizeEthnicity( ethnicityName, counties, meshes, height, local ){
    var counties = counties;
    var statePopulation = counties.statePopulation;

    meshes.traverse( function( mesh ){
      if( (mesh instanceof THREE.Mesh) === false){
        return;
      }

      //  look it up
      var county = counties[ mesh.id ];
      if( county ){
        var asianPop = county[ ethnicityName ];
        var totalPop = local ? county[ 'population' ] : statePopulation;

        var scale = asianPop / totalPop * height;
        scale = Math.pow( scale, 2 );

        if( scale === 0 ){
          scale = 0.000001;
        }

        mesh.scale.z = scale;
      }
      else{
        mesh.scale.z = 0.000001;
      }
    });
  }

  //  use this function to animate
  this.update = function(){

  }

  //  example of picking a mesh
  this.onClick = function( e ){
    var s = picker.pick( e.clientX, e.clientY, container );
    if( s ){
      console.log( s.id );
    }
  }

  var mouseX = 0;
  var mouseY = 0;

  this.onMouseMove = function( e ){
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

}
