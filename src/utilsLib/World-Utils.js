import { EntityQueryOptions, Entity, world } from '@minecraft/server';
import { DimensionUtils } from './Dimension-Utils';

export default class TimeOfDay {
    static Day = 1000
    static Noon = 6000
    static Sunset = 12000
    static Night = 13000
    static Midnight = 18000
    static Sunrise = 23000
}

export class WorldUtils {

    /**
     * Checks if it is daytime in the overworld.
     * @returns {boolean} 
     */
    static checkIfDaytime() {
        const time = world.getTimeOfDay();
        return time < 13000;
    }

    /**
     * Returns every entity in every dimension.
     * @type {Entity[]}
     * @param {EntityQueryOptions} options Entity query options the entities must match to get returned.
    */
    static allEntities(options = undefined) {
        return [
            ...DimensionUtils.overworld.getEntities(options),
            ...DimensionUtils.nether.getEntities(options),
            ...DimensionUtils.theEnd.getEntities(options),
        ];
    };
};
