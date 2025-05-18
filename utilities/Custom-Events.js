import { world, system, Player } from "@minecraft/server"

export class CustomEvents {

    /**
      * Detects when player picks up any item.
      * @param {function({player: player, pickedItem: item})} callBack
      * @author Carchi77
      * GitHub: https://github.com/Carchi777/detect-who-picked-up-an-item
      * 
      * @example
      * import { world } from "@minecraft/server"
      * detectPlayerPickupItem((event) => {
      *  console.log(`Player ${player.nameTag} picked up ${item.amount} amount of ${item.typeId.slice(10)}`);
      * });
      * 
      */
    static onItemPickup(callBack) {
        world.beforeEvents.entityRemove.subscribe(e => {
            const { removedEntity: entity } = e;
            const item = entity.getComponent("item")?.itemStack
            if (!item) return
            const players = entity.dimension.getEntities(
                { maxDistance: 1.5, location: entity.location, type: "player" }
            )
            players.forEach(player => {
                const inv = player.getComponent('inventory').container
                const items = Array
                    .from({ length: inv.size }, (_, i) => inv.getItem(i))
                    .filter(k => k != null);
                system.run(() => {
                    const valid = Array
                        .from({ length: inv.size }, (_, i) => inv.getItem(i))
                        .filter(k => k != null)
                        .some((k, i) => k.typeId === item.typeId && k.amount != items[i]?.amount);
                    if (valid) {
                        callBack({ player: player, pickedItem: item })
                    }
                })
            })
        })
    }

    /**
      * Detects when player drops any item.
      * @param {function({player: player, droppedItem: item})} callBack
      * @author Minato (Minecraft Bedrock Arabic)
      * 
      * @example
      * import { world } from "@minecraft/server"
      * detectPlayerDropItem((event) => {
      *  world.sendMessage(`§a${item.typeId}§r was dropped by §2${player.nameTag}§r!`)
      * });
      * 
      */
    static onItemDrop(callBack) {
        world.afterEvents.entitySpawn.subscribe((event) => {
            const { entity } = event
            if (entity.typeId !== "minecraft:item") return;
            const closestPlayers = entity.dimension.getEntities({
                type: "minecraft:player",
                location: entity.location,
                maxDistance: 2,
            });
            if (closestPlayers.length == 0) return;
            const player = closestPlayers.find(p =>
                p.getRotation().x === entity.getRotation().x &&
                p.getRotation().y === entity.getRotation().y
            );
            if (!player) return;
            const item = entity.getComponent("item").itemStack

            callBack({ player: player, droppedItem: item });
        })
    }

    /**
      * Detects when a player shoots a projectile that hits another entity.
      * 
      * @param {function({player: Player, target: Entity, projectile: string})} callBack A callback function to call when a player shoots a projectile and hits another entity.
      * @param {Entity} [whom] An entity to watch for hits. If specified, the callback will only be called if the projectile hits this entity.
      * 
      * @example
      * import { world } from "@minecraft/server"
      * 
      * CustomEvents.detectPlayerShootsEvent((event) => {
      *  console.log(`Player ${event.player.name} shot at ${event.target.name}`);
      * });
      * 
      */
    static onProjectileHit(callBack, whom = null) {
        world.afterEvents.entitySpawn.subscribe(({ entity }) => {
            if (entity.typeId !== 'minecraft:arrow' && entity.typeId !== 'minecraft:trident')
                return;
            const callback = world.afterEvents.projectileHitEntity.subscribe((arg) => {
                const { source, projectile } = arg;
                const hitInfo = arg.getEntityHit();
                if (hitInfo?.entity && source instanceof Player && projectile === entity) {
                    const shooter = source; // Who shot the projectile
                    const target = hitInfo.entity; // Whom the projectile hit
                    const projectileType = projectile.typeId; // What was shot
                    // If 'whom' is specified, check if it matches the hit entity
                    if (whom && target !== whom)
                        return;
                    // Call the developer's callback with detailed event data
                    callBack({ player: shooter, target: target, projectile: projectileType });
                    // Unsubscribe after detecting the hit
                    world.afterEvents.projectileHitEntity.unsubscribe(callback);
                }
            });
        });
    }

    /**
     * Detects when a player does a double jump.
     * 
     * @param {function({player: Player})} callBack 
     * 
     * @example
     * import { world } from "@minecraft/server"
     * 
     * const player = world.getPlayers()[0];
     * CustomEvents.detectDoubleJumpEvent((player) => {
     *  console.log(`Player ${player.name} did a double jump!`);
     * });
     * 
     */
    static onDoubleJump(callBack) {
        system.runInterval(() => {
            world.getAllPlayers().forEach(player => {
                // Initialize jump tracking if not set
                if (!player.hasOwnProperty("jumpCount"))
                    player.jumpCount = 0;
                if (!player.hasOwnProperty("lastJumping"))
                    player.lastJumping = false;
                // Reset jump count when touching the ground
                if (player.isOnGround)
                    player.jumpCount = 0;
                // Detect double jump: player jumps while airborne & wasn't jumping before
                if (player.isJumping && !player.lastJumping && !player.isOnGround) {
                    player.jumpCount++;
                    if (player.jumpCount === 2) {
                        callBack(player); // Execute developer's custom function
                    }
                }
                // Store last jumping state
                player.lastJumping = player.isJumping;
            });
        });
    }

}
