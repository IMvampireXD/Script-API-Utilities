/**
 * Calculating player experience
 */
export class Experience {
    #level = 0
    #xp = 0
    #nextLevelRequiredXP = this.#calculateRequiredExp(this.#level)

    /**
     * detail: https://minecraft.fandom.com/wiki/Experience#Leveling_up
     * @param {number} level current level
     * @returns {number} level up required experience
     */
    #calculateRequiredExp(level) {
        if (level < 16) return 2 * level + 7
        if (level < 31) return 5 * level - 38

        return 9 * level - 158
    }

    /**
     * Get all experience from level 0 to current level
     * @returns {number} total experience
     */
    getTotalXP() {
        let totalXp = this.#xp
        let level = this.#level
        while (level > 0) {
            level--
            totalXp += this.#calculateRequiredExp(level)
        }
        return totalXp
    }

    /**
     * @returns {number} Next level required experience
     */
    getNextLevelRequiredXP() {
        return this.#nextLevelRequiredXP
    }

    /**
     * Add experience
     * @param {number} points required add experience points
     * @returns {this}
     */
    addXP(points) {
        this.#xp += points
        while (this.#xp >= this.#nextLevelRequiredXP) {
            this.#level++
            this.#xp -= this.#nextLevelRequiredXP
            this.#nextLevelRequiredXP = this.#calculateRequiredExp(this.#level)
        }
        return this
    }

    /**
     * Get the current level of experience
     * Assuming that the player is currently level 1 and the next level is level 2
     * and that level 2 requires 9 experience points ({@link getNextLevelRequiredXP})
     * and at this point the player only has 3 experience points, this function will return 3 experience points
     * @returns {number} current level of experience
     */
    getXP() {
        return this.#xp
    }

    /**
     * If it is set to 8 experience points, then {@link getXP} gets the experience value of 8 experience points
     * @param points required set experience points
     * @returns {this}
     */
    setXP(points) {
        this.#xp = 0
        this.addXP(points)
        return this
    }

    /**
     * Add level, assuming player level 1, after adding 2 levels it will become level 3
     * @param {number} level required add level
     * @returns {this}
     */
    addLevel(level) {
        this.#level = Math.max(0, this.#level + level)
        this.#nextLevelRequiredXP = this.#calculateRequiredExp(this.#level)
        return this
    }

    /**
     * Get current level
     * @returns {number}
     */
    getLevel() {
        return this.#level
    }

    /**
     * If set to level 8, the level {@link getLevel} gets is level 8
     * @param level required set level
     * @returns {this}
     */
    setLevel(level) {
        this.#level = 0
        this.addLevel(level)
        return this
    }
}
