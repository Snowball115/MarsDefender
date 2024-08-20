// == Base class for every entity in the game
export abstract class AEntity {

    protected image: HTMLImageElement;
    protected width: number;
    protected height: number;
    protected posX: number;
    protected posY: number;
    protected maskX: number;
    protected maskY: number;

    get Height(): number { return this.height; }
    get Width(): number { return this.width; }
    get PosX(): number { return this.posX; }
    get PosY(): number { return this.posY; }

    constructor(image: HTMLImageElement, x: number, y: number) {

        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.posX = x;
        this.posY = y;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
}