export class Settings {

    public static PLAYER_HEALTH = 5;
    public static PLAYER_SPEED = 7;
    public static PROJECTILE_SPEED = 12;
    public static ENEMY_HEALTH = 2;
    public static MIN_SHIP_SPEED = 0.9;
    public static MAX_SHIP_SPEED = 1.5;

    public static setDifficulty(): void {

        // Set difficulty level
        switch (localStorage.getItem('currentDifficulty')) {

            case 'Easy':
                Settings.ENEMY_HEALTH = 2;
                Settings.MIN_SHIP_SPEED = 0.9;
                Settings.MAX_SHIP_SPEED = 1.5;
                break;

            case 'Medium':
                Settings.ENEMY_HEALTH = 3;
                Settings.MIN_SHIP_SPEED = 1.5;
                Settings.MAX_SHIP_SPEED = 1.8;
                break;

            case 'Hard':
                Settings.ENEMY_HEALTH = 3;
                Settings.MIN_SHIP_SPEED = 1.5;
                Settings.MAX_SHIP_SPEED = 3.0;
                break;
        }
    }
}