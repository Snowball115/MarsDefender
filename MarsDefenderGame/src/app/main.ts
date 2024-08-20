import '../scss/main.scss';

import { GameCache } from './data/gameCache';
import { Input } from './components/input';
import { Menu } from './components/menu';
import { Highscores } from './components/highscores';
import { Game } from './components/game';
import { FormInput } from './utility/formInput';

export let _gameChache: GameCache;
export let _input: Input

document.addEventListener('DOMContentLoaded', () => {

    // Data
    _gameChache = new GameCache();
    _input = new Input();

    // Pages
    new Menu();
    new Highscores();

    // Helpers
    new FormInput();

    // Init game loop when cache has loaded all assets
    _gameChache.initGameCache().then(() => {
        new Game();
    });
});