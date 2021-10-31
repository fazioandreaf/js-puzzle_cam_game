let VIDEO= null;
let CANVAS= null;
let CONTEXT= null;
let SCALE=0.9;
let SIZE= {x:0,y:0,width:0,height:0}


function main() {
    CANVAS=document.getElementById('myCanvas');
    CONTEXT=CANVAS.getContext('2d');
    CANVAS.width=window.innerWidth;
    CANVAS.height=window.innerHeight;


    let promise=navigator.mediaDevices.getUserMedia({video:true});
    promise.then((signal) => {
        VIDEO=document.createElement('video');
        VIDEO.srcObject=signal;
        VIDEO.play();

        VIDEO.onloadeddata= function() {
            handleResize();
            window.addEventListener('resize', handleResize)
            updateCanvas();
        }
    })
    .catch((e)=> alert('Camera errore: ' + e))
}

function handleResize() {
    let resize=SCALE*Math.min(window.innerWidth/VIDEO.videoWidth, window.innerHeight/VIDEO.videoHeight);
    SIZE.width=resize*VIDEO.videoWidth;
    SIZE.height=resize*VIDEO.videoHeight;
    SIZE.x=(window.innerWidth - SIZE.width)/2;
    SIZE.y=(window.innerHeight - SIZE.height)/2;
}
function updateCanvas() {
    CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);
    window.requestAnimationFrame(updateCanvas);
}