
export class LocationUtils {

    /**
     * Returns the distance between two Vector3 locations.
     * @param {Vector3} pos1 - First position
     * @param {Vector3} pos2 - Second position
     * @returns {number} Distance in blocks
     */
    static getDistance(pos1, pos2) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dz = pos2.z - pos1.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Floors the coordinates of a Vector3 location
     * @param {Vector3} location 
     * @returns 
     */
    static floorLocation(location) {
        return {
            x: Math.floor(location.x),
            y: Math.floor(location.y),
            z: Math.floor(location.z)
        }
    }

    /**
     * Compares two location.
     * @param {Vector3} pos1 
     * @param {Vector3} pos2 
     * @returns {boolean}
     */
    static isEqualLocation(pos1, pos2) {
        if (
            Math.floor(pos1.x) === Math.floor(pos2.x) &&
            Math.floor(pos1.y) === Math.floor(pos2.y) &&
            Math.floor(pos1.z) === Math.floor(pos2.z)
        ) return true;
        else return false;
    }

    /**
     * Converts a Vector3 location to a space-separated XYZ string.
     * Useful for runCommand that require position as a string.
     * 
     * @param {Vector3} location 
     * @returns {string}
     */
    static getLocationString(location) {
        return `${Math.floor(location.x)} ${Math.floor(location.y)} ${Math.floor(location.z)}`;
    }

}
