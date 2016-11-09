// drawing.js
// This file contains functions to draw on the HTML5 canvas

// // Draws a grid of cells on the canvas (evenly divided
// var drawGrid = function(game){
//   //size of canvas
//   var cw = game.viewport.width;
//   var ch = game.viewport.height;

//   //padding around grid
//   var p = game.cellPadding / 2;

//   //grid width and height
//   var bw = cw - (p*2) ;
//   var bh = ch - (p*2) ;

//   game.ctx.beginPath();

//   // vertical lines
//   for (var x = 0; x <= bw; x += Math.floor((cw - 2*p) / game.numHorizontalCells)) {
//     game.ctx.moveTo(0.5 + x + p, p);
//     game.ctx.lineTo(0.5 + x + p, bh + p);
//   }

//   // horizontal lines
//   for (var x = 0; x <= bh; x += Math.floor((ch - 2*p) / game.numVerticalCells)) {
//     game.ctx.moveTo(p, 0.5 + x + p);
//     game.ctx.lineTo(bw + p, 0.5 + x + p);
//   }

//   game.ctx.lineWidth = 1;
//   game.ctx.strokeStyle = "#000000";
//   game.ctx.stroke();
// };
var drawPlaza = function(game) {

  //http://stackoverflow.com/questions/6295564/html-canvas-dotted-stroke-around-circle
  var calcPointsCirc = function calcPointsCirc(cx,cy, rad, dashLength)
  {
      var n = rad/dashLength,
          alpha = Math.PI * 2 / n,
          pointObj = {},
          points = [],
          i = -1;

      while( i < n )
      {
          var theta = alpha * i,
              theta2 = alpha * (i+1);

          points.push({x : (Math.cos(theta) * rad) + cx, y : (Math.sin(theta) * rad) + cy, ex : (Math.cos(theta2) * rad) + cx, ey : (Math.sin(theta2) * rad) + cy});
          i+=2;
      }
      return points;
  }

  var drawCircle = function(circle) {
    var pointArray = calcPointsCirc(circle.x, circle.y, circle.d / 2.0, 0.5);
    game.ctx.strokeStyle = 'black'
    game.ctx.beginPath();

    for(p = 0; p < pointArray.length; p++){
        game.ctx.moveTo(pointArray[p].x, pointArray[p].y);
        game.ctx.lineTo(pointArray[p].ex, pointArray[p].ey);
        game.ctx.stroke();
    }

    game.ctx.closePath();
  }

  drawCircle(game.currStim.plaza);
};

var drawSectors = function(game) {
  var drawRect = function drawRect(rect, color) {
    game.ctx.beginPath();
    game.ctx.rect(rect.x, rect.y, rect.w, rect.h);
    game.ctx.fillStyle = color;
    game.ctx.fill();
    game.ctx.stroke();
  }

  drawRect(game.currStim.red, 'red');
  drawRect(game.currStim.blue, 'blue');
};

var drawLily = function(game) {
  if (game.currStim.lily) {
    var img = new Image;
    img.onload = function() {
      game.ctx.drawImage(img, game.currStim.lily.x, game.currStim.lily.y);
    }
    img.src = "lotus.png"
  }
}

// var highlightCell = function(game, player) {
//   if (player.role == game.playerRoleNames.role1){
//     var targetObjects = _.filter(game.currStim, function(x){
//       return x.targetStatus == "target";
//     });
//     for (var n = 0; n < targetObjects.length; n++){
//       var upperLeftX = targetObjects[n].speakerCoords.gridPixelX;
//       var upperLeftY = targetObjects[n].speakerCoords.gridPixelY;
//       if (upperLeftX != null && upperLeftY != null) {
//         game.ctx.beginPath();
//         game.ctx.lineWidth="10";
//         game.ctx.strokeStyle="black";
//         game.ctx.rect(upperLeftX + 5, upperLeftY + 5,290,290);
//         game.ctx.stroke();
//       }
//     }
//   }
// };

var drawScreen = function(game, player) {
  // draw background
  game.ctx.fillStyle = "#FFFFFF";
  game.ctx.fillRect(0,0,game.viewport.width,game.viewport.height);

  // Draw message in center (for countdown, e.g.)
  if (player.message) {
    game.ctx.font = "bold 23pt Helvetica";
    game.ctx.fillStyle = 'blue';
    game.ctx.textAlign = 'center';
    wrapText(game, player.message,
             game.world.width/2, game.world.height/4,
             game.world.width*4/5,
             25);
  }
  else {
    console.log(game);
    if (!_.isEmpty(game.currStim)) {
      drawSectors(game, player);
      drawPlaza(game);
      drawLily(game);
    }
  }

};

// This is a helper function to write a text string onto the HTML5 canvas.
// It automatically figures out how to break the text into lines that will fit
// Input:
//    * game: the game object (containing the ctx canvas object)
//    * text: the string of text you want to writ
//    * x: the x coordinate of the point you want to start writing at (in pixels)
//    * y: the y coordinate of the point you want to start writing at (in pixels)
//    * maxWidth: the maximum width you want to allow the text to span (in pixels)
//    * lineHeight: the vertical space you want between lines (in pixels)
function wrapText(game, text, x, y, maxWidth, lineHeight) {
  var cars = text.split("\n");
  game.ctx.fillStyle = 'white';
  game.ctx.fillRect(0, 0, game.viewport.width, game.viewport.height);
  game.ctx.fillStyle = 'red';

  for (var ii = 0; ii < cars.length; ii++) {

    var line = "";
    var words = cars[ii].split(" ");

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = game.ctx.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > maxWidth) {
        game.ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    game.ctx.fillText(line, x, y);
    y += lineHeight;
  }
}