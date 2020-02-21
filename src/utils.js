/**
 * Implement a single particle in the particles system.
 * Author: Ronen Ness.
 * Since: 2019.
*/
import {
    Color,
    Vector3
} from 'three';

/**
* Returns a random number between min (inclusive) and max (exclusive)
*/
export const getRandomBetween = (min, max) => {
    return Math.random() * (max - min) + min;
};

/**
 * Get random between baseVal and baseVal + extraRandom.
 * If 'extraRandom' is not defined, will just return baseVal.
 * If baseVal is not defined, will return white.
 */
export const getRandomWithSpread = (baseVal, extraRandom) => {
    if (!extraRandom) { return baseVal; }
    return getRandomBetween(baseVal, baseVal + extraRandom);
};

/**
 * Get random between two colors.
 * If 'colMax' is not defined, will just return colMin or white color if not defined.
 */
export const getRandomColorBetween = (colMin, colMax) => {
    if (!colMax) { return colMin ? colMin.clone() : new Color(); }
    return new Color(
        getRandomBetween(colMin.r, colMax.r),
        getRandomBetween(colMin.g, colMax.g),
        getRandomBetween(colMin.b, colMax.b),
    );
};

/**
 * Get random between two vectors.
 * If 'vecMax' is not defined, will just return vecMin or zero point if not defined.
 */
export const getRandomVectorBetween = (vecMin, vecMax) => {
    if (!vecMax) { return vecMin ? vecMin.clone() : new Vector3(); }
    return new Vector3(
        getRandomBetween(vecMin.x, vecMax.x),
        getRandomBetween(vecMin.y, vecMax.y),
        getRandomBetween(vecMin.z, vecMax.z),
    );
};

/**
 * Lerp between two colors, returning a new color without changing any of them.
 */
export const lerpColors = (colA, colB, alpha) => {
    return colA.clone().lerp(colB, alpha);
};

/**
 * Lerp between two numbers.
 */
export const lerp = (x, y, alpha) => {
    return (x * (1-alpha)) + (y * alpha)
};

/**
 * Get const numeric value or generate random value from randomizer.
 */
export const randomizerOrValue = (val) => {
    return (val.generate ? val.generate() : val) || 0;
};
