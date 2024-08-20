import { getAppState } from '../utility/helpers.js';
import {
    DATA_SCORE_DELETE,
    DATA_SCORE_TABLE
} from '../data/constants.js';


export class Highscores {

    private table: HTMLElement;
    private deleteBtn: HTMLElement;
    private highscoresData;

    private TEXT_DELETED = 'Deleted all scores';

    constructor() {

        if (getAppState() != 'highscores') return;

        this.table = document.querySelector(`[${DATA_SCORE_TABLE}]`);
        this.deleteBtn = document.querySelector(`[${DATA_SCORE_DELETE}]`);
        
        this.highscoresData = JSON.parse(localStorage.getItem('highscores'));

        this.initEventListeners();

        this.getHighscores();
    }


    private initEventListeners(): void {

        this.deleteBtn.addEventListener('click', () => {
            this.clearScores();
        });
    }


    private getHighscores(): void {

        if (!this.highscoresData) return;

        for (var i = 0; i < this.highscoresData.length; i++) {

            if (this.highscoresData[i] == undefined) return;

            const dataStr = `<tr><td>${this.highscoresData[i]['name']}</td><td>${this.highscoresData[i]['score']}</td><td>${this.highscoresData[i]['difficulty']}</td></tr>`;

            this.table.insertAdjacentHTML('beforeend', dataStr);
        }
    }

    
    private clearScores(): void {

        localStorage.removeItem('highscores');

        this.table.innerHTML = this.TEXT_DELETED;
    }
}
