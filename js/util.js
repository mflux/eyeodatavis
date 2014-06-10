/*
  A collection of useful functions for this data visualization
*/

EYEO.Util = {
  extractCountyName: function( id ){
    return id.split(',')[0];
  },

  svgToShape: function( svg ){
    var type = 'svg';
    var two = new Two({
      type: Two.Types[type],
      fullscreen: false,
      autostart: false
    });
    return two.interpret( svg );
  },

  //  from https://github.com/mrdoob/three.js/issues/447#issuecomment-1903251
  getCentroid: function ( mesh ) {

      mesh.geometry.computeBoundingBox();
      boundingBox = mesh.geometry.boundingBox;

      var x0 = boundingBox.min.x;
      var x1 = boundingBox.max.x;
      var y0 = boundingBox.min.y;
      var y1 = boundingBox.max.y;
      var z0 = boundingBox.min.z;
      var z1 = boundingBox.max.z;


      var bWidth = ( x0 > x1 ) ? x0 - x1 : x1 - x0;
      var bHeight = ( y0 > y1 ) ? y0 - y1 : y1 - y0;
      var bDepth = ( z0 > z1 ) ? z0 - z1 : z1 - z0;

      var centroidX = x0 + ( bWidth / 2 ) + mesh.position.x;
      var centroidY = y0 + ( bHeight / 2 )+ mesh.position.y;
      var centroidZ = z0 + ( bDepth / 2 ) + mesh.position.z;

      return mesh.geometry.centroid = { x : centroidX, y : centroidY, z : centroidZ };
  },

  parseChildren: function( group ){
    var children = group.children;
    var container = new THREE.Object3D();
    for( var i in group.children ){
      var child = group.children[i];
      if( child instanceof Two.Polygon ){
        var vertices = child.vertices;
        var mesh = EYEO.Util.createMesh( vertices );
        container.add( mesh );

        mesh.id = EYEO.Util.extractCountyName( child.id );
        EYEO.Util.getCentroid( mesh );
      }
      else
      if( child instanceof Two.Group ){
        var meshes = EYEO.Util.parseChildren( child );
        container.add( meshes );
      }
    }
    return container;
  },

  createMesh: function( vertices ){
    //  note that we must flip y axis here
    var sh = new THREE.Shape();
    sh.moveTo( vertices[0].x, -vertices[0].y );
    for( var i=1; i<vertices.length; i++ ){
      var p = vertices[i];
      sh.lineTo( p.x, -p.y );
    }

    var zoneMaterial = new THREE.MeshPhongMaterial({
      color: Math.random() * 10000000,
      side: THREE.DoubleSide
    });

    var geometry = sh.extrude({
      height: 1,
      size: 1,
      amount: 5,
      steps: 1,
      bevelEnabled: false,
    });

    var mesh = new THREE.Mesh( geometry, zoneMaterial );

    return mesh;
  },

  addLabels: function( obj3d, camera, renderer, counties, ethnicity ){
    $labels = $('#labels');
    obj3d.traverse( function( mesh ){
      if( mesh instanceof THREE.Mesh ){

        var labelText = mesh.id;

        var county = counties[mesh.id];

        if( county ){
          labelText += ' ' + county[ethnicity];
        }

        var geometry = mesh.geometry;
        var centroid = geometry.centroid;
        if( centroid === undefined ){
          return;
        }

        var dummy = new THREE.Object3D();
        dummy.position.set( centroid.x, centroid.y, centroid.z );
        mesh.add( dummy );

        var element = $('<div>');
        element.addClass( 'textLabel' );
        element.text( labelText );

        element.appendTo( $labels );

        var width = element.width();
        var height = element.height();

        mesh.update = function(){
          var position = THREEx.ObjCoord.cssPosition(dummy, camera, renderer);
          position.x -= width / 2;
          position.y -= height / 2;
          //console.log( position );
          element.css({
            transform: 'translate3d(' + position.x + 'px,' + position.y + 'px, 0)'
          });
        }

      }
    });
  },

  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  CSVToArray: function( strData, strDelimiter ){
      // Check to see if the delimiter is defined. If not,
      // then default to comma.
      strDelimiter = (strDelimiter || ",");

      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp(
          (
              // Delimiters.
              "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

              // Quoted fields.
              "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

              // Standard fields.
              "([^\"\\" + strDelimiter + "\\r\\n]*))"
          ),
          "gi"
          );


      // Create an array to hold our data. Give the array
      // a default empty first row.
      var arrData = [[]];

      // Create an array to hold our individual pattern
      // matching groups.
      var arrMatches = null;


      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      while (arrMatches = objPattern.exec( strData )){

          // Get the delimiter that was found.
          var strMatchedDelimiter = arrMatches[ 1 ];

          // Check to see if the given delimiter has a length
          // (is not the start of string) and if it matches
          // field delimiter. If id does not, then we know
          // that this delimiter is a row delimiter.
          if (
              strMatchedDelimiter.length &&
              (strMatchedDelimiter != strDelimiter)
              ){

              // Since we have reached a new row of data,
              // add an empty row to our data array.
              arrData.push( [] );

          }


          // Now that we have our delimiter out of the way,
          // let's check to see which kind of value we
          // captured (quoted or unquoted).
          if (arrMatches[ 2 ]){

              // We found a quoted value. When we capture
              // this value, unescape any double quotes.
              var strMatchedValue = arrMatches[ 2 ].replace(
                  new RegExp( "\"\"", "g" ),
                  "\""
                  );

          } else {

              // We found a non-quoted value.
              var strMatchedValue = arrMatches[ 3 ];

          }


          // Now that we have our value string, let's add
          // it to the data array.
          arrData[ arrData.length - 1 ].push( strMatchedValue );
      }

      // Return the parsed data.
      return( arrData );
  }
}