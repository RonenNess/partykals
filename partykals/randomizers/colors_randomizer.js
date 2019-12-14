/**
 * Generate vectors within a 3d box.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('./../three');
const Randomizer = require('./randomizer');
const Utils = require('../utils');

/**
 * Box vector randomizer.
 */
class ColorsRandomizer extends Randomizer
{
    /**
     * Create the box randomizer from min and max colors to randomize between.
     */
    constructor(min, max)
    {
        super();
        this.min = min || new THREE.Color(0, 0, 0);
        this.max = max || new THREE.Color(1, 1, 1);
    }
    
    /**
     * Generate a random color.
     */
    generate()
    {
        return Utils.getRandomColorBetween(this.min, this.max);
    }
}

// export the randomizer class
module.exports = ColorsRandomizer;