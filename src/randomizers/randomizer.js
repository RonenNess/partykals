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