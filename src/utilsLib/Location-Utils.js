import { Vec3 } from "Vec3-Utils.js";

export class LocationUtils {

	/**
	 * Finds a location based on their view direction and the scaling factors from the players current position, the same as ^^^ in commands.
	 * @param {object} player - The player object to base the view direction and starting position on.
	 * @param {number} xf - The scaling factor for the x direction.
	 * @param {number} yf - The scaling factor for the y direction.
	 * @param {number} zf - The scaling factor for the z direction.
	 * @returns {{x: number, y: number, z: number}} The transformed location.
	 */
	static calcVectorOffset(player, xf, yf, zf, d = player.getViewDirection(), l = player.location) {
		let m = Math.hypot(d.x, d.z);
		let xx = LocationUtils.normalizeVector({
			x: d.z,
			y: 0,
			z: -d.x
		}, xf);
		let yy = LocationUtils.normalizeVector({
			x: (d.x / m) * -d.y,
			y: m,
			z: (d.z / m) * -d.y
		}, yf);
		let zz = LocationUtils.normalizeVector(d, zf);

		return {
			x: l.x + xx.x + yy.x + zz.x,
			y: l.y + xx.y + yy.y + zz.y,
			z: l.z + xx.z + yy.z + zz.z
		};
	}

	/**
	 * Rotates a given offset vector (offset) based on a specified StructureRotation (None, 90°, 180°, or 270° clockwise).
	 * @param offset 
	 * @param rotation 
	 * @returns {Vector3}
	 */
	static rotateOffset(offset, rotation) {
		switch (rotation) {
			case StructureRotation.None:
				return offset;
			case StructureRotation.Rotate90:
				return { x: -offset.z, y: offset.y, z: offset.x };
			case StructureRotation.Rotate180:
				return { x: -offset.x, y: offset.y, z: -offset.z };
			case StructureRotation.Rotate270:
				return { x: offset.z, y: offset.y, z: -offset.x };
			default:
				return offset;
		}
	}

	/**
	 * Calculates the minimum world position (i.e. the corner of the bounding box) where a rotated structure should be placed so that a certain anchor point (anchorOffset) within the structure aligns with the given world position (placementPos).
	 * @param placementPos - the world position where the anchor should end up.
	 * @param anchorOffset - the position of the anchor point inside the structure (relative to its local origin).
	 * @param bounds - defining the local bounds of the structure.
	 * @param rotation - the applied structure rotation.
	 * @returns {Vector3}
	 */
	static calculateMinPosition(
		placementPos,
		anchorOffset,
		bounds,
		rotation
	) {
		const rotatedOffset = LocationUtils.rotateOffset(anchorOffset, rotation);

		const structureSize = {
			x: bounds.max.x - bounds.min.x,
			y: bounds.max.y - bounds.min.y,
			z: bounds.max.z - bounds.min.z
		};

		let minPos = Vec3.sub(placementPos, rotatedOffset);

		switch (rotation) {
			case StructureRotation.Rotate90:
				minPos = Vec3.sub(minPos, { x: structureSize.z, y: 0, z: 0 });
				break;
			case StructureRotation.Rotate180:
				minPos = Vec3.sub(minPos, { x: structureSize.x, y: 0, z: structureSize.z });
				break;
			case StructureRotation.Rotate270:
				minPos = Vec3.sub(minPos, { x: 0, y: 0, z: structureSize.x });
				break;
		}

		return minPos;
	}

	static isInsideBox(point, boxMin, boxMax) {
		return point.x >= boxMin.x && point.x <= boxMax.x &&
			point.y >= boxMin.y && point.y <= boxMax.y &&
			point.z >= boxMin.z && point.z <= boxMax.z;
	}

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
	 * Calculates the magnitude of a Vector3.
	 * @param {Vector3} entityPosition - The Vector3 input.
	 * @returns {number} The magnitude of the vector.
	 */
	static magnitude(vector) {
		return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
	};

	/**
	 * Normalizes the given vector and scales it by the factor `s`.
	 * @param {Vector3} vector - The 3D vector to normalize.
	 * @param {number} s - The scale factor to apply to the normalized vector.
	 * @returns {Vector3} The normalized and scaled vector.
	 */
	static normalizeVector(vector, s) {
		let l = Math.hypot(vector.x, vector.y, vector.z)
		return {
			x: s * (vector.x / l),
			y: s * (vector.y / l),
			z: s * (vector.z / l)
		}
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
			z: Math.floor(location.z),
		};
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
