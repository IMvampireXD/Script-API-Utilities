import { system } from "@minecraft/server";

/**
 * Enums for task statuses.
 */
export const TaskStatus = {
  Pending: "pending",
  Running: "running",
  Paused: "paused",
  Completed: "completed",
  Failed: "failed",
  Aborted: "aborted",
};

/**
 * TaskScheduler schedules and manages tasks allowing to pause, resume, or abort tasks.
 *
 * USAGE EXAMPLE:
 * 
 * const id = TaskScheduler.runInterval(() => {
 *   console.warn("A task that runs every 20 ticks");
 * }, 20);
 *
 * console.warn(id.getStatus()); // "running"
 * 
 * id.pause(); // Pause the task
 * 
 * console.log(id.getStatus()); // "paused"
 * 
 * id.start(); // Resume the task again
 *
 * TaskScheduler.runTimeout(() => {
 *   console.warn("Runs once after 30 ticks");
 * }, 30).onComplete(() => {
 *   console.warn("The task has completed successfully");
 * });
 * 
 */
export class TaskScheduler {
  #callback;
  #delay;
  #isInterval;
  #ticksRemaining;
  #id;
  #status = TaskStatus.Pending;
  #paused = false;
  #completeCallbacks = [];

  constructor(callback, delay, isInterval) {
    this.#callback = callback;
    this.#delay = Math.max(1, delay);
    this.#isInterval = Boolean(isInterval);
    this.#ticksRemaining = this.#delay;
    this.#status = TaskStatus.Running;

    if (this.#isInterval) {
      this.#id = system.runInterval(() => this.#tick(), 1);
    } else {
      this.#id = system.runTimeout(() => this.#executeOnce(), this.#delay);
    }
  }

  /**
   * Creates a repeating task that runs every `delay` ticks.
   * @param {() => void} callback Function to run each time.
   * @param {number} delay Number of ticks between runs.
   * @returns {TaskScheduler} A TaskScheduler instance.
   */
  static runInterval(callback, delay = 1) {
    return new TaskScheduler(callback, delay, true);
  }

  /**
   * Creates a task that runs once after `delay` ticks.
   * @param {() => void} callback Function to run once.
   * @param {number} delay Number of ticks to wait.
   * @returns {TaskScheduler} A TaskScheduler instance.
   */
  static runTimeout(callback, delay = 1) {
    return new TaskScheduler(callback, delay, false);
  }

 /**
   * Returns the current status of the task.
   * @returns {string} One of the TaskStatus values.
   */
  get getStatus() {
    return this.#status;
  }

  /**
   * Pauses the task if it is currently running.
   * @throws {Error} If the task is already paused or not running.
   * @returns {TaskScheduler} This task instance.
   */
  pause() {
    if (this.#status === TaskStatus.Paused) {
      throw new Error("Task is already paused.");
    }
    if (this.#status !== TaskStatus.Running) {
      throw new Error(`Cannot pause task in status: ${this.#status}`);
    }
    this.#paused = true;
    this.#status = TaskStatus.Paused;
    return this;
  }

  /**
   * Resumes a paused task.
   * @throws {Error} If the task is already running or not paused.
   * @returns {TaskScheduler} This task instance.
   */
  start() {
    if (this.#status === TaskStatus.Running) {
      throw new Error("Task is already running.");
    }
    if (this.#status !== TaskStatus.Paused) {
      throw new Error(`Cannot start task in status: ${this.#status}`);
    }
    this.#paused = false;
    this.#status = TaskStatus.Running;
    return this;
  }

  /**
   * Aborts the task, preventing further execution.
   * @returns {TaskScheduler} This task instance.
   */
  abort() {
    if (this.#id) {
      system.clearRun(this.#id);
      this.#id = undefined;
    }
    if (![TaskStatus.Completed, TaskStatus.Failed].includes(this.#status)) {
      this.#status = TaskStatus.Aborted;
    }
    return this;
  }

  /**
   * Attaches a callback that runs when the task completes successfully.
   * @param {(status: string) => void} callback Callback function called on completion.
   * @returns {TaskScheduler} This task instance.
   */
  onComplete(callback) {
    this.#completeCallbacks.push(callback);
    return this;
  }

  /**
   * Internal tick loop for interval tasks.
   * @private
   */
  #tick() {
    if (this.#paused || this.#status !== TaskStatus.Running) return;
    if (--this.#ticksRemaining <= 0) {
      try {
        this.#callback();
        this.#ticksRemaining = this.#delay;
      } catch (e) {
        console.error("Interval task failed:", e);
        this.#status = TaskStatus.Failed;
        this.abort();
      }
    }
  }

  /**
   * Execution path for one-time tasks.
   * @private
   */
  #executeOnce() {
    if (this.#paused || this.#status !== TaskStatus.Running) return;
    try {
      this.#callback();
      this.#status = TaskStatus.Completed;
      this.#runOnComplete();
    } catch (e) {
      console.error("Timeout task failed:", e);
      this.#status = TaskStatus.Failed;
    } finally {
      this.abort();
    }
  }

  /**
   * Runs completion callbacks if the task finished successfully.
   * @private
   */
  #runOnComplete() {
    if (this.#status !== TaskStatus.Completed) return;
    for (const cb of this.#completeCallbacks) {
      try {
        cb(this.#status);
      } catch (e) {
        console.error("onComplete callback failed:", e);
      }
    }
    this.#completeCallbacks = [];
  }
}
