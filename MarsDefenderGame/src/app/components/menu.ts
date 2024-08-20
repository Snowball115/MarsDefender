import { getAppState, randomNum } from '../utility/helpers.js';
import {
    DATA_MENU_SHIP,
    DATA_MENU_START
} from '../data/constants.js';

export class Menu {

    private startBtn: HTMLElement;
    private shipActor: HTMLElement;
    private shipPosX: number;
    private currentUserName: string;
    private currentDifficulty: string;

    constructor() {

        if (getAppState() != 'menu') return;

        this.startBtn = document.querySelector(`[${DATA_MENU_START}]`);
        this.shipActor = document.querySelector(`[${DATA_MENU_SHIP}]`);
        this.shipPosX = 0;

        this.initEventListeners();

        setInterval(() => {this.moveActor();}, 10);
    }


    private initEventListeners(): void {

        this.startBtn.addEventListener('click', () => {
            this.saveUserName();
            this.saveDifficulty();
        });
    }


    private saveUserName(): void {
        
        this.currentUserName = document.querySelector<HTMLInputElement>('#userID').value;
        localStorage.setItem('currentUser', this.currentUserName);
    }
    

    private saveDifficulty(): void {

        document.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((radio: HTMLInputElement) => {
            if (radio.checked) {
                this.currentDifficulty = radio.value;
                localStorage.setItem('currentDifficulty', this.currentDifficulty);
            }
        });
    }


    private moveActor(): void {

        this.shipPosX += 0.1;

        this.shipActor.style.left = `${this.shipPosX}%`;
    
        if (this.shipPosX > 100){
            this.shipActor.style.top = `${randomNum(10, 90)}%`;
            this.shipPosX = -10;
        }
    }
}