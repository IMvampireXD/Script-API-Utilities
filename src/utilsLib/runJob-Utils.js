import { system } from '@minecraft/server';

/*  EXAMPLE USAGE:

const generator = function* () {
    for (let i = 0; i <= 10; i++) {
        yield i / 10; // progress
    }
    return "done";
};

new JobPromise(generator, progress => console.log("Progress:", progress))
    .then(result => console.log("Result:", result))
    .catch(err => console.error(err))
    .finally(() => console.log("Job finished!"));

*/


/**
 * JobPromise class wraps a generator-based job and provides
 * .then(), .catch(), .finally() chaining like a normal Promise.
 * Supports optional progress reporting.
 */
export default class JobPromise {
    /**
     * @param {Generator|Function} generator The generator function to run.
     * @param {(progress:any)=>void} [onProgress] Optional progress callback.
     */
    constructor(generator, onProgress) {
        this.generator = typeof generator === 'function' ? generator() : generator;
        this.onProgress = onProgress;
        this.thenCallbacks = [];
        this.catchCallbacks = [];
        this.finallyCallbacks = [];

        this._startJob();
    }

    then(callback) {
        this.thenCallbacks.push(callback);
        return this;
    }

    catch(callback) {
        this.catchCallbacks.push(callback);
        return this;
    }

    finally(callback) {
        this.finallyCallbacks.push(callback);
        return this;
    }

    _resolve(value) {
        this.thenCallbacks.forEach(cb => cb(value));
        this.finallyCallbacks.forEach(cb => cb());
    }

    _reject(error) {
        this.catchCallbacks.forEach(cb => cb(error));
        this.finallyCallbacks.forEach(cb => cb());
    }

    _startJob() {
        const generator = this.generator;
        const onProgress = this.onProgress;

        const runGenerator = () =>
            new Promise((resolve, reject) => {
                if (system.runJob) {
                    system.runJob(
                        (function* () {
                            let lastTick = 0;
                            while (true) {
                                try {
                                    const { done, value } = generator.next();
                                    if (done) {
                                        resolve(value);
                                        return;
                                    } else if (onProgress) {
                                        if (system.currentTick !== lastTick) {
                                            onProgress(value);
                                            lastTick = system.currentTick;
                                        }
                                    }
                                    yield;
                                } catch (err) {
                                    reject(err);
                                    return;
                                }
                            }
                        })()
                    );
                } else {
                    console.warn(
                        'system.runJob is not available. Running job in an inefficient way.'
                    );
                    const run = () => {
                        const startTime = Date.now();
                        let sentProgress = false;
                        while (true) {
                            try {
                                const { done, value } = generator.next();
                                if (done) {
                                    resolve(value);
                                    return;
                                } else if (onProgress && !sentProgress) {
                                    onProgress(value);
                                    sentProgress = true;
                                }
                                if (Date.now() - startTime > 4) {
                                    system.runTimeout(run, 1);
                                    return;
                                }
                            } catch (err) {
                                reject(err);
                                return;
                            }
                        }
                    };
                    run();
                }
            });

        runGenerator()
            .then(value => this._resolve(value))
            .catch(error => this._reject(error));
    }
}