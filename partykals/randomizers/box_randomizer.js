/**
 * Generate vectors within a 3d box.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('three');
const Randomizer = require('./randomizer');
const Utils = require('../utils');

/**
 * Box vector randomizer.
 */
class BoxRandomizer extends Randomizer
{
    /**
     * Create the box randomizer from min and max vectors to randomize between.
     */
    constructor(min, max)
    {
        super();
        this.min = min || new THREE.Vector3(-1, -1, -1);
        this.max = max || new THREE.Vector3(1, 1, 1);
    }
    
    /**
     * Generate a random vector.
     */
    generate()
    {
        return Utils.getRandomVectorBetween(this.min, this.max);
    }
}

// export the randomizer class
module.exports = BoxRandomizer;