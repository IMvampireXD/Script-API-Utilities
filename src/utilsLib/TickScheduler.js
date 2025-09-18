
export class TickScheduler {

    constructor(paused = true) {
        this.#tick = 0;
        this.#paused = Boolean(paused);
        this.#callbacks = {}

        this.#id = system.runInterval(() => {
            if (this.isOnPause) return;
            this.tick();
        });
    }
    #tick
    #paused
    #id
    #callbacks

    get currentTick() { return Number(this.#tick); }
    get isOnPause() { return Boolean(this.#paused); }

    play() { this.#paused = false; return this; }
    pause() { this.#paused = true; return this; }

    /** @param {() => Void} callback @returns {String} id */
    run(callback, delay = 1, isInterval = false) {
        const id = String(this.currentTick + Math.random());
        this.#callbacks[id] = {
            delay: Math.max(1, Number(delay) || 1),
            tick: Math.max(1, Number(delay) || 1),
            paused: false,
            isInterval: Boolean(isInterval),
            callback: callback
        }

        return id;
    }

    /** @param {String} id */
    clearRun(id) { delete this.#callbacks[id]; }

    /** @param {String} id */
    playRun(id) { if (this.#callbacks[id]) this.#callbacks[id].paused = false; }

    /** @param {String} id */
    pauseRun(id) { if (this.#callbacks[id]) this.#callbacks[id].paused = true; }

    /** @param {String} id */
    isRunOnPause(id) { return Boolean(this.#callbacks[id]?.paused) }

    tick() {
        for (const id of Object.keys(this.#callbacks)) {
            const callback = this.#callbacks[id]
            if (callback.paused) continue;

            if (callback.tick <= 0) { callback.callback(); callback.tick = callback.delay + 0; }
            else callback.tick -= 1;

            if (!callback.isInterval) this.clearRun(id);
        }

        this.#tick += 1;
    }

    remove() { system.clearRun(this.#id); }
}