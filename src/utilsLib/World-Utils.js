import {EntityQueryOptions, Entity} from '@minecraft/server';
import {DimensionUtils} from './Dimension-Utils';


export class WorldUtils {
    /**
     * Returns every entity in every dimension.
     * @type {Entity[]}
     * @param {EntityQueryOptions} options Entity query options the entities must match to get returned.
    */
    static allEntities(options=undefined) {
        return [
            ...DimensionUtils.overworld.getEntities(options),
            ...DimensionUtils.nether.getEntities(options),
            ...DimensionUtils.theEnd.getEntities(options),
        ];
    };
};
