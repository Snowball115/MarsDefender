export class Input {

    public KEY_UP: boolean;
    public KEY_LEFT: boolean;
    public KEY_RIGHT: boolean;
    public KEY_DOWN: boolean;

    constructor() {

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.checkKeys(e);
        });

        document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.pause(e);
        });
    }

    private checkKeys(e: KeyboardEvent): void {

        if (e.key == 'ArrowUp') this.KEY_UP = true;
        if (e.key == 'ArrowLeft') this.KEY_LEFT = true;
        if (e.key == 'ArrowRight') this.KEY_RIGHT = true;
        if (e.key == 'ArrowDown') this.KEY_DOWN = true;
    }

    private pause(e: KeyboardEvent): void {

        if (e.key == 'ArrowUp') this.KEY_UP = false;
        if (e.key == 'ArrowLeft') this.KEY_LEFT = false;
        if (e.key == 'ArrowRight') this.KEY_RIGHT = false;
        if (e.key == 'ArrowDown') this.KEY_DOWN = false;
    }
}