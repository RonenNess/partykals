(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Partykals = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// This file is just a wrapper to get THREE base module.
// If its not in your global space, edit this file accordingly.
module.exports = window.THREE || require('three');
},{"three":undefined}],2:[function(require,module,exports){
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
},{"./utils":15}],3:[function(require,module,exports){
/**
 * Module main entry point.
 * Author: Ronen Ness.
 * Since: 2019.
 */
module.exports = {
    ParticlesSystem: require('./particles_system'),
    Particle: require('./particle'),
    Emitter: require('./emitter'),
    Utils: require('./utils'),
    Randomizers: require('./randomizers'),
}
},{"./emitter":2,"./particle":7,"./particles_system":8,"./randomizers":11,"./utils":15}],4:[function(require,module,exports){
/**
 * Create the shader material.
 * Author: Ronen Ness.
 * Since: 2019.
 */
const THREE = require('./../_three');
const VertexShaderCode = require('./shaders/vertex');
const FragmentShaderCode = require('./shaders/fragment');

/**
 * Material for particles.
 */
class ParticlesMaterial
{
    /**
     * Create the particles material.
     * @param {*} options Material options.
     * @param {Number} options.color Material general color.
     * @param {Boolean} options.transparent Should we support transparency?
     * @param {THREE.Blending} options.blending Blending mode.
     * @param {THREE.Texture} options.map Texture to use.
     * @param {Boolean} options.perspective If true, will scale particles based on distance from camera.
     * @param {Boolean} options.perParticleColor If true, will allow per-particle colors.
     * @param {Boolean} options.perParticleRotation If true, will allow per-particle rotation.
     * @param {Number} options.constSize If exist, will set const size to all particles.
     * @param {Boolean} options.alphaTest If true, will perform alpha test and discard transparent pixels.
     * @param {Boolean} options.depthWrite If true, will perform depth write.
     * @param {Boolean} options.depthTest If true, will perform depth test.
     */
    constructor(options)
    {
        // store options
        this.options = options;

        // uniforms
        var uniforms = {
            globalColor: { value: new THREE.Color( options.color || 0xffffff ) },
            rendererScale: { value: 1 },
        };

        // set flags to change shaders behavior
        var flags = "";
        if (options.perspective) {
            flags += "#define PERSPECTIVE\n";
        }
        if (options.map) {
            flags += "#define TEXTURE\n";
            uniforms._texture = { value: options.map };
        }
        if (options.perParticleColor) {
            flags += "#define COLORING\n";
        }
        if (options.perParticleRotation) {
            flags += "#define ROTATION\n";
        }
        if (options.constSize) {
            flags += "#define CONST_SIZE\n";
            uniforms.constSize = { value: options.constSize };
        }
        if (options.alphaTest) {
            flags += "#define ALPHA_TEST\n";
        }
        flags += "\n";

        // create the internal material
        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms:       uniforms,
            vertexShader:   flags + VertexShaderCode,
            fragmentShader: flags + FragmentShaderCode,
            transparent:    Boolean(options.transparent),
            blending:       options.blending,
            vertexColors:   THREE.VertexColors,
            depthWrite:     Boolean(options.depthWrite),
            depthTest:      Boolean(options.depthTest),
        });
        this.material = shaderMaterial;
    }

    /**
     * Dispose the material.
     */
    dispose()
    {
        this.material.dispose();
    }
    
    /**
     * Set unified scale for all particles.
     */
    setBaseScale(val)
    {
        if (this.options.perspective) {
            this.material.uniforms.rendererScale.value = val;
        }
    }
}

