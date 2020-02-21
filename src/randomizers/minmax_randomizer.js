/**
 * Generate numbers between min and max.
 * Author: Ronen Ness.
 * Since: 2019.
*/
import {
    Color
} from 'three';
import Randomizer from './randomizer';
import { getRandomBetween } from '../utils';

/**
 * Min-Max number randomizer.
 */
export default class MinMaxRandomizer extends Randomizer {
    /**
     * Create the min-max randomizer from min and max.
     */
    constructor(min, max) {
        super();
        this.min = min;
        this.max = max;
    }

    /**
     * Generate a random number.
     */
    generate() {
        return getRandomBetween(this.min, this.max);
    }
}
