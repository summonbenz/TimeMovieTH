/********************************
  APP Name : TimeMovieTH
  Author : Nipitpon Chantada
*********************************/
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var parseFeed = function(data) {
  var items = [];
  //for(var i = 0; i < quantity; i++) {
  for(var i = 0; i < data.length; i++) {
    // Always upper case the description string
    var title = data[i].cinema;

    // Get date/time substring
    var time = data[i].description;

    // Add to menu items array
    items.push({
      title:title,
      subtitle:time
    });
  }

  // Finally return whole array
  return items;
};
var parseListMovie = function(data) {
  var items = [];
  //for(var i = 0; i < quantity; i++) {
  for(var i = 0; i < data.length; i++) {
    // Always upper case the description string
    var name = data[i].name;
    var rating = data[i].rating;
    var system = data[i].system;
    var language = data[i].language;
    var theatre = data[i].theatre;
    //var showtime = [];
    var showtime = "";
    for(var j = 0; j < data[i].showtime.length; j++){
      showtime += data[i].showtime[j]+' ';
    }
    var title = name;
    var detail = theatre+'('+rating+') ('+system+') '+language;
    
    // Add to menu items array
    items.push({
      title:title,
      subtitle:detail,
      showtime:showtime
    });
  }

  // Finally return whole array
  return items;
};

// Show splash screen while waiting for data
var splashWindow = new UI.Window({ fullscreen: true });

// Text element to inform user
var titlet = new UI.Text({
  position: new Vector2(0, 100),
  size: new Vector2(144, 36),
  text:'TimeMovieTH',
  font:'GOTHIC_24_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
	backgroundColor:'white'
});
var text = new UI.Text({
  position: new Vector2(0, 130),
  size: new Vector2(144, 36),
  text:'Downloading Cinema data...',
  font:'GOTHIC_14_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
	backgroundColor:'white'
});
var image = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 110),
  image: 'images/logoxl_timemovieth.png'
});

// Add to splashWindow and show
splashWindow.add(image);
splashWindow.add(titlet);
splashWindow.add(text);
splashWindow.show();

// Make request to openweathermap.org
ajax(
  {
    url:'http://www.padao.in.th/timemovieth/fetch.php',
    type:'json'
  },
  function(data) {
    // Create an array of Menu items
    var menuItems = parseFeed(data);

    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Current Cinema',
        items: menuItems
      }]
    });
    
    // Add an action for SELECT
    resultsMenu.on('select', function(e) {
      splashWindow.show();
      console.log('Item number ' + e.itemIndex + ' was pressed!');
      
      //fetch in cinema
      ajax(
      {
        url:'http://www.padao.in.th/timemovieth/cinema.php?id='+e.itemIndex,
        type:'json'
      },
      function(data){
          var movieItems = parseListMovie(data);
        
        // Construct Menu to show to user
          var resultsMovie = new UI.Menu({
            sections: [{
              title: e.item.title,
              items: movieItems
            }]
          });
        resultsMovie.on('select', function(p) {
          var detailCard = new UI.Card({
            title: p.item.title,
            subtitle:p.item.showtime,
            body: p.item.subtitle,
            scrollable:true
          });
          detailCard.show();
        });
        
        splashWindow.hide();
        resultsMovie.show();
        //resultsMenu.hide();
      });
      
      
    });

    // Show the Menu, hide the splash
    resultsMenu.show();
    splashWindow.hide();
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