module.exports = ParticlesMaterial;
},{"./../_three":1,"./shaders/fragment":5,"./shaders/vertex":6}],5:[function(require,module,exports){
/**
 * Implement fragment shader for our particles.
 * Author: Ronen Ness.
 * Since: 2019.
 */
var code = `
// material uniforms
uniform vec3 globalColor;

// params we get from vertex shader
varying float vAlpha;

// per-particle color from vertex shader
#ifdef COLORING
    varying vec3 vColor;
#endif

// per-particle rotation from vertex shader
#ifdef ROTATION
    varying float vRotation;
#endif

// diffuse texture
#ifdef TEXTURE
    uniform sampler2D _texture;
#endif

// fragment shader main
void main() 
{
    // set default color if don't have per-particle colors
    #ifndef COLORING
        vec3 vColor = vec3(1,1,1);
    #endif

    // texture
    #ifdef TEXTURE

        // use rotation (rotate texture)
        #ifdef ROTATION
            float mid = 0.5;
            vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - mid) + sin(vRotation) * (gl_PointCoord.y - mid) + mid,
                          cos(vRotation) * (gl_PointCoord.y - mid) - sin(vRotation) * (gl_PointCoord.x - mid) + mid);
            vec4 textureCol = texture2D(_texture,  rotated);
        // no rotation
        #else
            vec2 coords = vec2((gl_PointCoord.x - 0.5) + 0.5, (gl_PointCoord.y - 0.5) + 0.5);
            vec4 textureCol = texture2D(_texture, coords);
        #endif

        // get color with texture
        gl_FragColor = vec4( globalColor * vColor, vAlpha ) * textureCol;
        
    // no texture (colors only)
    #else
        gl_FragColor = vec4( globalColor * vColor, vAlpha );
    #endif

    // check if need to discard pixel
    #ifdef ALPHA_TEST
        if (gl_FragColor.a < 0.00001) { discard; }
    #endif
}
`;
module.exports = code;
},{}],6:[function(require,module,exports){
/**
 * Implement vertex shader for our particles.
 * Author: Ronen Ness.
 * Since: 2019.
 */
var code = `
// attributes we get from geometry
attribute float alpha;

// per-particle size
#ifdef CONST_SIZE
    uniform float constSize;
#else
    attribute float size;
#endif

// per-particle rotation
#ifdef ROTATION
    attribute float rotation;
#endif

// system scale when using perspective mode
#ifdef PERSPECTIVE
    uniform float rendererScale;
#endif

// output params for fragment shader
varying float vAlpha;

// set per-particle color
#ifdef COLORING
    varying vec3 vColor;
#endif

// get per-particle rotation
#ifdef ROTATION
    varying float vRotation;
#endif

// vertex shader main
void main() 
{
    // alpha and color
    vAlpha = alpha;

    // set color
    #ifdef COLORING
        vColor = color;
    #endif

    // set const size
    #ifdef CONST_SIZE
        float size = constSize;
    #endif

    // set position
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;

    // apply rotation
    #ifdef ROTATION
        vRotation = rotation;
    #endif
    
    // set size - either perspective or constant
    #ifdef PERSPECTIVE
        gl_PointSize = size * (rendererScale / length(mvPosition.xyz));
    #else
        gl_PointSize = size;
    #endif
}
`;
module.exports = code;
},{}],7:[function(require,module,exports){
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
},{"./_three":1,"./utils":15}],8:[function(require,module,exports){
/**
 * Implement basic particles system.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('./_three');
const Particle = require('./particle');
const ParticlesMaterial = require('./material/material');

/**
 * Particles system.
 */
class ParticlesSystem
{
    /**
     * Create particles system.
     * @param {*} options Particles options.
     * @param {THREE.Object3D} options.container Container to add particles system to.
     * 
     * // PARTICLES OPTIONS
     * ============================================================================
     * @param {*} options.particles Particle-related options.
     * 
     * // PARTICLES TTL
     * @param {Number} options.particles.ttl How long, in seconds, every particle lives.
     * @param {Number} options.particles.ttlExtra If provided, will add random numbers from 0 to ttlExtra to particle's ttl.
     * 
     * // PARTICLES FADING / ALPHA
     * @param {Boolean} options.particles.alpha Per-particle constant alpha; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.startAlpha Particles starting opacity; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.endAlpha Particles ending opacity; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.startAlphaChangeAt Will only start shifting alpha when age is over this value; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * 
     * // PARTICLES GROWING / SIZE
     * @param {Number} options.particles.size Per-particle constant size; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.startSize Particles starting size; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.endSize Particles ending size; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.startSizeChangeAt Will only start shifting size when age is over this value; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * 
     * // PARTICLES COLORING
     * @param {THREE.Color} options.particles.color Per-particle constant color; either a constant value (THREE.Color) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {THREE.Color} options.particles.startColor Starting color min value; either a constant value (THREE.Color) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {THREE.Color} options.particles.endColor Ending color min value; either a constant value (THREE.Color) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.startColorChangeAt Will only start shifting color when age is over this value; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * 
     * // PARTICLES ACCELERATION 
     * @param {THREE.Vector3} options.particles.acceleration Particles acceleration; either a constant value (THREE.Vector3) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.gravity Gravity force affecting the particles.    
     * 
     * // PARTICLES ROTATION
     * @param {Number} options.particles.rotation Per-particle rotation (only works with texture); either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {Number} options.particles.rotationSpeed Particles rotation speed (only works with texture); either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random values.
     * 
     * // PARTICLES VELOCITY 
     * @param {*} options.particles.velocity Particles starting velocity; either a constant value (THREE.Vector3) or a Partykals.Randomizers.Randomizer instance to create random values.
     * @param {THREE.Vector3} options.particles.velocityBonus Velocity value to add to all particles after randomizing velocity.
     * 
     * // PARTICLES OFFSET
     * @param {THREE.Vector3} options.particles.offset Particles offset from system's center; either a constant value (THREE.Vector3) or a Partykals.Randomizers.Randomizer instance to create random values.
     * 
     * // PARTICLE GLOBALS
     * @param {Boolean} options.particles.worldPosition If true, particles will maintain their world position after spawn even if the system moves.
     * @param {Number} options.particles.globalSize Const size for all particles. Note: this is more efficient than setting per-particle size property.
     * @param {Number} options.particles.globalColor Global color to affect all particles. Note: this is more efficient than setting per-particle color property.
     * @param {String} options.particles.blending Particles blending mode (opaque / blend / additive).
     * @param {THREE.Texture} options.particles.texture Particle's texture to use.
     * 
     * // CUSTOM CALLBACKS
     * @param {Function} options.particles.onUpdate Optional method to call per-particle every update frame.
     * @param {Function} options.particles.onSpawn Optional method to call per-particle every time a particle spawns (after everything is set).
     * 
     * // SYSTEM OPTIONS
     * ============================================================================
     * @param {*} options.system System-related options.
     * @param {Number} options.system.particlesCount Particles count.
     * @param {Number} options.system.ttl How long, in seconds, the particle system lives.
     * @param {Number} options.system.speed Speed factor to affect all particles and emitting. Note: the only thing this don't affect is system's ttl.
     * @param {Function} options.system.onUpdate Optional method to call every update frame.
     * @param {Partykals.Emitter} options.system.emitters A single emitter or a list of emitters to attach to this system.
     * @param {Boolean} options.system.perspective If true, will scale particles based on distance from camera.
     * @param {Number} options.system.scale Overall system scale when in perspective mode (if perspective=false, will be ignored). A good value is between 400 and 600.
     * @param {Boolean} options.system.depthWrite Should we perform depth write? (default to true).
     * @param {Boolean} options.system.depthTest Should we perform depth test? (default to true).
     */
    constructor(options)
    {
        // store options
        options.particles = options.particles || {worldPosition: true};
        options.system = options.system || {};
        this.options = options;

        // to check if value is defined
        var defined = (val) => { return (val !== undefined) && (val !== null); }

        // get particle options
        var poptions = options.particles;
        
        // do some internal cheating to replace const size with global size
        if (typeof options.particles.size === "number") {
            console.warn("Note: replaced 'size' with 'globalSize' property since its more efficient and provided size value was constant anyway.");
            options.particles.globalSize = options.particles.size;
            delete options.particles.size;
        }

        // do some internal cheating to replace const color with global color
        if (options.particles.color instanceof THREE.Color) {
            console.warn("Note: replaced 'color' with 'globalColor' property since its more efficient and you provided color value was constant anyway.");
            options.particles.globalColor = options.particles.color;
            delete options.particles.color;
        }

        // set some internal flags
        options.particles.fade = (defined(poptions.startAlpha) || defined(poptions.alpha));
        options.particles.rotating = (defined(poptions.rotationSpeed) || defined(poptions.rotation));
        options.particles.colorize = (defined(poptions.color) || defined(poptions.startColor));
        options.particles.scaling = (defined(poptions.size) || defined(poptions.startSize));

        // validate alpha params
        if (defined(poptions.startAlpha) && !defined(poptions.endAlpha)) { throw new Error("When providing 'startAlpha' you must also provide 'endAlpha'!"); }
        if (defined(poptions.startAlpha) && defined(poptions.alpha)) { throw new Error("When providing 'alpha' you can't also provide 'startAlpha'!"); }
   
        // validate color params
        if (defined(poptions.startColor) && !defined(poptions.endColor)) { throw new Error("When providing 'startColor' you must also provide 'endColor'!"); }
        if (defined(poptions.startColor) && defined(poptions.color)) { throw new Error("When providing 'color' you can't also provide 'startColor'!"); }

        // validate size params
        if (defined(poptions.startSize) && !defined(poptions.endSize)) { throw new Error("When providing 'startSize' you must also provide 'endSize'!"); }
        if (defined(poptions.startSize) && defined(poptions.size)) { throw new Error("When providing 'size' you can't also provide 'startSize'!"); }

        // get particles count
        var particleCount = options.system.particlesCount || 10;

        // get blending mode
        var blending = options.particles.blending || "opaque";

        // get threejs blending mode
        var threeBlend = {
            "opaque": THREE.NoBlending,
            "additive": THREE.AdditiveBlending,
            "multiply": THREE.MultiplyBlending,
            "blend": THREE.NormalBlending,
        }[blending];

        // set emitters
        this._emitters = [];
        if (options.system.emitters) {
            if (options.system.emitters instanceof Array) {
                for (var i = 0; i < options.system.emitters.length; ++i) {
                    this.addEmitter(options.system.emitters[i]);
                }
            }
            else {
                this.addEmitter(options.system.emitters);
            }
        }

        // has transparency?
        var isTransparent = (blending !== "opaque");

        // create the particle geometry
        this.particlesGeometry = new THREE.BufferGeometry();

        // set perspective mode
        var perspective = options.system.perspective !== undefined ? Boolean(options.system.perspective) : true;

        // create particles material
        var pMaterial = new ParticlesMaterial({
            size: options.particles.size || 10,
            color: options.particles.globalColor || 0xffffff,
            blending: threeBlend,
            perspective: perspective,
            transparent: isTransparent,
            map: options.particles.texture,
            perParticleColor: Boolean(options.particles.colorize),
            alphaTest: (blending === "blend") && defined(options.particles.texture),
            constSize: defined(options.particles.globalSize) ? options.particles.globalSize : null,
            depthWrite: defined(options.system.depthWrite) ? options.system.depthWrite : true,
            depthTest: defined(options.system.depthTest) ? options.system.depthTest : true,
            perParticleRotation: options.particles.rotating,
        });

        // store material for later usage
        this.material = pMaterial;
        
        // store speed factor
        this.speed = options.system.speed || 1;

        // set system starting ttl and other params
        this.reset();

        // dead particles and alive particles lists
        this._aliveParticles = [];
        this._deadParticles = [];

        // create all particles + set geometry attributes
        var vertices = new Float32Array(particleCount * 3);
        var colors = options.particles.colorize ? new Float32Array(particleCount * 3) : null;
        var alphas = options.particles.fade ? new Float32Array( particleCount * 1 ) : null;
        var sizes = options.particles.scaling ? new Float32Array( particleCount * 1 ) : null;
        var rotations = options.particles.rotating ? new Float32Array( particleCount * 1 ) : null;
        for (var p = 0; p < particleCount; p++) 
        {
            var index = p * 3;
            vertices[index] = vertices[index + 1] = vertices[index + 2] = 0;
            if (colors) { colors[index] = colors[index + 1] = colors[index + 2] = 1; }
            if (alphas) { alphas[p] = 1; }
            if (sizes) { sizes[p] = 1; }
            if (rotations) { rotations[p] = 0; }
            this._deadParticles.push(new Particle(this));
        }
        this.particlesGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        if (alphas) { this.particlesGeometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) ); }
        if (colors) { this.particlesGeometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) ); }
        if (sizes) { this.particlesGeometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) ); }
        if (rotations) { this.particlesGeometry.setAttribute( 'rotation', new THREE.BufferAttribute( rotations, 1 ) ); }
        this.particlesGeometry.setDrawRange(0, 0);

        // set scale
        this.material.setBaseScale(options.system.scale || 400);

        // create the particles system
        var particleSystem = new THREE.Points(this.particlesGeometry, this.material.material);
        particleSystem.sortParticles = isTransparent;

		// set default render order
		if (ParticlesSystem.defaultRenderOrder !== undefined) {
			particleSystem.renderOrder = ParticlesSystem.defaultRenderOrder;
		}

        // store particles system
        this.particleSystem = particleSystem;

        // to make sure first update will update everything
        this._positionDirty = true;
        this._colorsDirty = Boolean(colors);
        this._alphaDirty = Boolean(alphas);
        this._rotateDirty = Boolean(rotations);
        
        // add it to the parent container
        if (options.container) {
            this.addTo(options.container);
        }
    }
    
    /**
     * Add emitter to this particles system.
     */
    addEmitter(emitter)
    {
        this._emitters.push(emitter);
    }

    /**
     * Dispose the entire system.
     */
    dispose()
    {
        this.particlesGeometry.dispose();
        this.material.dispose();
    }

    /**
     * Return true when ttl is expired and there are no more alive particles in system.
     */
    get finished()
    {
        return this.ttlExpired && (this.particlesCount === 0);
    }

    /**
     * Get if this system's ttl is expired.
     */
    get ttlExpired()
    {
        return (this.ttl !== undefined) && (this.ttl <= 0);
    }

    /**
     * Reset particles system ttl.
     */
    reset()
    {
        this.ttl = this.options.system.ttl;
        this.age = 0;
        this._timeToUpdateBS = 0;
    }

    /**
     * Get system's world position.
     */
    getWorldPosition()
    {
        var ret = new THREE.Vector3();
        this.particleSystem.getWorldPosition(ret);
        return ret;
    }

    /**
     * Add the particles system to scene or container.
     * @param {THREE.Object3D} container Container to add system to.
     */
    addTo(container)
    {
        container.add(this.particleSystem);
    }

    /**
     * Set a particle's color value.
     */
    setColor(index, color)
    {
        index *= 3;
        var colors = this.particlesGeometry.attributes.color.array;
        colors[index] = color.r;
        colors[index + 1] = color.g;
        colors[index + 2] = color.b;
        this._colorsDirty = true;
    }

    /**
     * Set a particle's position.
     */
    setPosition(index, position)
    {
        index *= 3;
        var vertices = this.particlesGeometry.attributes.position.array;
        vertices[index] = position.x;
        vertices[index + 1] = position.y;
        vertices[index + 2] = position.z;
        this._positionDirty = true;
    }

    /**
     * Set particle's alpha.
     */
    setAlpha(index, value)
    {
        this.particlesGeometry.attributes.alpha.array[index] = value;
        this._alphaDirty = true;
    }

    /**
     * Set particle's rotation.
     */
    setRotation(index, value)
    {
        this.particlesGeometry.attributes.rotation.array[index] = value;
        this._rotateDirty = true;
    }

    /**
     * Set particle's size.
     */
    setSize(index, value)
    {
        this.particlesGeometry.attributes.size.array[index] = value;
        this._sizeDirty = true;
    }

    /**
     * Get how many particles this system currently shows.
     */
    get particlesCount()
    {
        return this._aliveParticles.length;
    }

    /**
     * Get max particles count.
     */
    get maxParticlesCount()
    {
        return this._aliveParticles.length + this._deadParticles.length;
    }

    /**
     * If ttl is expired and there are no more alive particles, remove system and dispose it.
     * @returns True if removed & disposed, false if still alive.
     */
    removeAndDisposeIfFinished()
    {
        if (this.finished)
        {
            this.removeSelf();
            this.dispose();
            return true;
        }
        return false;
    }

    /**
     * Update particles system.
     */
    update(deltaTime)
    {
        // if deltaTime is undefined, set automatically
        if (deltaTime === undefined) {
            var timeNow = (new Date()).getTime() / 1000.0;
            deltaTime = (timeNow - this._lastTime) || 0;
            this._lastTime = timeNow;
        }

        // delta time is 0? skip
        if (deltaTime === 0) {
            return;
        }

        // update ttl
        if (this.ttl !== undefined && this.ttl > 0) {
            this.ttl -= deltaTime;
        }

        // apply speed
        deltaTime *= this.speed;

        // store last delta time
        this.dt = deltaTime;
        this.age += deltaTime;

        // to check if number of particles changed
        var prevParticlesCount = this._aliveParticles.length;

        // generate particles (unless ttl expired)
        if (!this.ttlExpired) {
            for (var i = 0; i < this._emitters.length; ++i) {
                var toSpawn = this._emitters[i].update(deltaTime, this);
                if (toSpawn) { 
                    this.spawnParticles(toSpawn); 
                }
            }
        }

        // update particles
        for (var i = this._aliveParticles.length - 1; i >= 0; --i)
        {
            // update particle
            var particle = this._aliveParticles[i];
            particle.update(i, deltaTime);

            // finished? remove it
            if (particle.finished) {
                this._aliveParticles.splice(i, 1);
                this._deadParticles.push(particle);
            }
        }

        // hide invisible vertices
        if (prevParticlesCount !== this._aliveParticles.length) {
            this.particlesGeometry.setDrawRange(0, this._aliveParticles.length);
        }
        
        // set vertices dirty flag
        this.particlesGeometry.attributes.position.needsUpdate = this._positionDirty;
        this._needBoundingSphereUpdate = this._needBoundingSphereUpdate || this._positionDirty;
        this._positionDirty = false;
        
        // set colors dirty flag
        if (this._colorsDirty) {
            this.particlesGeometry.attributes.color.needsUpdate = true;
            this._colorsDirty = false;
        }
        
        // set alphas dirty flag
        if (this._alphaDirty) {
            this.particlesGeometry.attributes.alpha.needsUpdate = true;
            this._alphaDirty = false;
        }

        // set size dirty flag
        if (this._sizeDirty) {
            this.particlesGeometry.attributes.size.needsUpdate = true;
            this._sizeDirty = false;
        }

        // set rotation dirty flag
        if (this._rotateDirty) {
            this.particlesGeometry.attributes.rotation.needsUpdate = true;
            this._rotateDirty = false;
        }

        // update bounding sphere
        if (this._needBoundingSphereUpdate) { 
            this._timeToUpdateBS -= deltaTime;
            if (this._timeToUpdateBS <= 0) {
                this._timeToUpdateBS = 0.2;
                this.particlesGeometry.computeBoundingSphere();
            }
        }

        // if finished, stop here
        if (this.finished) {
            return;
        }

        // call optional update
        if (this.options.system.onUpdate) {
            this.options.system.onUpdate(this);
        }
        
    }

    /**
     * Spawn particles.
     * @param {Number} quantity Number of particles to spawn. If exceed max available particles in system, skip.
     */
    spawnParticles(quantity)
    {
        // spawn particles
        for (var i = 0; i < quantity; ++i) 
        {
            // no available dead particles? skip
            if (this._deadParticles.length === 0) { 
                return;
            }

            // spawn particle
            var particle = this._deadParticles.pop();
            particle.reset();
            this._aliveParticles.push(particle);
        }
    }

    /**
     * Remove particles system from its parent.
     */
    removeSelf() 
    {
        if (this.particleSystem.parent) { 
            this.particleSystem.parent.remove(this.particleSystem); 
        }
    };
}

