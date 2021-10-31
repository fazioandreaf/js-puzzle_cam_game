let VIDEO= null;
let CANVAS= null;
let CONTEXT= null;
let SCALE=0.9;
let SIZE= {x:0,y:0,width:0,height:0, rows:3, columns:3};
let PIECES= [];

let SELECTED_PIECE=null;


function main() {
    CANVAS=document.getElementById('myCanvas');
    CONTEXT=CANVAS.getContext('2d');
    addEventListeners();

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
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CONTEXT.globalAlpha=0.5;
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

function randomizePieces() {
    for(let i=0;i<PIECES.length;i++) {
    let loc={
        x:Math.random()*(CANVAS.width-PIECES[i].width),
        y:Math.random()*(CANVAS.height-PIECES[i].height),
        }
            PIECES[i].x=loc.x;
            PIECES[i].y=loc.y;
    }
}

function addEventListeners() {
    CANVAS.addEventListener('mousedown', onMouseDown);
    CANVAS.addEventListener('mousemove', onMouseMove);
    CANVAS.addEventListener('mouseup', onMouseUp);
}

function getPressedPiece(loc) {
    for(let i=0; i<PIECES.length; i++) {
        if((loc.x>PIECES[i].x && loc.x<(PIECES[i].x+PIECES[i].width)) && (loc.y>PIECES[i].y && loc.y<(PIECES[i].y+PIECES[i].height)))
        return PIECES[i];
    }
    return null;
}

function onMouseDown(e) {
    SELECTED_PIECE=getPressedPiece(e);
    if(SELECTED_PIECE != null) {
        SELECTED_PIECE.offset={
            x:e.x-SELECTED_PIECE.x,
            y:e.y-SELECTED_PIECE.y,
        }
    }
}
function onMouseMove(e) {
    if(SELECTED_PIECE != null) {
        SELECTED_PIECE.x=e.x-SELECTED_PIECE.offset.x;
        SELECTED_PIECE.y=e.y-SELECTED_PIECE.offset.y;
    }
}
function onMouseUp(e) {
    if(SELECTED_PIECE.isClose()) {
        SELECTED_PIECE.snap();
    }
    SELECTED_PIECE=null;
}


class Piece {
    constructor(rowIndex,collIndex) {
        this.rowIndex=rowIndex;
        this.collIndex=collIndex;
        this.x=SIZE.x+SIZE.width*this.collIndex/SIZE.columns;
        this.y=SIZE.y+SIZE.height*this.rowIndex/SIZE.rows;
        this.width=SIZE.width/SIZE.columns;
        this.height=SIZE.height/SIZE.rows;
        this.xCorrect=this.x,
        this.yCorrect=this.y
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
            this.height
            )
        context.rect(this.x, this.y, this.width, this.height);
        context.stroke();
    }
    isClose() {
        if(distance({x:this.x, y:this.y},{x:this.xCorrect, y:this.yCorrect})< this.width/3) {
            return true;
        }
        return false;
    }
    snap() {
        this.x=this.xCorrect;
        this.y=this.yCorrect;
    }
}
function distance(p1,p2) {
    return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y))
}