import { randomNum } from '../utility/helpers';
import { Settings } from '../data/settings';
import { GameCache } from '../data/gameCache';
import { AEntity } from './entity';
import { _input } from '../main';

// == Background image class
export class E_Background extends AEntity {

    constructor(image: HTMLImageElement) {
        super(image, 0, 0);
    }
}


// == Player class (tank)
export class E_Player extends AEntity {

    constructor(image: HTMLImageElement, x: number, y: number) {

        super(image, x, y);
        this.maskX = 0;
        this.width = image.width / 2;
    }

    public move() {

        if (_input.KEY_RIGHT && this.posX < 955) {
            this.posX += Settings.PLAYER_SPEED;
            this.maskX = this.width;
        }
        else if (_input.KEY_LEFT && this.posX >= 0) {
            this.posX -= Settings.PLAYER_SPEED;
            this.maskX = 0;
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.image, this.maskX, 10, this.width, this.height, this.posX, this.posY, this.width, this.height);
    }
}


// == Projectiles that the player can shoot
export class E_Projectile extends AEntity {

    constructor(image: HTMLImageElement, x: number, y: number) {

        super(image, x, y);
        this.width = 50;
        this.height = 50;
    }

    public move(): void {
        this.posY -= Settings.PROJECTILE_SPEED;
    }

    public die(): void {
        GameCache.ARR_PROJECTILES.splice(GameCache.ARR_PROJECTILES.indexOf(this, 0), 1);
    }
}


// == Projectile hit effect on enemy ships
export class E_Hit extends AEntity {

    private timer: number;

    constructor(image: HTMLImageElement, x: number, y: number) {

        super(image, x, y);
        this.width = 50;
        this.height = 50;
        this.timer = 0;
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.timer++
        context.drawImage(GameCache.IMG_HIT, this.posX, this.posY, this.width, this.height);
        if (this.timer > 5) GameCache.ARR_HITS.splice(GameCache.ARR_HITS.indexOf(this, 0), 1);
    }
}


// == Building class
export class E_Building extends AEntity {

    constructor(image: HTMLImageElement, x: number, y: number) {
        super(image, x, y);
    }
}


// == Enemy class
export class E_Enemy extends AEntity {

    private enemySpeed: number;
    private health: number;

    get Health(): number { return this.health; }

    constructor(image: HTMLImageElement, x: number, y: number, maskY: number) {

        super(image, x, y);
        this.maskX = 0;
        this.maskY = maskY;
        this.height = this.image.height / 9;
        this.enemySpeed = randomNum(Settings.MIN_SHIP_SPEED, Settings.MAX_SHIP_SPEED);
        this.health = Settings.ENEMY_HEALTH;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.image, this.maskX, this.maskY, this.width, this.height, this.posX, this.posY, this.width, this.height);
    }

    public move(): void {
        this.posY += this.enemySpeed;
    }

    public takeDamage(damage: number): void {
        this.health -= damage;
    }

    public die(): void {
        GameCache.ARR_ACTIVE_ENEMIES.splice(GameCache.ARR_ACTIVE_ENEMIES.indexOf(this, 0), 1);
    }
}