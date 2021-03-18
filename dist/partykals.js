var partykals = (function (THREE) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  /**
   * Implement a single particle in the particles system.
   * Author: Ronen Ness.
   * Since: 2019.
  */
  var utils = {
    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    getRandomBetween: function getRandomBetween(min, max) {
      return Math.random() * (max - min) + min;
    },

    /**
     * Get random between baseVal and baseVal + extraRandom.
     * If 'extraRandom' is not defined, will just return baseVal.
     * If baseVal is not defined, will return white.
     */
    getRandomWithSpread: function getRandomWithSpread(baseVal, extraRandom) {
      if (!extraRandom) {
        return baseVal;
      }

      return this.getRandomBetween(baseVal, baseVal + extraRandom);
    },

    /**
     * Get random between two colors.
     * If 'colMax' is not defined, will just return colMin or white color if not defined.
     */
    getRandomColorBetween: function getRandomColorBetween(colMin, colMax) {
      if (!colMax) {
        return colMin ? colMin.clone() : new THREE__default['default'].Color();
      }

      return new THREE__default['default'].Color(this.getRandomBetween(colMin.r, colMax.r), this.getRandomBetween(colMin.g, colMax.g), this.getRandomBetween(colMin.b, colMax.b));
    },

    /**
     * Get random between two vectors.
     * If 'vecMax' is not defined, will just return vecMin or zero point if not defined.
     */
    getRandomVectorBetween: function getRandomVectorBetween(vecMin, vecMax) {
      if (!vecMax) {
        return vecMin ? vecMin.clone() : new THREE__default['default'].Vector3();
      }

      return new THREE__default['default'].Vector3(this.getRandomBetween(vecMin.x, vecMax.x), this.getRandomBetween(vecMin.y, vecMax.y), this.getRandomBetween(vecMin.z, vecMax.z));
    },

    /**
     * Lerp between two colors, returning a new color without changing any of them.
     */
    lerpColors: function lerpColors(colA, colB, alpha) {
      return colA.clone().lerp(colB, alpha);
    },

    /**
     * Lerp between two numbers.
     */
    lerp: function lerp(x, y, alpha) {
      return x * (1 - alpha) + y * alpha;
    },

    /**
     * Get const numeric value or generate random value from randomizer.
     */
    randomizerOrValue: function randomizerOrValue(val) {
      return (val.generate ? val.generate() : val) || 0;
    }
  };

  /**
   * A single particle metadata in the particles system.
   * We attach this to the particle's vertices when in system's geometry.
   */

  var Particle = /*#__PURE__*/function () {
    /**
     * Create the particle.
     * @param {ParticlesSystem} system The particles system this particle belongs to.
     */
    function Particle(system) {
      _classCallCheck(this, Particle);

      this.system = system;
      this.reset();
    }
    /**
     * Reset the particle.    
     */


    _createClass(Particle, [{
      key: "reset",
      value: function reset() {
        var options = this.system.options.particles; // reset particle age and if alive

        this.age = 0;
        this.finished = false; // store gravity force

        this.gravity = options.gravity; // particle's velocity and velocity bonus

        this.velocity = getConstOrRandomVector(options.velocity);

        if (options.velocityBonus) {
          this.velocity.add(options.velocityBonus);
        } // particle's acceleration.


        this.acceleration = getConstOrRandomVector(options.acceleration, true); // starting offset

        this.position = getConstOrRandomVector(options.offset); // set particle's ttl

        this.ttl = utils.getRandomWithSpread(options.ttl || 1, options.ttlExtra) || 1; // set per-particle alpha

        this.alpha = this.startAlpha = this.endAlpha = null;
        this.startAlphaChangeAt = (options.startAlphaChangeAt || 0) / this.ttl;

        if (options.fade) {
          // const alpha throughout particle's life?
          if (options.alpha !== undefined) {
            this.alpha = utils.randomizerOrValue(options.alpha);
          } // shifting alpha?
          else {
              this.startAlpha = utils.randomizerOrValue(options.startAlpha);
              this.endAlpha = utils.randomizerOrValue(options.endAlpha);
            }
        } // set per-particle coloring


        this.colorize = Boolean(options.colorize);
        this.color = this.startColor = this.endColor = null;
        this.startColorChangeAt = (options.startColorChangeAt || 0) / this.ttl;

        if (this.colorize) {
          // const color throughout particle's life?
          if (options.color) {
            this.color = getConstOrRandomColor(options.color);
          } // shifting color?
          else {
              this.startColor = getConstOrRandomColor(options.startColor);
              this.endColor = getConstOrRandomColor(options.endColor);
            }
        } // set per-particle size


        this.size = this.startSize = this.endSize = null;
        this.startSizeChangeAt = (options.startSizeChangeAt || 0) / this.ttl;

        if (options.scaling) {
          // const size throughout particle's life?
          if (options.size !== undefined) {
            this.size = utils.randomizerOrValue(options.size);
          } // shifting size?
          else {
              this.startSize = utils.randomizerOrValue(options.startSize);
              this.endSize = utils.randomizerOrValue(options.endSize);
            }
        } // set per-particle rotation


        this.rotation = this.rotationSpeed = null;

        if (options.rotating) {
          this.rotation = utils.randomizerOrValue(options.rotation || 0);
          this.rotationSpeed = utils.randomizerOrValue(options.rotationSpeed || 0);
        } // used to keep constant world position


        this.startWorldPosition = null; // store on-update callback, if defined

        this.onUpdate = options.onUpdate; // call custom spawn method

        if (options.onSpawn) {
          options.onSpawn(this);
        }
      }
      /**
       * Update the particle (call this every frame).
       * @param {*} index Particle index in system.
       * @param {*} deltaTime Update delta time.
       */

    }, {
      key: "update",
      value: function update(index, deltaTime) {
        // if finished, skip
        if (this.finished) {
          return;
        } // is it first update call?


        var firstUpdate = this.age === 0; // do first-update stuff

        if (firstUpdate) {
          // if its first update and use world position, store current world position
          if (this.system.options.particles.worldPosition) {
            this.startWorldPosition = this.system.getWorldPosition();
          } // set constant alpha


          if (this.alpha !== null || this.startAlpha !== null) {
            this.system.setAlpha(index, this.alpha || this.startAlpha);
          } // set constant color


          if (this.color !== null || this.startColor !== null) {
            this.system.setColor(index, this.color || this.startColor);
          } // set constant size


          if (this.size !== null || this.startSize !== null) {
            this.system.setSize(index, this.size || this.startSize);
          } // set start rotation


          if (this.rotation !== null) {
            this.system.setRotation(index, this.rotation);
          }
        } // do normal updates
        else {
            // set animated color
            if (this.startColor && this.age >= this.startColorChangeAt) {
              this.system.setColor(index, utils.lerpColors(this.startColor, this.endColor, this.startColorChangeAt ? (this.age - this.startColorChangeAt) / (1 - this.startColorChangeAt) : this.age));
            } // set animated alpha


            if (this.startAlpha != null && this.age >= this.startAlphaChangeAt) {
              this.system.setAlpha(index, utils.lerp(this.startAlpha, this.endAlpha, this.startAlphaChangeAt ? (this.age - this.startAlphaChangeAt) / (1 - this.startAlphaChangeAt) : this.age));
            } // set animated size


            if (this.startSize != null && this.age >= this.startSizeChangeAt) {
              this.system.setSize(index, utils.lerp(this.startSize, this.endSize, this.startSizeChangeAt ? (this.age - this.startSizeChangeAt) / (1 - this.startSizeChangeAt) : this.age));
            }
          } // add gravity force


        if (this.gravity && this.velocity) {
          this.velocity.y += this.gravity * deltaTime;
        } // set animated rotation


        if (this.rotationSpeed) {
          this.rotation += this.rotationSpeed * deltaTime;
          this.system.setRotation(index, this.rotation);
        } // update position


        if (this.velocity) {
          this.position.x += this.velocity.x * deltaTime;
          this.position.y += this.velocity.y * deltaTime;
          this.position.z += this.velocity.z * deltaTime;
        }

        var positionToSet = this.position; // to maintain world position

        if (this.startWorldPosition) {
          var systemPos = this.system.getWorldPosition();
          systemPos.sub(this.startWorldPosition);
          positionToSet = positionToSet.clone().sub(systemPos);
        } // set position in system


        this.system.setPosition(index, positionToSet); // update velocity

        if (this.acceleration && this.velocity) {
          this.velocity.x += this.acceleration.x * deltaTime;
          this.velocity.y += this.acceleration.y * deltaTime;
          this.velocity.z += this.acceleration.z * deltaTime;
        } // update age. note: use ttl as factor, so that age is always between 0 and 1


        this.age += deltaTime / this.ttl; // call custom methods

        if (this.onUpdate) {
          this.onUpdate(this);
        } // is done? set as finished and continue to set final state


        if (this.age > 1) {
          this.age = 1;
          this.finished = true;
        }
      }
      /**
       * Get particle's world position.
       */

    }, {
      key: "worldPosition",
      get: function get() {
        return this.system.getWorldPosition().add(this.position);
      }
    }]);

    return Particle;
  }();
  /**
   * Return either the value of a randomizer, a const value, or a default empty or null.
   */


  function getConstOrRandomVector(constValOrRandomizer, returnNullIfUndefined) {
    if (!constValOrRandomizer) return returnNullIfUndefined ? null : new THREE__default['default'].Vector3();
    if (constValOrRandomizer.generate) return constValOrRandomizer.generate();
    return constValOrRandomizer.clone();
  }
  /**
   * Return either the value of a randomizer, a const value, or a default empty or null.
   */


  function getConstOrRandomColor(constValOrRandomizer, returnNullIfUndefined) {
    if (!constValOrRandomizer) return returnNullIfUndefined ? null : new THREE__default['default'].Color(1, 1, 1);
    if (constValOrRandomizer.generate) return constValOrRandomizer.generate();
    return constValOrRandomizer.clone();
  }

  var particle = Particle;

  /**
   * Implement vertex shader for our particles.
   * Author: Ronen Ness.
   * Since: 2019.
   */
  var code$1 = "\n// attributes we get from geometry\nattribute float alpha;\n\n// per-particle size\n#ifdef CONST_SIZE\n    uniform float constSize;\n#else\n    attribute float size;\n#endif\n\n// per-particle rotation\n#ifdef ROTATION\n    attribute float rotation;\n#endif\n\n// system scale when using perspective mode\n#ifdef PERSPECTIVE\n    uniform float rendererScale;\n#endif\n\n// output params for fragment shader\nvarying float vAlpha;\n\n// set per-particle color\n#ifdef COLORING\n    varying vec3 vColor;\n#endif\n\n// get per-particle rotation\n#ifdef ROTATION\n    varying float vRotation;\n#endif\n\n// vertex shader main\nvoid main() \n{\n    // alpha and color\n    vAlpha = alpha;\n\n    // set color\n    #ifdef COLORING\n        vColor = color;\n    #endif\n\n    // set const size\n    #ifdef CONST_SIZE\n        float size = constSize;\n    #endif\n\n    // set position\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    gl_Position = projectionMatrix * mvPosition;\n\n    // apply rotation\n    #ifdef ROTATION\n        vRotation = rotation;\n    #endif\n    \n    // set size - either perspective or constant\n    #ifdef PERSPECTIVE\n        gl_PointSize = size * (rendererScale / length(mvPosition.xyz));\n    #else\n        gl_PointSize = size;\n    #endif\n}\n";
  var vertex = code$1;

  /**
   * Implement fragment shader for our particles.
   * Author: Ronen Ness.
   * Since: 2019.
   */
  var code = "\n// material uniforms\nuniform vec3 globalColor;\n\n// params we get from vertex shader\nvarying float vAlpha;\n\n// per-particle color from vertex shader\n#ifdef COLORING\n    varying vec3 vColor;\n#endif\n\n// per-particle rotation from vertex shader\n#ifdef ROTATION\n    varying float vRotation;\n#endif\n\n// diffuse texture\n#ifdef TEXTURE\n    uniform sampler2D _texture;\n#endif\n\n// fragment shader main\nvoid main() \n{\n    // set default color if don't have per-particle colors\n    #ifndef COLORING\n        vec3 vColor = vec3(1,1,1);\n    #endif\n\n    // texture\n    #ifdef TEXTURE\n\n        // use rotation (rotate texture)\n        #ifdef ROTATION\n            float mid = 0.5;\n            vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - mid) + sin(vRotation) * (gl_PointCoord.y - mid) + mid,\n                          cos(vRotation) * (gl_PointCoord.y - mid) - sin(vRotation) * (gl_PointCoord.x - mid) + mid);\n            vec4 textureCol = texture2D(_texture,  rotated);\n        // no rotation\n        #else\n            vec2 coords = vec2((gl_PointCoord.x - 0.5) + 0.5, (gl_PointCoord.y - 0.5) + 0.5);\n            vec4 textureCol = texture2D(_texture, coords);\n        #endif\n\n        // get color with texture\n        gl_FragColor = vec4( globalColor * vColor, vAlpha ) * textureCol;\n        \n    // no texture (colors only)\n    #else\n        gl_FragColor = vec4( globalColor * vColor, vAlpha );\n    #endif\n\n    // check if need to discard pixel\n    #ifdef ALPHA_TEST\n        if (gl_FragColor.a < 0.00001) { discard; }\n    #endif\n}\n";
  var fragment = code;

  /**
   * Material for particles.
   */

  var ParticlesMaterial = /*#__PURE__*/function () {
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
    function ParticlesMaterial(options) {
      _classCallCheck(this, ParticlesMaterial);

      // store options
      this.options = options; // uniforms

      var uniforms = {
        globalColor: {
          value: new THREE__default['default'].Color(options.color || 0xffffff)
        },
        rendererScale: {
          value: 1
        }
      }; // set flags to change shaders behavior

      var flags = "";

      if (options.perspective) {
        flags += "#define PERSPECTIVE\n";
      }

      if (options.map) {
        flags += "#define TEXTURE\n";
        uniforms._texture = {
          value: options.map
        };
      }

      if (options.perParticleColor) {
        flags += "#define COLORING\n";
      }

      if (options.perParticleRotation) {
        flags += "#define ROTATION\n";
      }

      if (options.constSize) {
        flags += "#define CONST_SIZE\n";
        uniforms.constSize = {
          value: options.constSize
        };
      }

      if (options.alphaTest) {
        flags += "#define ALPHA_TEST\n";
      }

      flags += "\n"; // create the internal material

      var shaderMaterial = new THREE__default['default'].ShaderMaterial({
        uniforms: uniforms,
        vertexShader: flags + vertex,
        fragmentShader: flags + fragment,
        transparent: Boolean(options.transparent),
        blending: options.blending,
        vertexColors: THREE__default['default'].VertexColors,
        depthWrite: Boolean(options.depthWrite),
        depthTest: Boolean(options.depthTest)
      });
      this.material = shaderMaterial;
    }
    /**
     * Dispose the material.
     */


    _createClass(ParticlesMaterial, [{
      key: "dispose",
      value: function dispose() {
        this.material.dispose();
      }
      /**
       * Set unified scale for all particles.
       */

    }, {
      key: "setBaseScale",
      value: function setBaseScale(val) {
        if (this.options.perspective) {
          this.material.uniforms.rendererScale.value = val;
        }
      }
    }]);

    return ParticlesMaterial;
  }();

  var material = ParticlesMaterial;

  /**
   * Particles system.
   */

  var ParticlesSystem = /*#__PURE__*/function () {
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
    function ParticlesSystem(options) {
      _classCallCheck(this, ParticlesSystem);

      // store options
      options.particles = options.particles || {
        worldPosition: true
      };
      options.system = options.system || {};
      this.options = options; // to check if value is defined

      var defined = function defined(val) {
        return val !== undefined && val !== null;
      }; // get particle options


      var poptions = options.particles; // do some internal cheating to replace const size with global size

      if (typeof options.particles.size === "number") {
        console.warn("Note: replaced 'size' with 'globalSize' property since its more efficient and provided size value was constant anyway.");
        options.particles.globalSize = options.particles.size;
        delete options.particles.size;
      } // do some internal cheating to replace const color with global color


      if (options.particles.color instanceof THREE__default['default'].Color) {
        console.warn("Note: replaced 'color' with 'globalColor' property since its more efficient and you provided color value was constant anyway.");
        options.particles.globalColor = options.particles.color;
        delete options.particles.color;
      } // set some internal flags


      options.particles.fade = defined(poptions.startAlpha) || defined(poptions.alpha);
      options.particles.rotating = defined(poptions.rotationSpeed) || defined(poptions.rotation);
      options.particles.colorize = defined(poptions.color) || defined(poptions.startColor);
      options.particles.scaling = defined(poptions.size) || defined(poptions.startSize); // validate alpha params

      if (defined(poptions.startAlpha) && !defined(poptions.endAlpha)) {
        throw new Error("When providing 'startAlpha' you must also provide 'endAlpha'!");
      }

      if (defined(poptions.startAlpha) && defined(poptions.alpha)) {
        throw new Error("When providing 'alpha' you can't also provide 'startAlpha'!");
      } // validate color params


      if (defined(poptions.startColor) && !defined(poptions.endColor)) {
        throw new Error("When providing 'startColor' you must also provide 'endColor'!");
      }

      if (defined(poptions.startColor) && defined(poptions.color)) {
        throw new Error("When providing 'color' you can't also provide 'startColor'!");
      } // validate size params


      if (defined(poptions.startSize) && !defined(poptions.endSize)) {
        throw new Error("When providing 'startSize' you must also provide 'endSize'!");
      }

      if (defined(poptions.startSize) && defined(poptions.size)) {
        throw new Error("When providing 'size' you can't also provide 'startSize'!");
      } // get particles count


      var particleCount = options.system.particlesCount || 10; // get blending mode

      var blending = options.particles.blending || "opaque"; // get threejs blending mode

      var threeBlend = {
        "opaque": THREE__default['default'].NoBlending,
        "additive": THREE__default['default'].AdditiveBlending,
        "multiply": THREE__default['default'].MultiplyBlending,
        "blend": THREE__default['default'].NormalBlending
      }[blending]; // set emitters

      this._emitters = [];

      if (options.system.emitters) {
        if (options.system.emitters instanceof Array) {
          for (var i = 0; i < options.system.emitters.length; ++i) {
            this.addEmitter(options.system.emitters[i]);
          }
        } else {
          this.addEmitter(options.system.emitters);
        }
      } // has transparency?


      var isTransparent = blending !== "opaque"; // create the particle geometry

      this.particlesGeometry = new THREE__default['default'].BufferGeometry(); // set perspective mode

      var perspective = options.system.perspective !== undefined ? Boolean(options.system.perspective) : true; // create particles material

      var pMaterial = new material({
        size: options.particles.size || 10,
        color: options.particles.globalColor || 0xffffff,
        blending: threeBlend,
        perspective: perspective,
        transparent: isTransparent,
        map: options.particles.texture,
        perParticleColor: Boolean(options.particles.colorize),
        alphaTest: blending === "blend" && defined(options.particles.texture),
        constSize: defined(options.particles.globalSize) ? options.particles.globalSize : null,
        depthWrite: defined(options.system.depthWrite) ? options.system.depthWrite : true,
        depthTest: defined(options.system.depthTest) ? options.system.depthTest : true,
        perParticleRotation: options.particles.rotating
      }); // store material for later usage

      this.material = pMaterial; // store speed factor

      this.speed = options.system.speed || 1; // set system starting ttl and other params

      this.reset(); // dead particles and alive particles lists

      this._aliveParticles = [];
      this._deadParticles = []; // create all particles + set geometry attributes

      var vertices = new Float32Array(particleCount * 3);
      var colors = options.particles.colorize ? new Float32Array(particleCount * 3) : null;
      var alphas = options.particles.fade ? new Float32Array(particleCount * 1) : null;
      var sizes = options.particles.scaling ? new Float32Array(particleCount * 1) : null;
      var rotations = options.particles.rotating ? new Float32Array(particleCount * 1) : null;

      for (var p = 0; p < particleCount; p++) {
        var index = p * 3;
        vertices[index] = vertices[index + 1] = vertices[index + 2] = 0;

        if (colors) {
          colors[index] = colors[index + 1] = colors[index + 2] = 1;
        }

        if (alphas) {
          alphas[p] = 1;
        }

        if (sizes) {
          sizes[p] = 1;
        }

        if (rotations) {
          rotations[p] = 0;
        }

        this._deadParticles.push(new particle(this));
      }

      this.particlesGeometry.setAttribute('position', new THREE__default['default'].BufferAttribute(vertices, 3));

      if (alphas) {
        this.particlesGeometry.setAttribute('alpha', new THREE__default['default'].BufferAttribute(alphas, 1));
      }

      if (colors) {
        this.particlesGeometry.setAttribute('color', new THREE__default['default'].BufferAttribute(colors, 3));
      }

      if (sizes) {
        this.particlesGeometry.setAttribute('size', new THREE__default['default'].BufferAttribute(sizes, 1));
      }

      if (rotations) {
        this.particlesGeometry.setAttribute('rotation', new THREE__default['default'].BufferAttribute(rotations, 1));
      }

      this.particlesGeometry.setDrawRange(0, 0); // set scale

      this.material.setBaseScale(options.system.scale || 400); // create the particles system

      var particleSystem = new THREE__default['default'].Points(this.particlesGeometry, this.material.material);
      particleSystem.sortParticles = isTransparent; // set default render order

      if (ParticlesSystem.defaultRenderOrder !== undefined) {
        particleSystem.renderOrder = ParticlesSystem.defaultRenderOrder;
      } // store particles system


      this.particleSystem = particleSystem; // to make sure first update will update everything

      this._positionDirty = true;
      this._colorsDirty = Boolean(colors);
      this._alphaDirty = Boolean(alphas);
      this._rotateDirty = Boolean(rotations); // add it to the parent container

      if (options.container) {
        this.addTo(options.container);
      }
    }
    /**
     * Add emitter to this particles system.
     */


    _createClass(ParticlesSystem, [{
      key: "addEmitter",
      value: function addEmitter(emitter) {
        this._emitters.push(emitter);
      }
      /**
       * Dispose the entire system.
       */

    }, {
      key: "dispose",
      value: function dispose() {
        this.particlesGeometry.dispose();
        this.material.dispose();
      }
      /**
       * Return true when ttl is expired and there are no more alive particles in system.
       */

    }, {
      key: "finished",
      get: function get() {
        return this.ttlExpired && this.particlesCount === 0;
      }
      /**
       * Get if this system's ttl is expired.
       */

    }, {
      key: "ttlExpired",
      get: function get() {
        return this.ttl !== undefined && this.ttl <= 0;
      }
      /**
       * Reset particles system ttl.
       */

    }, {
      key: "reset",
      value: function reset() {
        this.ttl = this.options.system.ttl;
        this.age = 0;
        this._timeToUpdateBS = 0;
      }
      /**
       * Get system's world position.
       */

    }, {
      key: "getWorldPosition",
      value: function getWorldPosition() {
        var ret = new THREE__default['default'].Vector3();
        this.particleSystem.getWorldPosition(ret);
        return ret;
      }
      /**
       * Add the particles system to scene or container.
       * @param {THREE.Object3D} container Container to add system to.
       */

    }, {
      key: "addTo",
      value: function addTo(container) {
        container.add(this.particleSystem);
      }
      /**
       * Set a particle's color value.
       */

    }, {
      key: "setColor",
      value: function setColor(index, color) {
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

    }, {
      key: "setPosition",
      value: function setPosition(index, position) {
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

    }, {
      key: "setAlpha",
      value: function setAlpha(index, value) {
        this.particlesGeometry.attributes.alpha.array[index] = value;
        this._alphaDirty = true;
      }
      /**
       * Set particle's rotation.
       */

    }, {
      key: "setRotation",
      value: function setRotation(index, value) {
        this.particlesGeometry.attributes.rotation.array[index] = value;
        this._rotateDirty = true;
      }
      /**
       * Set particle's size.
       */

    }, {
      key: "setSize",
      value: function setSize(index, value) {
        this.particlesGeometry.attributes.size.array[index] = value;
        this._sizeDirty = true;
      }
      /**
       * Get how many particles this system currently shows.
       */

    }, {
      key: "particlesCount",
      get: function get() {
        return this._aliveParticles.length;
      }
      /**
       * Get max particles count.
       */

    }, {
      key: "maxParticlesCount",
      get: function get() {
        return this._aliveParticles.length + this._deadParticles.length;
      }
      /**
       * If ttl is expired and there are no more alive particles, remove system and dispose it.
       * @returns True if removed & disposed, false if still alive.
       */

    }, {
      key: "removeAndDisposeIfFinished",
      value: function removeAndDisposeIfFinished() {
        if (this.finished) {
          this.removeSelf();
          this.dispose();
          return true;
        }

        return false;
      }
      /**
       * Update particles system.
       */

    }, {
      key: "update",
      value: function update(deltaTime) {
        // if deltaTime is undefined, set automatically
        if (deltaTime === undefined) {
          var timeNow = new Date().getTime() / 1000.0;
          deltaTime = timeNow - this._lastTime || 0;
          this._lastTime = timeNow;
        } // delta time is 0? skip


        if (deltaTime === 0) {
          return;
        } // update ttl


        if (this.ttl !== undefined && this.ttl > 0) {
          this.ttl -= deltaTime;
        } // apply speed


        deltaTime *= this.speed; // store last delta time

        this.dt = deltaTime;
        this.age += deltaTime; // to check if number of particles changed

        var prevParticlesCount = this._aliveParticles.length; // generate particles (unless ttl expired)

        if (!this.ttlExpired) {
          for (var i = 0; i < this._emitters.length; ++i) {
            var toSpawn = this._emitters[i].update(deltaTime, this);

            if (toSpawn) {
              this.spawnParticles(toSpawn);
            }
          }
        } // update particles


        for (var i = this._aliveParticles.length - 1; i >= 0; --i) {
          // update particle
          var particle = this._aliveParticles[i];
          particle.update(i, deltaTime); // finished? remove it

          if (particle.finished) {
            this._aliveParticles.splice(i, 1);

            this._deadParticles.push(particle);
          }
        } // hide invisible vertices


        if (prevParticlesCount !== this._aliveParticles.length) {
          this.particlesGeometry.setDrawRange(0, this._aliveParticles.length);
        } // set vertices dirty flag


        this.particlesGeometry.attributes.position.needsUpdate = this._positionDirty;
        this._needBoundingSphereUpdate = this._needBoundingSphereUpdate || this._positionDirty;
        this._positionDirty = false; // set colors dirty flag

        if (this._colorsDirty) {
          this.particlesGeometry.attributes.color.needsUpdate = true;
          this._colorsDirty = false;
        } // set alphas dirty flag


        if (this._alphaDirty) {
          this.particlesGeometry.attributes.alpha.needsUpdate = true;
          this._alphaDirty = false;
        } // set size dirty flag


        if (this._sizeDirty) {
          this.particlesGeometry.attributes.size.needsUpdate = true;
          this._sizeDirty = false;
        } // set rotation dirty flag


        if (this._rotateDirty) {
          this.particlesGeometry.attributes.rotation.needsUpdate = true;
          this._rotateDirty = false;
        } // update bounding sphere


        if (this._needBoundingSphereUpdate) {
          this._timeToUpdateBS -= deltaTime;

          if (this._timeToUpdateBS <= 0) {
            this._timeToUpdateBS = 0.2;
            this.particlesGeometry.computeBoundingSphere();
          }
        } // if finished, stop here


        if (this.finished) {
          return;
        } // call optional update


        if (this.options.system.onUpdate) {
          this.options.system.onUpdate(this);
        }
      }
      /**
       * Spawn particles.
       * @param {Number} quantity Number of particles to spawn. If exceed max available particles in system, skip.
       */

    }, {
      key: "spawnParticles",
      value: function spawnParticles(quantity) {
        // spawn particles
        for (var i = 0; i < quantity; ++i) {
          // no available dead particles? skip
          if (this._deadParticles.length === 0) {
            return;
          } // spawn particle


          var particle = this._deadParticles.pop();

          particle.reset();

          this._aliveParticles.push(particle);
        }
      }
      /**
       * Remove particles system from its parent.
       */

    }, {
      key: "removeSelf",
      value: function removeSelf() {
        if (this.particleSystem.parent) {
          this.particleSystem.parent.remove(this.particleSystem);
        }
      }
    }]);

    return ParticlesSystem;
  }(); // override this to set default rendering order to all particle systems


  ParticlesSystem.defaultRenderOrder = undefined; // export the particles system

  var particles_system = ParticlesSystem;

  var randomizerOrValue = utils.randomizerOrValue;
  /**
   * Emitter class to determine rate of particles generation.
   */

  var Emitter = /*#__PURE__*/function () {
    /**
     * Create the emitter class.
     * @param {*} options Emitter options.
     * @param {*} options.onSpawnBurst Burst of particles when particle system starts; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random numbers.
     * @param {*} options.onInterval Burst of particles every interval; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random numbers.
     * @param {Number} options.interval Spawn interval time, in seconds; either a constant value (Number) or a Partykals.Randomizers.Randomizer instance to create random numbers.
     * @param {Number} options.detoretingMinTtl If provided and particle system's ttl is below this value, will start emitting less and less until stopping completely.
     */
    function Emitter(options) {
      _classCallCheck(this, Emitter);

      this.options = options;
      options.interval = options.interval || 1;
      this.age = 0;
      this.timeToSpawn = Math.random() * randomizerOrValue(options.interval);
    }
    /**
     * Update emitter and return how many particles should be generated this frame.
     */


    _createClass(Emitter, [{
      key: "update",
      value: function update(deltaTime, system) {
        // particles to generate
        var ret = 0; // first update? do burst

        if (this.age === 0 && this.options.onSpawnBurst) {
          ret += randomizerOrValue(this.options.onSpawnBurst);
        } // update age


        this.age += deltaTime; // no interval emitting? skip

        if (!this.options.onInterval) {
          return ret;
        } // check if inverval expired


        this.timeToSpawn -= deltaTime;

        if (this.timeToSpawn <= 0) {
          this.timeToSpawn = randomizerOrValue(this.options.interval);
          ret += randomizerOrValue(this.options.onInterval);
        } // do detoration


        if (this.options.detoretingMinTtl && system.ttl < this.options.detoretingMinTtl) {
          var detorateFactor = system.ttl / this.options.detoretingMinTtl;
          ret *= detorateFactor;
        } // return number of particles to generate


        return ret;
      }
    }]);

    return Emitter;
  }(); // export the emitter class


  var emitter = Emitter;

  /**
   * Define interface for a helper class to generate random vectors and colors.
   * Author: Ronen Ness.
   * Since: 2019.
  */

  /**
   * Base class for all vector randomizers.
   */
  var Randomizer = /*#__PURE__*/function () {
    function Randomizer() {
      _classCallCheck(this, Randomizer);
    }

    _createClass(Randomizer, [{
      key: "generate",
      value:
      /**
       * Generate and return a random value.
       * This is the main method to implement.
       */
      function generate() {
        throw new Error("Not implemented.");
      }
    }]);

    return Randomizer;
  }(); // export the base class


  var randomizer = Randomizer;

  /**
   * Box vector randomizer.
   */

  var BoxRandomizer = /*#__PURE__*/function (_Randomizer) {
    _inherits(BoxRandomizer, _Randomizer);

    var _super = _createSuper(BoxRandomizer);

    /**
     * Create the box randomizer from min and max vectors to randomize between.
     */
    function BoxRandomizer(min, max) {
      var _this;

      _classCallCheck(this, BoxRandomizer);

      _this = _super.call(this);
      _this.min = min || new THREE__default['default'].Vector3(-1, -1, -1);
      _this.max = max || new THREE__default['default'].Vector3(1, 1, 1);
      return _this;
    }
    /**
     * Generate a random vector.
     */


    _createClass(BoxRandomizer, [{
      key: "generate",
      value: function generate() {
        return utils.getRandomVectorBetween(this.min, this.max);
      }
    }]);

    return BoxRandomizer;
  }(randomizer); // export the randomizer class


  var box_randomizer = BoxRandomizer;

  function randMinusToOne() {
    return Math.random() * 2 - 1;
  }
  /**
   * Sphere vector randomizer.
   */


  var SphereRandomizer = /*#__PURE__*/function (_Randomizer) {
    _inherits(SphereRandomizer, _Randomizer);

    var _super = _createSuper(SphereRandomizer);

    /**
     * Create the sphere randomizer from radius and optional scaler.
     */
    function SphereRandomizer(maxRadius, minRadius, scaler, minVector, maxVector) {
      var _this;

      _classCallCheck(this, SphereRandomizer);

      _this = _super.call(this);
      _this.maxRadius = maxRadius || 1;
      _this.minRadius = minRadius || 0;
      _this.scaler = scaler;
      _this.minVector = minVector;
      _this.maxVector = maxVector;
      return _this;
    }
    /**
     * Generate a random vector.
     */


    _createClass(SphereRandomizer, [{
      key: "generate",
      value: function generate() {
        // create random vector
        var ret = new THREE__default['default'].Vector3(randMinusToOne(), randMinusToOne(), randMinusToOne()); // clamp values

        if (this.minVector || this.maxVector) {
          ret.clamp(this.minVector || new THREE__default['default'].Vector3(-1, -1, -1), this.maxVector || new THREE__default['default'].Vector3(1, 1, 1));
        } // normalize and multiply by radius


        ret.normalize().multiplyScalar(utils.getRandomBetween(this.minRadius, this.maxRadius)); // apply scaler

        if (this.scaler) {
          ret.multiply(this.scaler);
        }

        return ret;
      }
    }]);

    return SphereRandomizer;
  }(randomizer); // export the randomizer class


  var sphere_randomizer = SphereRandomizer;

  /**
   * Box vector randomizer.
   */

  var ColorsRandomizer = /*#__PURE__*/function (_Randomizer) {
    _inherits(ColorsRandomizer, _Randomizer);

    var _super = _createSuper(ColorsRandomizer);

    /**
     * Create the box randomizer from min and max colors to randomize between.
     */
    function ColorsRandomizer(min, max) {
      var _this;

      _classCallCheck(this, ColorsRandomizer);

      _this = _super.call(this);
      _this.min = min || new THREE__default['default'].Color(0, 0, 0);
      _this.max = max || new THREE__default['default'].Color(1, 1, 1);
      return _this;
    }
    /**
     * Generate a random color.
     */


    _createClass(ColorsRandomizer, [{
      key: "generate",
      value: function generate() {
        return utils.getRandomColorBetween(this.min, this.max);
      }
    }]);

    return ColorsRandomizer;
  }(randomizer); // export the randomizer class


  var colors_randomizer = ColorsRandomizer;

  /**
   * Min-Max number randomizer.
   */

  var MinMaxRandomizer = /*#__PURE__*/function (_Randomizer) {
    _inherits(MinMaxRandomizer, _Randomizer);

    var _super = _createSuper(MinMaxRandomizer);

    /**
     * Create the min-max randomizer from min and max.
     */
    function MinMaxRandomizer(min, max) {
      var _this;

      _classCallCheck(this, MinMaxRandomizer);

      _this = _super.call(this);
      _this.min = min;
      _this.max = max;
      return _this;
    }
    /**
     * Generate a random number.
     */


    _createClass(MinMaxRandomizer, [{
      key: "generate",
      value: function generate() {
        return utils.getRandomBetween(this.min, this.max);
      }
    }]);

    return MinMaxRandomizer;
  }(randomizer); // export the randomizer class


  var minmax_randomizer = MinMaxRandomizer;

  /**
   * Module main entry point.
   * Author: Ronen Ness.
   * Since: 2019.
   */
  var randomizers = {
    Randomizer: randomizer,
    BoxRandomizer: box_randomizer,
    SphereRandomizer: sphere_randomizer,
    ColorsRandomizer: colors_randomizer,
    MinMaxRandomizer: minmax_randomizer
  };

  /**
   * Module main entry point.
   * Author: Ronen Ness.
   * Since: 2019.
   */
  var partykals = {
    ParticlesSystem: particles_system,
    Particle: particle,
    Emitter: emitter,
    Utils: utils,
    Randomizers: randomizers
  };

  return partykals;

}(THREE));
