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
            uniforms.texture = { value: options.map };
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
            depthTest:     Boolean(options.depthTest),
        });
        this.material = shaderMaterial;
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