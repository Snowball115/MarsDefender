var windowHeight = $(window).height();
var windowWidth = $(window).width();
var canvas = $("<canvas></canvas>");
var context = canvas[0].getContext("2d");
var bg = new Image();
var tank = new Image();
var enemy = new Image();
var enemyShips = new Array();
var building = new Image();
var buildings = new Array();
var projectile = new Image();
var projectiles = new Array();
var hitEffect = new Image();
var hits = new Array();
bg.src = "img/planet.png";
tank.src = "img/pixel-tank_b.png";
enemy.src = "img/ships.png";
building.src = "img/dome.png";
projectile.src = "img/projectile.png";
hitEffect.src = "img/hitEffect.png";

var highscores;
var userNameText;
var playerStats = {};
var isRunning = true;
var playerSpeed = 10;
var minShipSpeed = 1.5;
var maxShipSpeed = 4.0;
var projectileSpeed = 15;
var globalScore = 0;
var globalHealth = 5;
var shootTimer = 0;
var spawnTimer = 0;

// Set difficulty level
if (JSON.parse(localStorage.getItem("currentDifficulty") == "easy")){
    console.log("easy");
    minShipSpeed = 1.5;
    maxShipSpeed = 2.0;
}
else if (JSON.parse(localStorage.getItem("currentDifficulty") == "hard")){
    console.log("hard");
    minShipSpeed = 1.5;
    maxShipSpeed = 4.0;
}

