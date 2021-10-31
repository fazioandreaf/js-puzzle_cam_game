let VIDEO= null;
let CANVAS= null;
let CONTEXT= null;
let SCALE=0.9;
let SIZE= {x:0,y:0,width:0,height:0, rows:3, columns:3};
let PIECES= [];


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
            window.addEventListener('resize', handleResize);
            initializePieces(SIZE.rows, SIZE.columns);
            updateCanvas();
        }
    })
    .catch((e)=> alert('Camera errore: ' + e))
}

function handleResize() {
    CANVAS.width=window.innerWidth;
    CANVAS.height=window.innerHeight;

    let resize=SCALE*Math.min(window.innerWidth/VIDEO.videoWidth, window.innerHeight/VIDEO.videoHeight);
    SIZE.width=resize*VIDEO.videoWidth;
    SIZE.height=resize*VIDEO.videoHeight;
    SIZE.x=(window.innerWidth - SIZE.width)/2;
    SIZE.y=(window.innerHeight - SIZE.height)/2;
}
function updateCanvas() {
    CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);
    for(let i=0;i<PIECES.length;i++) {
        PIECES[i].draw(CONTEXT);
    }

    window.requestAnimationFrame(updateCanvas);
}

function initializePieces(rows, columns) {
    SIZE.columns= columns;
    SIZE.rows= rows;
    PIECES=[];
    for(let i=0;i<SIZE.rows;i++) {
        for(let j=0;j<SIZE.columns;j++){
            PIECES.push(new Piece(i,j));
        }
    }
}

class Piece {
    constructor(rowIndex,collIndex) {
        this.rowIndex=rowIndex;
        this.collIndex=collIndex;
        this.x=SIZE.x+SIZE.width*this.collIndex/SIZE.columns;
        this.y=SIZE.y+SIZE.height*this.rowIndex/SIZE.rows;
        this.width=SIZE.width/SIZE.columns;
        this.height=SIZE.height/SIZE.rows;
    }

    draw(context) {
        context.beginPath();
        context.drawImage(VIDEO,
            this.collIndex*VIDEO.videoWidth/SIZE.columns, 
            this.rowIndex*VIDEO.videoHeight/SIZE.rows,
            VIDEO.videoWidth/SIZE.columns, 
            VIDEO.videoHeight/SIZE.rows,
            this.x, 
            this.y, 
            this.width, 
            this.height)
        context.rect(this.x, this.y, this.width, this.height);
        context.stroke();
    }
}