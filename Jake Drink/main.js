import './style.css'


document.querySelector('#app').innerHTML = `
<div align="center">
<div class="darkbk">
<h1>Jake Drink</h1>
<br />
<p>
    Have some fun playing the worlds greatest game!
</p>
<br />
<p>&copy; Lauren Bywater 2016-2023.</p>
<br />
</div>
<table cellpadding="0" cellspacing="0" border="0">
<tr>
    <td>
        <div class="power_controls">
            <br />
            <br />
            <table class="power" cellpadding="10" cellspacing="0">
                <tr>
                    <th align="center">Power</th>
                </tr>
                <tr>
                    <td width="78" align="center" id="pw3">High</td>
                </tr>
                <tr>
                    <td align="center" id="pw2">Med</td>
                </tr>
                <tr>
                    <td align="center" id="pw1">Low</td>
                </tr>
            </table>
            <br />
            <img id="spin_button" src="spin_off.png" alt="Spin" />
        </div>
    </td>
    <td width="438" height="582" class="the_wheel" align="center" valign="center">
        <canvas id="canvas" width="450" height="480">
            <p style="color: white" align="center">Sorry, your browser doesn't support canvas. Please try another.</p>
        </canvas>
    </td>
</tr>
</table>
`

// setupCounter(document.querySelector('#counter'))

var theWheel = new Winwheel({
  //'outerRadius'     : 212,        // Set outer radius so wheel fits inside the background.
  'innerRadius'     : 100,         // Make wheel hollow so segments don't go all way to center.
  'textFontSize'    : 28,         // Set default font size for the segments.
  'textOrientation' : 'curved', // Make text vertial so goes down from the outside of wheel.
  'textAlignment'   : 'inner',    // Align text to outside of wheel.
  'textFontFamily'  : 'Courier',     // Specify font family. Use monospace for curved text
  'numSegments'     : 5,         // Specify number of segments.
  'segments'        :             // Define segments including colour and text.
  [                               // font size and test colour overridden on backrupt segments.
     {'fillStyle' : '#3cb878', 'text' : 'Drink\nJake'},
     {'fillStyle' : '#f6989d', 'text' : 'Drink'},
     {'fillStyle' : '#00aef0', 'text' : 'Jake\nDrink'},
     {'fillStyle' : '#f26522', 'text' : 'Jake\nDrunk'},
     //{'fillStyle' : '#000000', 'text' : 'No Drink', 'textFontSize' : 16, 'textFillStyle' : '#ffffff'},
     {'fillStyle' : '#e70697', 'text' : 'Jack\nDrink'}
     //{'fillStyle' : '#fff200', 'text' : 'Drink'},
     //{'fillStyle' : '#00aef0', 'text' : 'Drink'}
  ],
  'animation' :           // Specify the animation to use.
  {
      'type'     : 'spinToStop',
      'duration' : 10,    // Duration in seconds.
      'spins'    : 3,     // Default number of complete spins.
      'callbackFinished' : alertPrize,
      'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
      'soundTrigger'     : 'pin',        // Specify pins are to trigger the sound, the other option is 'segment'.
      'callbackAfter' : drawTriangle
    },
  'pins' :				// Turn pins on.
  {
      'number'     : 20,
      'fillStyle'  : 'silver',
      'outerRadius': 4,
  }
});

//Draw the triangle pointer to the canvas for indicating wheel position
drawTriangle();
 
function drawTriangle()
{
    // Get the canvas context the wheel uses.
    let ctx = theWheel.ctx;

    ctx.strokeStyle = 'navy';     // Set line colour.
    ctx.fillStyle   = 'yellow';     // Set fill colour.
    ctx.lineWidth   = 2;
    ctx.beginPath();              // Begin path.
    ctx.moveTo(200, 0);           // Move to initial position.
    ctx.lineTo(250, 0);           // Draw lines to make the shape.
    ctx.lineTo(225, 50);
    ctx.lineTo(200, 0);
    ctx.stroke();                 // Complete the path by stroking (draw lines).
    ctx.fill();                   // Then fill.
}

// Loads the tick audio sound in to an audio object.
let audio = new Audio('tick.mp3');

// This function is called when the sound is to be played.
function playSound()
{
  // Stop and rewind the sound if it already happens to be playing.
  audio.pause();
  audio.currentTime = 0;

  // Play the sound.
  audio.play();
}

// Vars used by the code in this page to do power controls.
let wheelPower    = 0;
let wheelSpinning = false;

// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------

document.getElementById('pw1').addEventListener('click', function() { powerSelected(1); });
document.getElementById('pw2').addEventListener('click', function() { powerSelected(2); });
document.getElementById('pw3').addEventListener('click', function() { powerSelected(3); });
powerSelected(1);
function powerSelected(powerLevel)
{
  // Ensure that power can't be changed while wheel is spinning.
  if (wheelSpinning == false) {
      // Reset all to grey incase this is not the first time the user has selected the power.
      document.getElementById('pw1').className = "";
      document.getElementById('pw2').className = "";
      document.getElementById('pw3').className = "";

      // Now light up all cells below-and-including the one selected by changing the class.
      if (powerLevel >= 1) {
          document.getElementById('pw1').className = "pw1";
      }

      if (powerLevel >= 2) {
          document.getElementById('pw2').className = "pw2";
      }

      if (powerLevel >= 3) {
          document.getElementById('pw3').className = "pw3";
      }

      // Set wheelPower var used when spin button is clicked.
      wheelPower = powerLevel;

      // Light up the spin button by changing it's source image and adding a clickable class to it.
      document.getElementById('spin_button').src = "spin_on.png";
      document.getElementById('spin_button').className = "clickable";
  }
}

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
document.getElementById('spin_button').addEventListener('click', function() { startSpin(); });
function startSpin()
{
  // Ensure that spinning can't be clicked again while already running.
  if (wheelSpinning == false) {
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.
      // Based on the power level selected adjust the number of spins for the wheel, the more times is has
      // to rotate with the duration of the animation the quicker the wheel spins.
      if (wheelPower == 1) {
          theWheel.animation.spins = 3;
      } else if (wheelPower == 2) {
          theWheel.animation.spins = 6;
      } else if (wheelPower == 3) {
          theWheel.animation.spins = 10;
      }

      // Disable the spin button so can't click again while wheel is spinning.
      document.getElementById('spin_button').src       = "spin_off.png";
      document.getElementById('spin_button').className = "";

      //Change winning segment to be less random
      // Get random angle inside specified segment of the wheel.
      /*let chance = Math.random();
      if(chance < 0.42)
      {
        let segmentNumber = 6;
        let stopAt = theWheel.getRandomForSegment(segmentNumber);
   
        // Important thing is to set the stopAngle of the animation before stating the spin.
        theWheel.animation.stopAngle = stopAt;
      }*/

      // Begin the spin animation by calling startAnimation on the wheel object.
      theWheel.startAnimation();
      drawTriangle();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      wheelSpinning = true;
  }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel()
{
  theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
  theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
  theWheel.draw();                // Call draw to render changes to the wheel.

  //document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
  //document.getElementById('pw2').className = "";
  //document.getElementById('pw3').className = "";

  wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize(indicatedSegment)
{
  // Just alert to the user what happened.
  // In a real project probably want to do something more interesting than this with the result.
  if (indicatedSegment.text == 'Jake Drink') {
      alert('Sending alert to Jake!');
  } else {
      alert("No Drink for Jake");
  }
  wheelSpinning = false;
  document.getElementById('spin_button').src = "spin_on.png";
  document.getElementById('spin_button').className = "clickable";
  theWheel.animation.stopAngle = null;
}