$(window).load(function()
{
    // ====== CANVAS SETUP ======

    if(localStorage["highscores"] !== undefined) {
        highscores = JSON.parse(localStorage["highscores"]);
    }
    else {
        highscores = [];
    }

    $("body").append(canvas);
    
    canvas.attr({
        "width": 1024,
        "height": 768,
        "style": "background-color: DimGray"
    })

    // ====== HELPER FUNCTIONS ======

    function collisionDetection(objA, objB){
        if (objA == null || objB == null) return;
        else if (objA.posX < objB.posX + objB.width && 
                objA.posX + objA.width > objB.posX && 
                objA.posY < objB.posY + objB.height && 
                objA.posY + objA.height > objB.posY){
                return true;
        }
        return false;
    }

    function randomNum(min, max){
        return min + Math.random() * (max - min);
    }

    // ====== CANVAS TEXT ======

    userNameText = localStorage.getItem("currentUser");

    function drawText(){
        context.font = "30px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("Score: " + globalScore, 100, 50);
        context.fillText("Health: " + globalHealth, 900, 50);

        if (userNameText == ""){
            localStorage.setItem("currentUser", "Unknown");
        }
        context.fillText(localStorage.getItem("currentUser"), 500, 50);
    }
    
    // ====== ENTITIES CONSTRUCTORS ======

    function Background(image){
        this.width = image.width;
        this.height = image.height;
        this.posX = 0;
        this.posY = 0;
        this.image = image;

        this.draw = function(){
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        }
    }

    function Player(image, x, y){
        this.maskX = 0;
        this.width = image.width / 2;
        this.height = image.height;
        this.posX = x;
        this.posY = y;
        this.image = image;

        this.draw = function(){
            context.drawImage(this.image, this.maskX, 10, this.width, this.height, this.posX, this.posY, this.width, this.height);
        }

        this.move = function(){
            if (rightKey && player.posX < 955){
                this.posX += playerSpeed;
                this.maskX = this.width;
            }
            else if (leftKey && player.posX >= 0){
                this.posX -= playerSpeed;
                this.maskX = 0;
            }
        }
    }

    function Projectile(x, y){
        this.posX = x;
        this.posY = y;
        this.width = 50;
        this.height = 50;

        this.draw = function(){
            context.drawImage(projectile, this.posX, this.posY, this.width, this.height);
        }

        this.move = function(){
            this.posY -= projectileSpeed;
        }

        this.die = function(index){
            projectiles.splice(index, 1);
        }
    }

    function Hit(x, y){
        this.posX = x;
        this.posY = y;
        this.width = 50;
        this.height = 50;
        this.timer = 0;

        this.draw = function(){
            this.timer++
            context.drawImage(hitEffect, this.posX, this.posY, this.width, this.height);
            if (this.timer > 5) hits.splice(this, 1);
        }
    }

    function Building(image, x, y){
        this.width = image.width;
        this.height = image.height;
        this.posX = x;
        this.posY = y;
        this.image = image;

        this.draw = function(){
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        }
    }

    function Enemy(image, x, y, maskY){
        this.maskX = 0;
        this.maskY = maskY;
        this.width = image.width;
        this.height = image.height / 9;
        this.posX = x;
        this.posY = y;
        this.image = image;
        this.enemySpeed = randomNum(minShipSpeed, maxShipSpeed);
        this.health = 2;

        this.draw = function(){
            context.drawImage(this.image, this.maskX, this.maskY, this.width, this.height, this.posX, this.posY, this.width, this.height);
        }

        this.move = function(){
            this.posY += this.enemySpeed;
        }

        this.die = function(index){
            enemyShips.splice(index, 1);
        }
    }

    // ====== ENTITY SPAWNING FUNCTIONS ======

    function createEnemies(count){
        for (var i = 0; i < count; i++){
            enemyShips.push(new Enemy(enemy, i * 200, -300, Math.floor(Math.random() * 9) * 175));
        }
    }

    function createBuildings(count){
        for (var i = 0; i < count; i++){
            buildings.push(new Building(building, i * 200, randomNum(550, 650)));
        }
    }

    // ====== DRAW GAME ======

    var background = new Background(bg);
    var player = new Player(tank, 500, 715);

    createEnemies(5);
    createBuildings(5);

    function drawGame(){
        context.clearRect(0, 0, canvas.width(), canvas.height());
        background.draw();
        
        for (var i = 0; i < buildings.length; i++){
            buildings[i].draw();
        }

        player.move();
        player.draw();
        
        spawnTimer++;
        if (spawnTimer > 180){
            createEnemies(randomNum(3, 5));
            spawnTimer = 0;
        }

        for (var i = 0; i < enemyShips.length; i++){
            enemyShips[i].move();
            enemyShips[i].draw();
        }

        shootTimer++;
        if (upKey && shootTimer > 18){
            projectiles.push(new Projectile(player.posX, player.posY - 20));
            shootTimer = 0;
        }

        for (var i = 0; i < projectiles.length; i++){
            projectiles[i].move();
            projectiles[i].draw();
        }

        if (hits.length > 0){
            for (var i = 0; i < hits.length; i++){
                hits[i].draw();
            }
        }
    }

    // ====== GAME LOGIC ======

    function checkCollisions(){
        // if projectile hits enemy
        for (var i = 0; i < projectiles.length; i++){

            if (projectiles[i].posY < 5){
                projectiles[i].die(i);
                break;
            }

            for (var j = 0; j < enemyShips.length; j++){

                if (collisionDetection(enemyShips[j], projectiles[i])){

                    hits.push(new Hit(projectiles[i].posX, projectiles[i].posY));
                    projectiles[i].die();
                    enemyShips[j].health--;

                    if (enemyShips[j].health <= 0){
                        enemyShips[j].die(j);
                        globalScore++;
                        break;
                    }
                }
            }
        }
    }

    function checkOutOfBounds(){
        // if ship flies out of screen
        for (var i = 0; i < enemyShips.length; i++){
            if (enemyShips[i].posY > 700){
                enemyShips[i].die(i);
                globalHealth--;
            }
        }
    }

    function checkGameOver(){
        if (globalHealth <= 0){
            context.font = "60px Arial";
            context.shadowOffsetX = 5;
            context.shadowOffsetY = 5;
            context.shadowBlur = 1;
            context.shadowColor = "black";
            context.fillText("GAME OVER", 500, 350);
            isRunning = false;

            playerStats.name = localStorage.getItem("currentUser");
            playerStats.score = globalScore;
            playerStats.difficulty = localStorage.getItem("currentDifficulty");
            highscores.push(playerStats);
            localStorage.setItem("highscores", JSON.stringify(highscores));
        }
    }
    
    // ====== INPUT ======
    var leftKey = false;
    var upKey = false;
    var rightKey = false;
    var downKey = false;

    function checkKeys(e){
        if (e.which == 37) leftKey = true;
        if (e.which == 38) upKey = true;
        if (e.which == 39) rightKey = true;
        if (e.which == 40) downKey = true;
    }

    function pause(e){
        if (e.which == 37) leftKey = false;
        if (e.which == 38) upKey = false;
        if (e.which == 39) rightKey = false;
        if (e.which == 40) downKey = false;
    }

    $(document).keydown(checkKeys);
    $(document).keyup(pause);

    // ====== GAME LOOP ======

    function loop(){
        if (isRunning){
            drawGame();
            checkCollisions();
            checkOutOfBounds();
            checkGameOver();
            drawText();
            requestAnimationFrame(loop);
        }
    }
    requestAnimationFrame(loop);
});
