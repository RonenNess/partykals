/**
 * Implement a single particle in the particles system.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('./_three');
const Utils = require('./utils')


/**
 * A single particle metadata in the particles system.
 * We attach this to the particle's vertices when in system's geometry.
 */
class Particle
{
    /**
     * Create the particle.
     * @param {ParticlesSystem} system The particles system this particle belongs to.
     */
    constructor(system)
    {
        this.system = system;
        this.reset();
    }

    /**
     * Reset the particle.    
     */
    reset()
    {
        var options = this.system.options.particles;

        // reset particle age and if alive
        this.age = 0;
        this.finished = false;
        
        // should colorize particle?
        this.colorize = Boolean(options.colorize);
        this.color = this.startColor = this.endColor = null;
        if (this.colorize) 
        {
            // const color throughout particle's life?
            if (options.color) {
                this.color = getConstOrRandomColor(options.color);
            }
            // shifting color?
            else {
                this.startColor = getConstOrRandomColor(options.startColor);
                this.endColor = getConstOrRandomColor(options.endColor);
            }
        }

        // store gravity force
        this.gravity = options.gravity;

        // particle's velocity and velocity bonus
        this.velocity = getConstOrRandomVector(options.velocity);
        if (options.velocityBonus) { this.velocity.add(options.velocityBonus); }
        
        // particle's acceleration.
        this.acceleration = getConstOrRandomVector(options.acceleration, true);
        
        // starting offset
        this.position = getConstOrRandomVector(options.offset);

        // set particle's ttl
        this.ttl = Utils.getRandomWithSpread(options.ttl || 1, options.ttlExtra);

        // set per-particle alpha
        this.alpha = this.startAlpha = this.endAlpha = null;
        if (options.fade) 
        {
            // const alpha throughout particle's life?
            if (options.alpha !== undefined) {
                this.alpha = Utils.randomizerOrValue(options.alpha);
            }
            // shifting alpha?
            else {
                this.startAlpha = Utils.randomizerOrValue(options.startAlpha);
                this.endAlpha = Utils.randomizerOrValue(options.endAlpha);
            }
        } 

        // set per-particle rotation
        this.rotation = this.rotationSpeed = null;
        if (options.rotating) 
        {
            this.rotation = Utils.randomizerOrValue(options.rotation || 0);
            this.rotationSpeed = Utils.randomizerOrValue(options.rotationSpeed || 0);
        } 

        // set per-particle size
        this.size = this.startSize = this.endSize = null;
        if (options.scaling) 
        {       
            // const size throughout particle's life?
            if (options.size !== undefined) {
                this.size = Utils.randomizerOrValue(options.size);
            }
            // shifting size?
            else {
                this.startSize = Utils.randomizerOrValue(options.startSize);
                this.endSize = Utils.randomizerOrValue(options.endSize);
            }
        } 

        // used to keep constant world position
        this.startWorldPosition = null;

        // store on-update callback, if defined
        this.onUpdate = options.onUpdate;

        // call custom spawn method
        if (options.onSpawn) {
            options.onSpawn(this);
        }
    }

    /**
     * Update the particle (call this every frame).
     * @param {*} index Particle index in system.
     * @param {*} deltaTime Update delta time.
     */
    update(index, deltaTime)
    {
        // if finished, skip
        if (this.finished) {
            return;
        }

        // is it first update call?
        var firstUpdate = this.age === 0;

        // do first-update stuff
        if (firstUpdate) 
        {
            // if its first update and use world position, store current world position
            if (this.system.options.particles.worldPosition) {
                this.startWorldPosition = this.system.getWorldPosition();
            }

            // set constant alpha
            if (this.alpha !== null) {
                this.system.setAlpha(index, this.alpha);
            }

            // set constant color
            if (this.color !== null) {
                this.system.setColor(index, this.color);
            }

            // set constant size
            if (this.size !== null) {
                this.system.setSize(index, this.size);
            }

            // set start rotation
            if (this.rotation !== null) {
                this.system.setRotation(index, this.rotation);
            }
        }
        
        // add gravity force
        if (this.gravity) {
            this.velocity.y += this.gravity * deltaTime;
        }

        // set animated color
        if (this.startColor) {
            this.system.setColor(index, Utils.lerpColors(this.startColor, this.endColor, this.age));
        }

        // set animated alpha
        if (this.startAlpha != null) {
            this.system.setAlpha(index, Utils.lerp(this.startAlpha, this.endAlpha, this.age));
        }

        // set animated size
        if (this.startSize != null) {
            this.system.setSize(index, Utils.lerp(this.startSize, this.endSize, this.age));
        }

        // set animated rotation
        if (this.rotationSpeed) {
            this.rotation += this.rotationSpeed * deltaTime;
            this.system.setRotation(index, this.rotation);
        }

        // update position
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.position.z += this.velocity.z * deltaTime;
        var positionToSet = this.position;

        // to maintain world position
        if (this.startWorldPosition) 
        {
            var systemPos = this.system.getWorldPosition();
            systemPos.sub(this.startWorldPosition);
            positionToSet = positionToSet.clone().sub(systemPos);
        }

        // set position in system
        this.system.setPosition(index, positionToSet);

        // update velocity
        if (this.acceleration) {
            this.velocity.x += this.acceleration.x * deltaTime;
            this.velocity.y += this.acceleration.y * deltaTime;
            this.velocity.z += this.acceleration.z * deltaTime;
        }
        
        // update age. note: use ttl as factor, so that age is always between 0 and 1
        this.age += deltaTime / this.ttl;

        // call custom methods
        if (this.onUpdate) {
            this.onUpdate(this);
        }

        // is done? set as finished and continue to set final state
        if (this.age > 1) {
            this.age = 1;
            this.finished = true;
        }
    }
}


/**
 * Return either the value of a randomizer, a const value, or a default empty or null.
 */
function getConstOrRandomVector(constValOrRandomizer, returnNullIfUndefined)
{
    if (!constValOrRandomizer) return (returnNullIfUndefined) ? null : new THREE.Vector3();
    if (constValOrRandomizer.generate) return constValOrRandomizer.generate();
    return constValOrRandomizer.clone();
}


/**
 * Return either the value of a randomizer, a const value, or a default empty or null.
 */
function getConstOrRandomColor(constValOrRandomizer, returnNullIfUndefined)
{
    if (!constValOrRandomizer) return (returnNullIfUndefined) ? null : new THREE.Color(1, 1, 1);
    if (constValOrRandomizer.generate) return constValOrRandomizer.generate();
    return constValOrRandomizer.clone();
}


module.exports = Particle;