// override this to set default rendering order to all particle systems
ParticlesSystem.defaultRenderOrder = undefined;

// export the particles system
module.exports = ParticlesSystem;

},{"./_three":1,"./material/material":4,"./particle":7}],9:[function(require,module,exports){
/**
 * Generate vectors within a 3d box.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('./../_three');
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
},{"../utils":15,"./../_three":1,"./randomizer":13}],10:[function(require,module,exports){
/**
 * Generate vectors within a 3d box.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('./../_three');
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
},{"../utils":15,"./../_three":1,"./randomizer":13}],11:[function(require,module,exports){
/**
 * Module main entry point.
 * Author: Ronen Ness.
 * Since: 2019.
 */

module.exports = {
    Randomizer: require('./randomizer'),
    BoxRandomizer: require('./box_randomizer'),
    SphereRandomizer: require('./sphere_randomizer'),
    ColorsRandomizer: require('./colors_randomizer'),
    MinMaxRandomizer: require('./minmax_randomizer'),
}
},{"./box_randomizer":9,"./colors_randomizer":10,"./minmax_randomizer":12,"./randomizer":13,"./sphere_randomizer":14}],12:[function(require,module,exports){
/**
 * Generate numbers between min and max.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const Randomizer = require('./randomizer');
const Utils = require('../utils');


/**
 * Min-Max number randomizer.
 */
class MinMaxRandomizer extends Randomizer
{
    /**
     * Create the min-max randomizer from min and max.
     */
    constructor(min, max)
    {
        super();
        this.min = min;
        this.max = max;
    }
    
    /**
     * Generate a random number.
     */
    generate()
    {
        return Utils.getRandomBetween(this.min, this.max);
    }
}

// export the randomizer class
module.exports = MinMaxRandomizer;
},{"../utils":15,"./randomizer":13}],13:[function(require,module,exports){
/**
 * Define interface for a helper class to generate random vectors and colors.
 * Author: Ronen Ness.
 * Since: 2019.
*/

/**
 * Base class for all vector randomizers.
 */
class Randomizer
{
    /**
     * Generate and return a random value.
     * This is the main method to implement.
     */
    generate()
    {
        throw new Error("Not implemented.");
    }
}

// export the base class
module.exports = Randomizer;
},{}],14:[function(require,module,exports){
/**
 * Generate vectors within a 3d sphere.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('../_three');
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
},{"../_three":1,"../utils":15,"./randomizer":13}],15:[function(require,module,exports){
/**
 * Implement a single particle in the particles system.
 * Author: Ronen Ness.
 * Since: 2019.
*/
const THREE = require('./_three');

module.exports = {

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    getRandomBetween: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Get random between baseVal and baseVal + extraRandom.
     * If 'extraRandom' is not defined, will just return baseVal.
     * If baseVal is not defined, will return white.
     */
    getRandomWithSpread: function(baseVal, extraRandom) 
    {
        if (!extraRandom) { return baseVal; }
        return this.getRandomBetween(baseVal, baseVal + extraRandom);
    },

    /**
     * Get random between two colors.
     * If 'colMax' is not defined, will just return colMin or white color if not defined.
     */
    getRandomColorBetween: function(colMin, colMax) 
    {
        if (!colMax) { return colMin ? colMin.clone() : new THREE.Color(); }
        return new THREE.Color(
            this.getRandomBetween(colMin.r, colMax.r),
            this.getRandomBetween(colMin.g, colMax.g),
            this.getRandomBetween(colMin.b, colMax.b),
        );
    },

    /**
     * Get random between two vectors.
     * If 'vecMax' is not defined, will just return vecMin or zero point if not defined.
     */
    getRandomVectorBetween: function(vecMin, vecMax) 
    {
        if (!vecMax) { return vecMin ? vecMin.clone() : new THREE.Vector3(); }
        return new THREE.Vector3(
            this.getRandomBetween(vecMin.x, vecMax.x),
            this.getRandomBetween(vecMin.y, vecMax.y),
            this.getRandomBetween(vecMin.z, vecMax.z),
        );
    },

    /**
     * Lerp between two colors, returning a new color without changing any of them.
     */
    lerpColors: function(colA, colB, alpha)
    {
        return colA.clone().lerp(colB, alpha);
    },

    /**
     * Lerp between two numbers.
     */
    lerp: function(x, y, alpha)
    {
        return (x * (1-alpha)) + (y * alpha)
    },

    /**
     * Get const numeric value or generate random value from randomizer.
     */
    randomizerOrValue: function(val)
    {
        return (val.generate ? val.generate() : val) || 0;
    },
};
},{"./_three":1}]},{},[3])(3)
});
