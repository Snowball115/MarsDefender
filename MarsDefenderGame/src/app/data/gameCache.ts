import { E_Building, E_Enemy, E_Hit, E_Projectile } from '../components/entityClasses';

export class GameCache {

    // Images
    public static IMG_BG = new Image();
    public static IMG_TANK = new Image();
    public static IMG_ENEMY = new Image();
    public static IMG_BUILDING = new Image();
    public static IMG_PROJECTILE = new Image();
    public static IMG_HIT = new Image();

    // Arrays
    public static ARR_ACTIVE_BUILDINGS: E_Building[] = [];
    public static ARR_ACTIVE_ENEMIES: E_Enemy[] = [];
    public static ARR_PROJECTILES: E_Projectile[] = [];
    public static ARR_HITS: E_Hit[] = [];

    private INT_CACHE_TIMEOUT = 5000;
    private INT_CACHE_UPDATE = 100;

    private loadedImages: HTMLImageElement[] = [];
    private counterImgLoaded = 0;


    public async initGameCache(): Promise<void> {

        this.initImage(GameCache.IMG_BG, '/img/png/planet.png');
        this.initImage(GameCache.IMG_TANK, '/img/png/pixel-tank_b.png');
        this.initImage(GameCache.IMG_ENEMY, '/img/png/ships.png');
        this.initImage(GameCache.IMG_BUILDING, '/img/png/dome.png');
        this.initImage(GameCache.IMG_PROJECTILE, '/img/png/projectile.png');
        this.initImage(GameCache.IMG_HIT, '/img/png/hitEffect.png');

        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (this.counterImgLoaded == this.loadedImages.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, this.INT_CACHE_UPDATE);

            setTimeout(() => {
                clearInterval(interval);
                reject('Couldn\'t initialize GameCache');
            }, this.INT_CACHE_TIMEOUT);
        });
    }


    private initImage(img: HTMLImageElement, path: string) {

        img.src = path;

        img.addEventListener('load', () => {
            this.counterImgLoaded++;
            this.loadedImages.push(img);
        });
    }
}