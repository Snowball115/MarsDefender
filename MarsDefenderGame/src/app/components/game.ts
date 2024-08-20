import { collisionDetection, getAppState, randomNum } from '../utility/helpers';
import { GameCache } from '../data/gameCache';
import { Settings } from '../data/settings';
import { _input } from '../main';
import { E_Background, E_Building, E_Enemy, E_Player, E_Hit, E_Projectile } from './entityClasses';

export class Game {

    private gameCanvas: HTMLCanvasElement;
    private gameCanvasContext: CanvasRenderingContext2D;
    private entityBG: E_Background;
    private entityPlayer: E_Player;

    private highscores: any[] = [];
    private currentUserName: string;
    private currentUserScore = 0;
    private playerHealth: number;
    private playerShootTimer = 0;
    private enemySpawnTimer = 0;

    private isRunning = true;

    constructor() {

        if (getAppState() != 'game') return;

        if (!localStorage.getItem('currentUser')) localStorage.setItem('currentUser', 'Unknown');

        this.highscores = localStorage["highscores"] !== undefined ? JSON.parse(localStorage['highscores']) : [];

        Settings.setDifficulty();

        this.currentUserName = localStorage.getItem('currentUser');
        this.playerHealth = Settings.PLAYER_HEALTH;

        this.entityBG = new E_Background(GameCache.IMG_BG);
        this.entityPlayer = new E_Player(GameCache.IMG_TANK, 500, 715);

        this.setupCanvas();

        this.createEnemies(5);
        this.createBuildings(5);

        console.log(`Start: ${this.currentUserName} | ${localStorage.getItem('currentDifficulty')}`);

        requestAnimationFrame(() => {this.gameLoop();});
    }


    private gameLoop(): void {

        if (!this.isRunning) return;

        this.drawGame();
        this.checkCollisions();
        this.checkOutOfBounds();
    
        requestAnimationFrame(() => {this.gameLoop();});
    }


    private setupCanvas(): void {

        this.gameCanvas = document.createElement('canvas');
        this.gameCanvas.width = 1024;
        this.gameCanvas.height = 768;
        this.gameCanvas.style.backgroundColor = '#424242';
        this.gameCanvasContext = this.gameCanvas.getContext('2d');

        document.querySelector('#app').append(this.gameCanvas);
    }


    private drawText(): void {

        this.gameCanvasContext.font = '30px Arial';
        this.gameCanvasContext.fillStyle = 'white';
        this.gameCanvasContext.textAlign = 'center';
        this.gameCanvasContext.fillText(`Score: ${this.currentUserScore}`, 100, 50);
        this.gameCanvasContext.fillText(`Health: ${this.playerHealth}`, 900, 50);
        this.gameCanvasContext.fillText(this.currentUserName, 500, 50);
    }


    private drawEntities(): void {

        this.entityBG.draw(this.gameCanvasContext);

        GameCache.ARR_ACTIVE_BUILDINGS.forEach((building: E_Building) => {
            building.draw(this.gameCanvasContext);
        });

        this.enemySpawnTimer++;
        if (this.enemySpawnTimer > 500){
            this.createEnemies(randomNum(3, 5));
            this.enemySpawnTimer = 0;
        }

        GameCache.ARR_ACTIVE_ENEMIES.forEach((enemy: E_Enemy) => {
            enemy.draw(this.gameCanvasContext);
            enemy.move();
        });

        this.playerShootTimer++;
        if (_input.KEY_UP && this.playerShootTimer > 25){
            this.createProjectile(1);
            this.playerShootTimer = 0;
        }

        GameCache.ARR_PROJECTILES.forEach((projectile: E_Projectile) => {
            projectile.draw(this.gameCanvasContext);
            projectile.move();
        });

        if (GameCache.ARR_HITS.length > 0) {
            GameCache.ARR_HITS.forEach((hit: E_Hit) => {
                hit.draw(this.gameCanvasContext);
            });
        }

        this.entityPlayer.draw(this.gameCanvasContext);
        this.entityPlayer.move();
    }


    private drawGame(): void {

        this.gameCanvasContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.drawEntities();
        this.drawText();
    }


    private createEnemies(count: number): void {
        for (var i = 0; i < count; i++){
            GameCache.ARR_ACTIVE_ENEMIES.push(new E_Enemy(GameCache.IMG_ENEMY, i * 200, -300, Math.floor(Math.random() * 9) * 140));
        }
    }


    private createBuildings(count: number): void {
        for (var i = 0; i < count; i++){
            GameCache.ARR_ACTIVE_BUILDINGS.push(new E_Building(GameCache.IMG_BUILDING, i * 200, randomNum(550, 650)));
        }
    }


    private createProjectile(count: number): void {
        for (var i = 0; i < count; i++) {
            GameCache.ARR_PROJECTILES.push(new E_Projectile(GameCache.IMG_PROJECTILE, this.entityPlayer.PosX, this.entityPlayer.PosY - 20));
        }
    }


    private checkCollisions(): void {

        // if projectile hits enemy
        GameCache.ARR_PROJECTILES.forEach((projectile: E_Projectile) => {

            if (projectile.PosY < 5){
                projectile.die();
                return;
            }

            GameCache.ARR_ACTIVE_ENEMIES.forEach((enemy: E_Enemy) => {

                if (collisionDetection(enemy, projectile)) {

                    GameCache.ARR_HITS.push(new E_Hit(GameCache.IMG_HIT, projectile.PosX, projectile.PosY));
                    projectile.die();
                    enemy.takeDamage(1);
                    
                    if (enemy.Health <= 0) {
                        enemy.die();
                        this.currentUserScore++;
                        return;
                    }
                }
            });
        });
    }


    private checkOutOfBounds(): void {

        // if ship flies out of screen
        GameCache.ARR_ACTIVE_ENEMIES.forEach((enemy: E_Enemy) => {

            if (enemy.PosY > 700) {
                enemy.die();
                this.playerHealth--;
                this.checkGameOver();
            }
        });
    }


    private checkGameOver(): void {

        if (this.playerHealth <= 0) {

            this.gameCanvasContext.font = '60px Arial';
            this.gameCanvasContext.shadowOffsetX = 5;
            this.gameCanvasContext.shadowOffsetY = 5;
            this.gameCanvasContext.shadowBlur = 1;
            this.gameCanvasContext.shadowColor = 'black';
            this.gameCanvasContext.fillText('GAME OVER', 500, 350);

            this.isRunning = false;

            const userStats = {
                name: this.currentUserName,
                score: this.currentUserScore,
                difficulty: localStorage.getItem('currentDifficulty')
            };

            this.highscores.push(userStats);
            localStorage.setItem('highscores', JSON.stringify(this.highscores));

            console.log(`Saved: ${userStats.name} | ${userStats.score} | ${userStats.difficulty}`);
        }
    }
}