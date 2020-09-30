
function init() {
    draw();
}

/**
 * Start drawing
 */
player.lockX = Math.floor(500*Math.random() + 10);
player.lockY = Math.floor(500*Math.random() + 10);

function draw() {
    //clar transform
    context.setTransform(1,0,0,1,0,0)
    //clear rect
    context.clearRect(0,0,canvas.width,canvas.height);    
    //clamp the camera to the palyer
    const camX = -player.lockX + canvas.width/2;
    const camY = -player.lockY + canvas.width/2;
    context.translate(camX, camY);
    context.beginPath();
    context.fillStyle = "rgb(255,0,0)";
    context.arc(player.lockX,player.lockY, 50, 0, Math.PI * 2);
    //context.arc(200,200, 50, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "rgb(0,255,0)";
    context.stroke();

    // draw all the orbs
    orbs.forEach((orb) => {
        context.beginPath();
        context.fillStyle = orb.color;
        context.arc(orb.locX,orb.locY,orb.radius, 0, Math.PI*2);
        context.fill();
    });

    requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove',(event)=>{
    // console.log(event)
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
    if(angleDeg >= 0 && angleDeg < 90){
        // console.log("Mouse is in the lower right quad")
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90);
    }else if(angleDeg >= 90 && angleDeg <= 180){
        // console.log("Mouse is in the lower left quad")
        xVector = -(angleDeg-90)/90;
        yVector = -(1 - ((angleDeg-90)/90));
    }else if(angleDeg >= -180 && angleDeg < -90){
        // console.log("Mouse is in the upper left quad")
        xVector = (angleDeg+90)/90;
        yVector = (1 + ((angleDeg+90)/90));
    }else if(angleDeg < 0 && angleDeg >= -90){
        // console.log("Mouse is in the upper right quad")
        xVector = (angleDeg+90)/90;
        yVector = (1 - ((angleDeg+90)/90));
    }

    player.xVector = xVector;
    player.yVector = yVector;
    
    speed = 10;
    xV = xVector;
    yV = yVector;

    if((player.lockX < 5 && player.xVector<0) || (player.lockX > 500) && (xV > 0)) {
        player.lockY -= speed * yV;
    } else if ((player.lockY < 5 && yV > 0) || (player.lockY > 500) && (yV < 0)) {
        player.lockX += speed * xV;
    } else {
        player.lockX += speed * xV;
        player.lockY -= speed * yV;
    }

})