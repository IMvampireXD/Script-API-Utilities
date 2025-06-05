import { Direction } from "@minecraft/server";

/** Utilities around {@link Direction}. */
export class DirectionUtils {
    constructor() {
        throw new Error("This class cannot be instantiated.");
    }

    /**
     * Reverse a direction.
     * @param {Direction} direction - Original direction.
     * @returns {Direction} Reversed version of `direction`.
     */
    static reverse(direction) {
        switch (direction) {
            case Direction.Up:
                return Direction.Down;
            case Direction.Down:
                return Direction.Up;
            case Direction.North:
                return Direction.South;
            case Direction.South:
                return Direction.North;
            case Direction.West:
                return Direction.East;
            case Direction.East:
                return Direction.West;
        }
    }

    /**
     * Retrieves a block relative to the given origin block in the specified direction and number of steps.
     * @param {import("@minecraft/server").Vector3} origin - The starting block from which to calculate the relative position.
     * @param {Direction} direction - The direction in which to move relative to the origin block.
     * @param {number} [steps=1] - The number of steps to move in the specified direction (default is 1).
     * @returns {import("@minecraft/server").Block | undefined} The block at the relative position, could be undefined.
     */
    static getRelativeBlockAt(origin, direction, steps = 1) {
        switch (direction) {
            case Direction.Up:
                return origin.above(steps);
            case Direction.Down:
                return origin.below(steps);
            case Direction.North:
                return origin.north(steps);
            case Direction.South:
                return origin.south(steps);
            case Direction.West:
                return origin.west(steps);
            case Direction.East:
                return origin.east(steps);
            default:
                throw new Error(`Unknown direction: ${direction}`);
        }
    }

    /**
     * Gets the value of `minecraft:cardinal_direction` state of a block permutation, and converts it to a Direction.
     * @param {import("@minecraft/server").BlockPermutation} permutation - Block permutation.
     * @returns {Direction | undefined} Direction, undefined if the state does not exist.
     */
    static getBlockCardinalDirection(permutation) {
        const blockDir = permutation.getState("minecraft:cardinal_direction");

        switch (blockDir) {
            case "north":
                return Direction.North;
            case "south":
                return Direction.South;
            case "west":
                return Direction.West;
            case "east":
                return Direction.East;
        }

        return undefined;
    }

    /**
     * Gets the value of `minecraft:block_face` state of a block permutation, and converts it to a Direction.
     * @param {import("@minecraft/server").BlockPermutation} permutation - Block permutation.
     * @returns {Direction | undefined} Direction, undefined if the state does not exist.
     */
    static getBlockFace(permutation) {
        const blockDir = permutation.getState("minecraft:block_face");

        switch (blockDir) {
            case "up":
                return Direction.Up;
            case "down":
                return Direction.Down;
            case "north":
                return Direction.North;
            case "south":
                return Direction.South;
            case "west":
                return Direction.West;
            case "east":
                return Direction.East;
        }

        return undefined;
    }
}
