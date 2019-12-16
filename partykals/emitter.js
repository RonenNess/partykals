/**
 * Implement an emitter class to generate particles.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const Utils = require('./utils');
var randomizerOrValue = Utils.randomizerOrValue;

/**
 * Emitter class to determine rate of particles generation.
 */
class Emitter
{
    /**
     * Create the emitter class.
     * @param {*} options Emitter options.
     * @param {*} options.onSpawnBurst Burst of particles when particle system starts; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random numbers.
     * @param {*} options.onInterval Burst of particles every interval; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random numbers.
     * @param {Number} options.interval Spawn interval time, in seconds; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random numbers.
     * @param {Number} options.detoretingMinTtl If provided and particle system's ttl is below this value, will start emitting less and less until stopping completely.
     */
    constructor(options)
    {
        this.options = options;
        options.interval = options.interval || 1;
        this.age = 0;
        this.timeToSpawn = Math.random() * randomizerOrValue(options.interval);
    }

    /**
     * Update emitter and return how many particles should be generated this frame.
     */
    update(deltaTime, system)
    {
        // particles to generate
        var ret = 0;

        // first update? do burst
        if (this.age === 0 && this.options.onSpawnBurst) {
            ret += randomizerOrValue(this.options.onSpawnBurst);
        }
        
        // update age
        this.age += deltaTime;

        // no interval emitting? skip
        if (!this.options.onInterval) {
            return ret;
        }

        // check if inverval expired
        this.timeToSpawn -= deltaTime;
        if (this.timeToSpawn <= 0) {
            this.timeToSpawn = randomizerOrValue(this.options.interval);
            ret += randomizerOrValue(this.options.onInterval);
        }

        // do detoration
        if (this.options.detoretingMinTtl && system.ttl < this.options.detoretingMinTtl) {
            var detorateFactor = system.ttl / this.options.detoretingMinTtl;
            ret *= detorateFactor;
        }

        // return number of particles to generate
        return ret;
    }
}

// export the emitter class
module.exports = Emitter;