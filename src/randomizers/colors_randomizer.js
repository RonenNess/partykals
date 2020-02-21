/**
 * Generate vectors within a 3d box.
 * Author: Ronen Ness.
 * Since: 2019.
*/
import {
    Color
} from 'three';
import Randomizer from './randomizer';
import { getRandomColorBetween } from '../utils';

/**
 * Box vector randomizer.
 */
export default class ColorsRandomizer extends Randomizer {
    /**
     * Create the box randomizer from min and max colors to randomize between.
     */
    constructor(min, max) {
        super();
        this.min = min || new Color(0, 0, 0);
        this.max = max || new Color(1, 1, 1);
    }

    /**
     * Generate a random color.
     */
    generate() {
        return getRandomColorBetween(this.min, this.max);
    }
}
