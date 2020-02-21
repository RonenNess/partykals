/**
 * Generate vectors within a 3d box.
 * Author: Ronen Ness.
 * Since: 2019.
*/
import {
    Vector3
} from 'three';
import Randomizer from './randomizer';
import { getRandomVectorBetween } from '../utils';

/**
 * Box vector randomizer.
 */
export default class BoxRandomizer extends Randomizer {
    /**
     * Create the box randomizer from min and max vectors to randomize between.
     */
    constructor(min, max) {
        super();
        this.min = min || new Vector3(-1, -1, -1);
        this.max = max || new Vector3(1, 1, 1);
    }

    /**
     * Generate a random vector.
     */
    generate() {
        return getRandomVectorBetween(this.min, this.max);
    }
}
