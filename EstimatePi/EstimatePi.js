// get HTML canvas by id
const canvas=document.getElementById("EstPI");
// context 2D
const ctx=canvas.getContext("2d");
document.getElementById("counter").value=0;
document.getElementById("avg").value=0;

// Load window
window.onload=estimatePIVal();

// Initiate canvas
function initCanvas() {
  // get canvas length for drawing
  const L=canvas.width;
  
  // clear canvas
  ctx.clearRect(0, 0, L, L);
  // clear pi estimate value
  document.getElementById("piVal").value="";
  
  // circle end angle
  const e=2*Math.PI;
  // from centre of canvas, draw circle with radius half of canvas
  drawCircle(ctx,L/2,L/2,L/2,e);
  // Draw dimensions
  ctx.fillStyle="rgb(0,0,0,1)";
  drawDim(ctx);
  
}

function clearBoard() {
  initCanvas();
  // reset values
  document.getElementById("counter").value=0;
  document.getElementById("avg").value=0;
}

// Estimate PI value
function estimatePIVal () {
  // Clear canvas
  initCanvas();

  // get canvas length for drawing
  const L=canvas.width;
  // circle end angle
  const e=2*Math.PI;

  // Monte Carlo Method
  // draw random dots, and estimate pi from number of dots in circle and number of dots in canvas
  const dotCnt=document.getElementById("dotNum").value; //initiate number of dots (the more the better)
  var inCircleCnt=0;
  ctx.fillStyle="rgb(89,89,89,0.2)";
  r=0.5; // dot radius
  for (let i=0; i<dotCnt; i++) {
    x=Math.random()*L; // dot x position
    y=Math.random()*L; // dot y position
    drawDot(ctx,x,y,r,e);
    // if dot in circle
    if (((x-L/2)**2+(y-L/2)**2)<=(L/2)**2) {
      inCircleCnt+=1;
    }
  }

  // Estimate Pi value
  const estimatePI=inCircleCnt*4/dotCnt;
  let counter=parseInt(document.getElementById("counter").value);
  let avg=parseFloat(document.getElementById("avg").value);
  // write value to output box
  document.getElementById("piVal").value=estimatePI;
  
  avg=(avg*counter+estimatePI)/(counter+1);
  counter+=1;
  document.getElementById("avg").value=avg;
  document.getElementById("counter").value=counter;
}

// draw circle on canvas
function drawCircle(ctx, x, y, r, e) {
  ctx.beginPath();
  ctx.arc(x,y,r,0,e);
  ctx.stroke();
}

// draw dot on canvas
function drawDot (ctx, x, y, r, e) {
  ctx.beginPath();
  ctx.arc(x,y,r,0,e);
  ctx.fill();
}

// draw line
function drawLine (ctx, fromX, fromY, toX, toY) {
  ctx.beginPath();
  ctx.moveTo(fromX,fromY);
  ctx.lineTo(toX,toY);
  ctx.stroke();
}

// draw scale
function drawDim (ctx) {
  // font size
  ctx.font="20px Arial";
  // canvas length (l)
  ctx.fillText("L",198,20);
  // draw line with arrow
  drawLine(ctx, 0,10,195,10);
  drawLine(ctx, 0,10,5,5);
  drawLine(ctx,0,10,5,15);
  drawLine(ctx,205,10,400,10);
  drawLine(ctx,395,5,400,10);
  drawLine(ctx,395,15,400,10);
  
  // circle radius (r)
  ctx.fillText("L/2",300,195);
  // draw line with arrow
  drawLine(ctx,200,200,400,200);
  //drawLine(305,200,400,200);
  drawLine(ctx,395,195,400,200);
  drawLine(ctx,395,205,400,200);
}