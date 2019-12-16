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
        this.ttl = Utils.getRandomWithSpread(options.ttl || 1, options.ttlExtra) || 1;

        // set per-particle alpha
        this.alpha = this.startAlpha = this.endAlpha = null;
        this.startAlphaChangeAt = (options.startAlphaChangeAt || 0) / this.ttl;
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
   
        // set per-particle coloring
        this.colorize = Boolean(options.colorize);
        this.color = this.startColor = this.endColor = null;
        this.startColorChangeAt = (options.startColorChangeAt || 0) / this.ttl;
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

        // set per-particle size
        this.size = this.startSize = this.endSize = null;
        this.startSizeChangeAt = (options.startSizeChangeAt || 0) / this.ttl;
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
        
        // set per-particle rotation
        this.rotation = this.rotationSpeed = null;
        if (options.rotating) 
        {
            this.rotation = Utils.randomizerOrValue(options.rotation || 0);
            this.rotationSpeed = Utils.randomizerOrValue(options.rotationSpeed || 0);
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
            if (this.alpha !== null || this.startAlpha !== null) {
                this.system.setAlpha(index, this.alpha || this.startAlpha);
            }

            // set constant color
            if (this.color !== null || this.startColor !== null) {
                this.system.setColor(index, this.color || this.startColor);
            }

            // set constant size
            if (this.size !== null || this.startSize !== null) {
                this.system.setSize(index, this.size || this.startSize);
            }

            // set start rotation
            if (this.rotation !== null) {
                this.system.setRotation(index, this.rotation);
            }
        }
        // do normal updates
        else
        {
            // set animated color
            if (this.startColor && this.age >= this.startColorChangeAt) {
                this.system.setColor(index, Utils.lerpColors(this.startColor, this.endColor, 
                    this.startColorChangeAt ? ((this.age - this.startColorChangeAt) / (1-this.startColorChangeAt)) : this.age));
            }

            // set animated alpha
            if (this.startAlpha != null && this.age >= this.startAlphaChangeAt) {
                this.system.setAlpha(index, Utils.lerp(this.startAlpha, this.endAlpha, 
                    this.startAlphaChangeAt ? ((this.age - this.startAlphaChangeAt) / (1-this.startAlphaChangeAt)) : this.age));
            }

            // set animated size
            if (this.startSize != null && this.age >= this.startSizeChangeAt) {
                this.system.setSize(index, Utils.lerp(this.startSize, this.endSize, 
                    this.startSizeChangeAt ? ((this.age - this.startSizeChangeAt) / (1-this.startSizeChangeAt)) : this.age));
            }
        }

        // add gravity force
        if (this.gravity && this.velocity) {
            this.velocity.y += this.gravity * deltaTime;
        }

        // set animated rotation
        if (this.rotationSpeed) {
            this.rotation += this.rotationSpeed * deltaTime;
            this.system.setRotation(index, this.rotation);
        }

        // update position
        if (this.velocity) {
            this.position.x += this.velocity.x * deltaTime;
            this.position.y += this.velocity.y * deltaTime;
            this.position.z += this.velocity.z * deltaTime;
        }
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
        if (this.acceleration && this.velocity) {
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

    /**
     * Get particle's world position.
     */
    get worldPosition()
    {
        return this.system.getWorldPosition().add(this.position);
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