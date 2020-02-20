/**
 * Implement vertex shader for our particles.
 * Author: Ronen Ness.
 * Since: 2019.
 */
export default`
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
