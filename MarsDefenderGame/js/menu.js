var currentUserName = "";
var currentDifficulty = "";

var posX = 0;
var interval;

function saveUserName(){
    currentUserName = document.getElementById("userID").value;
    localStorage.setItem("currentUser", currentUserName);
}

function saveDifficulty(){
    currentDifficulty = document.getElementById("difficultySetting").value;
    localStorage.setItem("currentDifficulty", currentDifficulty);
}

function saveSettings(){
    saveUserName();
    saveDifficulty();
}

function randomNum(min, max){
    return min + Math.random() * (max - min);
}

function moveActor(){
    posX += 0.1;
    $(".shipActor").css("left", posX + "%");

    if (posX > 100){
        $(".shipActor").css("top", randomNum(10, 90) + "%");
        posX = -10;
    }
}

interval = setInterval(moveActor, 10);