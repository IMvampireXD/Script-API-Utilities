import { Direction } from "@minecraft/server";

/**
 * Utilities around {@link Direction}.
 */
export class DirectionUtils {
	constructor() {
		throw new Error("This class cannot be instantiated.");
	}

	/** Opposite directions */
	static Opposites = {
		[Direction.Down]: Direction.Up,
		[Direction.Up]: Direction.Down,
		[Direction.North]: Direction.South,
		[Direction.South]: Direction.North,
		[Direction.East]: Direction.West,
		[Direction.West]: Direction.East,
	};

	/** Positive perpendiculars */
	static PositivePerpendiculars = {
		[Direction.Down]: [Direction.East, Direction.North],
		[Direction.Up]: [Direction.East, Direction.North],
		[Direction.North]: [Direction.East, Direction.Up],
		[Direction.South]: [Direction.East, Direction.Up],
		[Direction.East]: [Direction.North, Direction.Up],
		[Direction.West]: [Direction.North, Direction.Up],
	};

	/** Negative perpendiculars */
	static NegativePerpendiculars = {
		[Direction.Down]: [Direction.West, Direction.South],
		[Direction.Up]: [Direction.West, Direction.South],
		[Direction.North]: [Direction.West, Direction.Down],
		[Direction.South]: [Direction.West, Direction.Down],
		[Direction.East]: [Direction.South, Direction.Down],
		[Direction.West]: [Direction.South, Direction.Down],
	};

	/** Clockwise perpendiculars */
	static ClockwisePerpendiculars = {
		[Direction.North]: Direction.East,
		[Direction.East]: Direction.South,
		[Direction.South]: Direction.West,
		[Direction.West]: Direction.North,
		[Direction.Up]: Direction.Down,
		[Direction.Down]: Direction.Up,
	};

	/** Counter-clockwise perpendiculars */
	static CounterClockwisePerpendiculars = {
		[Direction.North]: Direction.West,
		[Direction.East]: Direction.North,
		[Direction.South]: Direction.East,
		[Direction.West]: Direction.South,
		[Direction.Up]: Direction.Down,
		[Direction.Down]: Direction.Up,
	};

	/** Same axis grouping */
	static SameAxis = {
		[Direction.North]: Direction.North,
		[Direction.South]: Direction.North,
		[Direction.East]: Direction.East,
		[Direction.West]: Direction.East,
		[Direction.Up]: Direction.Up,
		[Direction.Down]: Direction.Up,
	};

	/** Map from string to direction */
	static FromString = {
		north: Direction.North,
		east: Direction.East,
		south: Direction.South,
		west: Direction.West,
		up: Direction.Up,
		down: Direction.Down,
	};

	/** All values */
	static Values = [
		Direction.Down,
		Direction.Up,
		Direction.North,
		Direction.South,
		Direction.East,
		Direction.West,
	];

	/**
	 * Reverse a direction.
	 * @param {Direction} direction
	 * @returns {Direction}
	 */
	static reverse(direction) {
		return this.Opposites[direction];
	}

	/**
	 * Get block relative to origin in direction.
	 * @param {import("@minecraft/server").Vector3 & { above?: Function, below?: Function, north?: Function, south?: Function, east?: Function, west?: Function }} origin
	 * @param {Direction} direction
	 * @param {number} [steps=1]
	 */
	static getRelativeBlockAt(origin, direction, steps = 1) {
		switch (direction) {
			case Direction.Up: return origin.above(steps);
			case Direction.Down: return origin.below(steps);
			case Direction.North: return origin.north(steps);
			case Direction.South: return origin.south(steps);
			case Direction.West: return origin.west(steps);
			case Direction.East: return origin.east(steps);
			default: throw new Error(`Unknown direction: ${direction}`);
		}
	}

	/**
	 * Convert block permutation "minecraft:cardinal_direction" to Direction.
	 * @param {import("@minecraft/server").BlockPermutation} permutation
	 */
	static getBlockCardinalDirection(permutation) {
		switch (permutation.getState("minecraft:cardinal_direction")) {
			case "north": return Direction.North;
			case "south": return Direction.South;
			case "west": return Direction.West;
			case "east": return Direction.East;
		}
	}

	/**
	 * Convert block permutation "minecraft:block_face" to Direction.
	 * @param {import("@minecraft/server").BlockPermutation} permutation
	 */
	static getBlockFace(permutation) {
		switch (permutation.getState("minecraft:block_face")) {
			case "up": return Direction.Up;
			case "down": return Direction.Down;
			case "north": return Direction.North;
			case "south": return Direction.South;
			case "west": return Direction.West;
			case "east": return Direction.East;
		}
	}

	/**
	 * Get nearest direction from vector diff.
	 * @param {{x:number,y:number,z:number}} diff
	 * @returns {Direction}
	 */
	static getNearestDirection(diff) {
		if (Math.abs(diff.x) >= Math.abs(diff.y) && Math.abs(diff.x) >= Math.abs(diff.z)) {
			return diff.x > 0 ? Direction.East : Direction.West;
		} else if (Math.abs(diff.y) >= Math.abs(diff.x) && Math.abs(diff.y) >= Math.abs(diff.z)) {
			return diff.y > 0 ? Direction.Up : Direction.Down;
		} else {
			return diff.z > 0 ? Direction.South : Direction.North;
		}
	}

	/**
	 * Get axis index from vector diff.
	 * @param {{x:number,y:number,z:number}} diff
	 * @returns {0|1|2|undefined}
	 */
	static getAxisFromDiff(diff) {
		if (diff.x !== 0 && diff.y === 0 && diff.z === 0) return 2;
		if (diff.x === 0 && diff.y !== 0 && diff.z === 0) return 0;
		if (diff.x === 0 && diff.y === 0 && diff.z !== 0) return 1;
	}

	/**
	 * Map cardinal string direction to integer.
	 * @param {string} direction
	 * @returns {number}
	 */
	static cardinalToDirectionInt(direction) {
		switch (direction) {
			case "up": return 0;
			case "down": return 1;
			case "south": return 2;
			case "north": return 3;
			case "east": return 4;
			default: return 5;
		}
	}

	/**
	 * Convert direction string to axis index.
	 * @param {string} direction
	 * @returns {0|1|2}
	 */
	static directionToAxis(direction) {
		switch (direction) {
			case "up":
			case "down":
				return 0;
			case "north":
			case "south":
				return 1;
			default:
				return 2;
		}
	}
}