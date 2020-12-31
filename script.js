//const headImg=document.getElementById("headImg");
//headImg.width=window.innerWidth;
function responsiveNav() {
    var x = document.getElementById("myTopnav");
    if (x.className === "navbar") {
      x.className += " responsive";
    } else {
      x.className = "navbar";
    }
  }