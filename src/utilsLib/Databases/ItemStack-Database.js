import { world, system, ItemStack, Player, Entity } from '@minecraft/server';

// About the project

// QIDB - QUICK ITEM DATABASE
// GitHub:          https://github.com/Carchi777/QUICK-ITEM-DATABASE
// Discord:         https://discord.com/channels/523663022053392405/1252014916496527380

// Made by Carchi77
// My Github:       https://github.com/Carchi777
// My Discord:      https://discordapp.com/users/985593016867778590


function date() {
    const date = new Date(Date.now())
    const ms = date.getMilliseconds().toString().padStart(3, "0")
    return `${date.toLocaleString().replace(' AM', `.${ms} AM`).replace(' PM', `.${ms} PM`)}`
}
export class QIDB {
    /**
     * @param {string} namespace The unique namespace for the database keys.
     * @param {number} cacheSize Quick the max amount of keys to keep quickly accessible. A small size can couse lag on frequent iterated usage, a large number can cause high hardware RAM usage.
     * @param {number} saveRate the background saves per tick, (high performance impact) saveRate1 is 20 keys per second
     */
    constructor(namespace = "", cacheSize = 50, saveRate = 1) {
        system.run(() => {
            const self = this
            this.#settings = {
                namespace: namespace
            };
            this.#queuedKeys = []
            this.#queuedValues = []
            this.#quickAccess = new Map()
            this.#validNamespace = /^[A-Za-z0-9_]*$/.test(this.#settings.namespace)
            this.#dimension = world.getDimension("overworld");
            this.logs
            function startLog() {
                console.log(
                    `§qQIDB > is initialized successfully.§r namespace: ${self.#settings.namespace} §r${date()} `
                );

                if (saveRate > 1) {
                    console.warn(
                        `§c§lWARNING! \n§r§cQIDB > using a saveRate bigger than 1 can cause slower game ticks and extreme lag while saving 1024 size keys. at <${self.#settings.namespace}> §r${date()} `
                    );
                    world.getPlayers().forEach(player => {
                        if (player.isOp) {
                            player.sendMessage(
                                `§c§lWARNING! \n§r§cQIDB > using a saveRate bigger than 1 can cause slower game ticks and extreme lag while saving 1024 size keys. at <${self.#settings.namespace}> §r${date()} `
                            )
                        }
                    })
                }

            }
            const VALID_NAMESPACE_ERROR = new Error(`§cQIDB > ${namespace} isn't a valid namespace. accepted char: A-Z a-z 0-9 _ §r${date()}`)
            let sl = world.scoreboard.getObjective('qidb')
            this.#sL;
            const player = world.getPlayers()[0]
            if (!this.#validNamespace) throw VALID_NAMESPACE_ERROR;
            if (player)
                if (!sl || sl?.hasParticipant('x') === false) {
                    if (!sl) sl = world.scoreboard.addObjective('qidb');
                    sl.setScore('x', player.location.x)
                    sl.setScore('z', player.location.z)
                    this.#sL = { x: sl.getScore('x'), y: 318, z: sl.getScore('z') }
                    this.#dimension.runCommand(`/tickingarea add ${this.#sL.x} 319 ${this.#sL.z} ${this.#sL.x} 318 ${this.#sL.z} storagearea`);
                    startLog()
                } else {
                    this.#sL = { x: sl.getScore('x'), y: 318, z: sl.getScore('z') }
                    startLog()
                }
            world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
                if (!this.#validNamespace) throw VALID_NAMESPACE_ERROR;
                if (!initialSpawn) return;
                if (!sl || sl?.hasParticipant('x') === false) {
                    if (!sl) sl = world.scoreboard.addObjective('qidb');
                    sl.setScore('x', player.location.x)
                    sl.setScore('z', player.location.z)
                    this.#sL = { x: sl.getScore('x'), y: 318, z: sl.getScore('z') }
                    this.#dimension.runCommand(`/tickingarea add ${this.#sL.x} 319 ${this.#sL.z} ${this.#sL.x} 318 ${this.#sL.z} storagearea`);
                    startLog()
                } else {
                    this.#sL = { x: sl.getScore('x'), y: 318, z: sl.getScore('z') }
                    startLog()
                }
            })
            let show = true
            let runId
            let lastam
            system.runInterval(() => {
                const diff = self.#quickAccess.size - cacheSize;
                if (diff > 0) {
                    for (let i = 0; i < diff; i++) {
                        self.#quickAccess.delete(self.#quickAccess.keys().next()?.value);
                    }
                }
                if (self.#queuedKeys.length) {

                    if (!runId) {

                        log()
                        runId = system.runInterval(() => {
                            log()
                        }, 120)
                    }
                    show = false
                    const k = Math.min(saveRate, this.#queuedKeys.length)
                    for (let i = 0; i < k; i++) {
                        this.#romSave(this.#queuedKeys[0], this.#queuedValues[0]);
                        this.#queuedKeys.shift();
                        this.#queuedValues.shift()
                    }
                } else if (runId) {
                    system.clearRun(runId)
                    runId = undefined
                    show == false && this.logs.save == true && console.log(`§aQIDB >Saved, You can now close the world safely. §r${date()}`)
                    show = true
                    return
                } else return
            }, 1)
            function log() {
                const abc = (-(self.#queuedKeys.length - lastam) / 6).toFixed(0) || '//'
                self.logs.save == true && console.log(`§eQIDB > Saving, Dont close the world.\n§r[Stats]-§eRemaining: ${self.#queuedKeys.length} keys | speed: ${abc} keys/s §r${date()}`)
                lastam = self.#queuedKeys.length
            }
            system.beforeEvents.shutdown.subscribe(() => {
                if (this.#queuedKeys.length) {
                    console.error(
                        `\n\n\n\n§c§lQIDB > Fatal Error >§r§c World closed too early, items not saved correctly.  \n\n` +
                        `Namespace: ${this.#settings.namespace}\n` +
                        `Lost Keys amount: ${this.#queuedKeys.length} §r${date()}\n\n\n\n`
                    )
                }
            })
        })
    }
    logs = {
        startUp: true,
        save: true,
        load: true,
        set: true,
        get: true,
        has: true,
        delete: true,
        clear: true,
        values: true,
        keys: true,
    };
    #validNamespace;
    #queuedKeys;
    #settings;
    #quickAccess;
    #queuedValues;
    #dimension;
    #sL;
    #load(key, length) {
        if (key.length > 30) throw new Error(`§cQIDB > Out of range: <${key}> has more than 30 characters §r${date()}`)
        let canStr = false;
        try {
            world.structureManager.place(key, this.#dimension, this.#sL, { includeEntities: true });
            canStr = true;

        } catch {
            console.log(length)
            for (let i = 0; i < length; i++)
                this.#dimension.spawnEntity("qidb:storage", this.#sL);
        }
        /**@type {Entity[]} */
        const entities = this.#dimension.getEntities({ location: this.#sL, type: "qidb:storage" });
        /**@type {Container[]} */
        if (entities.length < length) {
            for (let i = entities.length; i < length; i++)
                entities.push(this.#dimension.spawnEntity("qidb:storage", this.#sL))
        }
        if (entities.length > length) {
            console.log('entities.length > length: ', entities.length, '>', length, entities.length > length)
            for (let i = entities.length; i > length; i--) {
                console.log('removed', i)
                entities[i - 1].remove()
                entities.pop()
            }
        }
        const invs = []
        entities.forEach(entity => {
            invs.push(entity.getComponent("inventory").container)
        })

        this.logs.load == true && console.log(`§aQIDB > Loaded ${entities.length} entities <${key}> §r${date()}`)
        return { canStr, invs };
    }
    async #save(key, canStr) {
        if (canStr) world.structureManager.delete(key);
        world.structureManager.createFromWorld(key, this.#dimension, this.#sL, this.#sL, { saveMode: "World", includeEntities: true });
        const entities = this.#dimension.getEntities({ location: this.#sL, type: "qidb:storage" });
        entities.forEach(e => e.remove());
    }

    async #queueSaving(key, value) {
        this.#queuedKeys.push(key)
        this.#queuedValues.push(value)
    }
    async #romSave(key, value) {
        const { canStr, invs } = this.#load(key, (Math.floor((value?.length - 1) / 256) + 1) || 1);
        invs.forEach((inv, index) => {
            if (!value) for (let i = 256 * index; i < 256 * index + 256; i++) inv.setItem(i - 256 * index, undefined), world.setDynamicProperty(key, null);
            if (Array.isArray(value)) {
                try { for (let i = 256 * index; i < 256 * index + 256; i++) inv.setItem(i - 256 * index, value[i] || undefined) } catch { throw new Error(`§cQIDB > Invalid value type. supported: ItemStack | ItemStack[] | undefined §r${date()}`) }
                world.setDynamicProperty(key, (Math.floor((value?.length - 1) / 256) + 1) || 1)
            } else {
                try { inv.setItem(0, value), world.setDynamicProperty(key, false) } catch { throw new Error(`§cQIDB > Invalid value type. supported: ItemStack | ItemStack[] | undefined §r${date()}`) }
            }
        })
        this.#save(key, canStr);
    }

    /**
     * Sets a value as a key in the item database.
     * @param {string} key The unique identifier of the value.
     * @param {ItemStack[] | ItemStack} value The `ItemStack[]` or `itemStack` value to set.
     * @throws Throws if `value` is an array that has more than 512 items.
     */
    set(key, value) {
        if (!this.#validNamespace) throw new Error(`§cQIDB > Invalid name: <${this.#settings.namespace}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        if (!/^[A-Za-z0-9_]*$/.test(key)) throw new Error(`§cQIDB > Invalid name: <${key}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        const time = Date.now();
        key = this.#settings.namespace + ":" + key;
        if (Array.isArray(value)) {
            if (value.length > 1024) throw new Error(`§cQIDB > Out of range: <${key}> has more than 1024 ItemStacks §r${date()}`)
            world.setDynamicProperty(key, (Math.floor((value?.length - 1) / 256) + 1) || 1)
        } else {
            world.setDynamicProperty(key, false)
        }
        this.#quickAccess.set(key, value)
        if (this.#queuedKeys.includes(key)) {
            const i = this.#queuedKeys.indexOf(key)
            this.#queuedValues.splice(i, 1)
            this.#queuedKeys.splice(i, 1)
        }
        this.#queueSaving(key, value)
        this.logs.set == true && console.log(`§aQIDB > Set key <${key}> succesfully. ${Date.now() - time}ms §r${date()}`)

    }
    /**
     * Gets the value of a key from the item database.
     * @param {string} key The identifier of the value.
     * @returns {ItemStack | ItemStack[]} The `ItemStack` | `ItemStack[]` saved as `key`
     * @throws Throws if the key doesn't exist.
     */
    get(key) {
        if (!this.#validNamespace) throw new Error(`§cQIDB > Invalid name: <${this.#settings.namespace}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        if (!/^[A-Za-z0-9_]*$/.test(key)) throw new Error(`§cQIDB > Invalid name: <${key}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        const time = Date.now();
        key = this.#settings.namespace + ":" + key;
        if (this.#quickAccess.has(key)) {
            this.logs.get == true && console.log(`§aQIDB > Got key <${key}> succesfully. ${Date.now() - time}ms §r${date()}`)
            return this.#quickAccess.get(key);
        }
        const structure = world.structureManager.get(key)
        if (!structure) throw new Error(`§cQIDB > The key < ${key} > doesn't exist.`);
        const { canStr, invs } = this.#load(key);
        const items = [];
        invs.forEach((inv, index) => {
            for (let i = 256 * index; i < 256 * index + 256; i++) items.push(inv.getItem(i - 256 * index));
            for (let i = 256 * index + 255; i >= 0; i--) if (!items[i]) items.pop(); else break;
        })
        this.#save(key, canStr);

        this.logs.get == true && console.log(`§aQIDB > Got items from <${key}> succesfully. ${Date.now() - time}ms §r${date()}`)

        if (world.getDynamicProperty(key)) { this.#quickAccess.set(key, items); return items }
        else { this.#quickAccess.set(key, items[0]); return items[0]; }
    }
    /**
     * Checks if a key exists in the item database.
     * @param {string} key The identifier of the value.
     * @returns {boolean}`true` if the key exists, `false` if the key doesn't exist.
     */
    has(key) {
        if (!this.#validNamespace) throw new Error(`§cQIDB > Invalid name: <${this.#settings.namespace}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        if (!/^[A-Za-z0-9_]*$/.test(key)) throw new Error(`§cQIDB > Invalid name: <${key}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        const time = Date.now();
        key = this.#settings.namespace + ":" + key;
        const exist = this.#quickAccess.has(key) || world.structureManager.get(key)
        this.logs.has == true && console.log(`§aQIDB > Found key <${key}> succesfully. ${Date.now() - time}ms §r${date()}`)


        if (exist) return true; else return false
    }
    /**
     * Deletes a key from the item database.
     * @param {string} key The identifier of the value.
                    * @throws Throws if the key doesn't exist.
                    */
    delete(key) {
        if (!this.#validNamespace) throw new Error(`§cQIDB > Invalid name: <${this.#settings.namespace}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        if (!/^[A-Za-z0-9_]*$/.test(key)) throw new Error(`§cQIDB > Invalid name: <${key}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        const time = Date.now();
        key = this.#settings.namespace + ":" + key;
        if (this.#quickAccess.has(key)) this.#quickAccess.delete(key)
        const structure = world.structureManager.get(key)
        if (structure) world.structureManager.delete(key), world.setDynamicProperty(key, null);
        else throw new Error(`§cQIDB > The key <${key}> doesn't exist. §r${date()}`);
        this.logs.delete == true && console.log(`§aQIDB > Deleted key <${key}> succesfully. ${Date.now() - time}ms §r${date()}`)
    }
    /**
     * Gets all the keys of your namespace from item database.
     * @return {string[]} All the keys as an array of strings.
                        */
    keys() {
        if (!this.#validNamespace) throw new Error(`§cQIDB > Invalid name: <${this.#settings.namespace}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        const allIds = world.getDynamicPropertyIds()
        const ids = []
        allIds.filter(id => id.startsWith(this.#settings.namespace + ":")).forEach(id => ids.push(id.replace(this.#settings.namespace + ":", "")))
        this.logs.keys == true && console.log(`§aQIDB > Got the list of all the ${ids.length} keys. §r${date()}`)

        return ids;
    }
    /**
     * Gets all the keys of your namespace from item database (takes some time if values aren't alredy loaded in quickAccess).
     * @return {ItemStack[][]} All the values as an array of ItemStack or ItemStack[].
                            */
    values() {
        if (!this.#validNamespace) throw new Error(`§cQIDB > Invalid name: <${this.#settings.namespace}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        const time = Date.now();
        const allIds = world.getDynamicPropertyIds()
        const values = []
        const filtered = allIds.filter(id => id.startsWith(this.#settings.namespace + ":")).map(id => id.replace(this.#settings.namespace + ":", ""))
        for (const key of filtered) {
            values.push(this.get(key));
        }
        this.logs.values == true && console.log(`§aQIDB > Got the list of all the ${values.length} values. ${Date.now() - time}ms §r${date()}`)

        return values;
    }
    /**
     * Clears all, CAN NOT REWIND.
     */
    clear() {
        if (!this.#validNamespace) throw new Error(`§cQIDB > Invalid name: <${this.#settings.namespace}>. accepted char: A-Z a-z 0-9 _ §r${date()}`);
        const time = Date.now();
        const allIds = world.getDynamicPropertyIds()
        const filtered = allIds.filter(id => id.startsWith(this.#settings.namespace + ":")).map(id => id.replace(this.#settings.namespace + ":", ""))
        for (const key of filtered) {
            this.delete(key)
        }
        this.logs.clear == true && console.log(`§aQIDB > Cleared, deleted ${filtered.length} values. ${Date.now() - time}ms §r${date()}`)

    }
}