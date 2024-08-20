import { AEntity } from '../components/entity';

// ====== HELPER FUNCTIONS ======
export function collisionDetection(objA: AEntity, objB: AEntity) {

    if (objA == null || objB == null) return;
    else if (objA.PosX < objB.PosX + objB.Width && 
            objA.PosX + objA.Width > objB.PosX && 
            objA.PosY < objB.PosY + objB.Height && 
            objA.PosY + objA.Height > objB.PosY) {
            return true;
    }
    return false;
}


export function randomNum(min: number, max: number) {
    return min + Math.random() * (max - min);
}


export function getAppState(): string {
    return document.querySelector<HTMLElement>('#app').dataset.appState;
}