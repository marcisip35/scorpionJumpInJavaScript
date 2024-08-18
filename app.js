const gameCanvas = document.getElementById("gameCanvas");
const textScore = document.getElementById("textScore");
const resetButton = document.getElementById("resetButton");
let ctx = gameCanvas.getContext("2d");
let score = 0;

const canvasWidth = gameCanvas.width;
const canvasHeight = gameCanvas.height;

const playerImage = new Image();
playerImage.src = "./assets/scorpion.png";

const cactusImage = new Image();
cactusImage.src = "./assets/cactus.png";

let cactusSpeed = 1;
const cactusHeight = 15;
const cactusWidth = 10;
let cactusDirection;
const cactusStart = calculateCactusStart();
function calculateCactusStart(){
    let random = Math.floor(Math.random() * 2);
    if(random == 0){
        return canvasWidth - cactusWidth;
    } else {
        return 0;
    }
};

let firstInstance = false;
window.addEventListener("keydown", jumpFunction);

const player = {
    x: canvasWidth / 2 - 10,
    y: canvasHeight - 40,
    width: 20,
    height: 40,
    color: "black",
};

const cactus = {
    x: cactusStart,
    y: canvasHeight - cactusHeight,
    width: cactusWidth,
    height: cactusHeight,
    direction: 1,
    color: "purple",
}

gameStart();

function gameStart(){
    scoreFunction();
    nextTick();
}

function nextTick(){
    setTimeout(()=>{
        clearBoard();
        updatePlayer();
        drawPlayer();
        drawCactus();
        moveCactus();
        checkCollision();
        scoreFunction();
        nextTick();
    }, 10);
}

function clearBoard(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function scoreFunction(){
    textScore.innerText = `Score: ${score}`;
}

//Scorpion
function drawPlayer(){
    ctx.fillStyle = player.color;
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function updatePlayer(){
    if(player.y + player.height < canvasHeight){
        player.y += 1;
    }
}

function jumpFunction(event){
    let keyPressed = event.keyCode;
    let horizontalMovement = 10;

    //Up
    if(keyPressed === 32 && player.y === canvasHeight - player.height){
        player.y -= 60;
    }

    //Left
    if(keyPressed === 65 && player.x > 0){
        player.x -= 20;
    }

    //Right
    if(keyPressed === 68 && player.x < canvasWidth - player.width){
        player.x += 20;
    }
}

//Cactus
function drawCactus(){
    ctx.fillStyle = cactus.color;
    ctx.drawImage(cactusImage, cactus.x, cactus.y, cactus.width, cactus.height);
}

function moveCactus() {
    let speedIncrement = 0.1;
    // Reverse the direction when the cactus hits the left or right wall
    if (cactus.x <= 0) {
        cactus.direction = 1; // Move right
        if(firstInstance){
            score++;
            cactusSpeed += speedIncrement;
        }
        firstInstance = true;
    } else if (cactus.x >= canvasWidth - cactus.width) {
        cactus.direction = -1; // Move left
        if(firstInstance){
            score++;
            cactusSpeed += speedIncrement;
        }
        firstInstance = true;
    }

    // Move the cactus according to its direction
    cactus.x += cactus.direction * cactusSpeed;
}

function checkCollision(){
    if(player.x < cactus.x + cactus.width && player.x + player.width > cactus.x && player.y + player.height > cactus.y){
        resetGame();
    }
}

resetButton.addEventListener("click", resetGame);

function resetGame() {
    score = 0;
    firstInstance = false;
    cactusSpeed = 1;

    player.x = canvasWidth / 2 - player.width/2;
    player.y = canvasHeight - player.height;

    cactus.x = calculateCactusStart();
    clearBoard();
}
