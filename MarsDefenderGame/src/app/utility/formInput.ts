import { CLASS_FILLED } from '../data/constants';

export class FormInput {

    private inputElements: NodeListOf<HTMLInputElement>;

    constructor() {

        this.inputElements = document.querySelectorAll<HTMLInputElement>('input[type="text"]');

        if (this.inputElements.length <= 0) return;

        this.inputElements.forEach((input: HTMLInputElement) => {
            input.addEventListener('change', () => {
                input.value != '' ? input.classList.add(CLASS_FILLED) : input.classList.remove(CLASS_FILLED);
            });
        });
    }
}