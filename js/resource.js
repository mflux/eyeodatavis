/*
  Utility function to load data files.
*/

EYEO.LoadResource = function( resourceList, callback ){
  console.log('loading resources');

  var resources = resourceList;

  function getFilenameNoExtension( string ){
    return file = string.match(/([^\/]+)(?=\.\w+$)/)[0];
  }

  function getResourceLoadCommand( resources ){
    var commands = [];
    for( var i in resources ){
      commands.push( $.get( resources[i] ) );
    }
    console.log( resources );
    return commands;
  }

  var resourceCommands = getResourceLoadCommand( resources );
  $.when.apply( this, resourceCommands )
  .done( function(){
    //  todo:
    //  handle failure cases

    var resourceCollection = {};
    //  Warning: this breaks if less than two resources loaded...
    for( var i in arguments ){
      if( resources[i] === undefined ){
        continue;
      }
      var filename = getFilenameNoExtension( resources[i] );
      console.log( '..loaded', filename );
      // console.log(JSON.parse(arguments[i][0]));
      resourceCollection[ filename ] = arguments[i][0];
    }

    console.log( 'finished loading resources' );
    callback( (new EYEO.Resource(resourceCollection) ) );
  })
  .fail(function(){
    console.warn('failed to load resources');
    console.log(arguments);
  });

}

/*
  Resource objects loaded from JSON.
  Usage:
  if the dereference in the json is newGameSettings.standard:

  resource.get( 'newgamesettings', 'standard' );
*/

EYEO.Resource = function( resources ){
  this.get = function(){
    if( arguments.length === 0 ){
      return resources;
    }
    var depth = resources[arguments[0]];
    for( var i=1; i<arguments.length; i++ ){
      depth = depth[ arguments[i] ];
    }
    return depth;
  }
}