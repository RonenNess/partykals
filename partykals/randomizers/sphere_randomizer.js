/**
 * Generate vectors within a 3d sphere.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('./../three');
const Randomizer = require('./randomizer');
const Utils = require('../utils');

// random between -1 and 1.
function randMinusToOne()
{
    return Math.random() * 2 - 1;
}

/**
 * Sphere vector randomizer.
 */
class SphereRandomizer extends Randomizer
{
    /**
     * Create the sphere randomizer from radius and optional scaler.
     */
    constructor(maxRadius, minRadius, scaler, minVector, maxVector)
    {
        super();
        this.maxRadius = maxRadius || 1;
        this.minRadius = minRadius || 0;
        this.scaler = scaler;
        this.minVector = minVector;
        this.maxVector = maxVector;
    }
    
    /**
     * Generate a random vector.
     */
    generate()
    {
        // create random vector
        var ret = new THREE.Vector3(randMinusToOne(), randMinusToOne(), randMinusToOne());

        // clamp values
        if (this.minVector || this.maxVector) {
            ret.clamp(this.minVector || new THREE.Vector3(-1,-1,-1), this.maxVector || new THREE.Vector3(1,1,1));
        }

        // normalize and multiply by radius
        ret.normalize().multiplyScalar( Utils.getRandomBetween(this.minRadius, this.maxRadius) );

        // apply scaler
        if (this.scaler) { ret.multiply(this.scaler); }
        return ret;
    }
}

// export the randomizer class
module.exports = SphereRandomizer;