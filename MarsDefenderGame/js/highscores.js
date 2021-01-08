var highscores = JSON.parse(localStorage.getItem("highscores"));

function clearScores(){
    localStorage.clear();
}

$(document).ready(function(){

    function getHighscores(){
        for (var i = 0; i < 10; i++) {
            if (highscores[i] == undefined) return;         
            $("table").append(`<tr>
                                <td>${highscores[i]["name"]}</td>
                                <td>${highscores[i]["score"]}</td>
                                <td>${highscores[i]["difficulty"]}</td>
                                </tr>`)
        }
    }
    
    getHighscores();
});
