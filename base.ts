
/**
 * Base Options Interface
 * @class IBaseOptions
 */
class IBaseOptions {
	timeout: number;
	loopCallback: (timestamp?: number) => void;
	keyCallback: (key: any, pressed: boolean) => void; // TODO: type de la key
}

/**
 * @class Base
 */
class Base {
	
	private timeout: number;
	private interval;
	private loopCallback: (timestamp?: number) => void;
	private keyCallback: (key: any, pressed: boolean) => void;

	private timestamp: number;
	private running: boolean

	constructor(options: IBaseOptions) {
		Object.assign(this, options);

		window.addEventListener('keydown', event => {
			if (this.keyCallback) {
				this.keyCallback(event.key, true);
			}
		});
		window.addEventListener('keyup', event => {
			if (this.keyCallback) {
				this.keyCallback(event.key, false);
			}
		});

		this.stop();
	}

	/**
	 * GETTER SETTER
	 */

	public isRunning(): boolean {
		return this.running;
	}
	public getTimeout() {
		return this.timeout;
	}
	public setTimeout(timeout: number, force?: boolean) {
		if (!this.running || force) {
			this.timeout = timeout;
		} else {
			console.warn('[setTimeout] Cannot set timeout while running');
		}
	}


	/**
	 * FUNC
	 */
	
	public start(): void {
		this.running = true;
		this.loop();
	}
	public pause(): void {
		this.running = !this.running;
		clearTimeout(this.interval);
		if (this.running) {
			this.interval = setTimeout(this.start.bind(this), this.timeout);
		}
	}
	public stop(): void {
		this.running = false;
		this.timestamp = 0;
	}

	private loop(): void {
		if (this.running) {
			if (this.loopCallback) {
				this.loopCallback(this.timestamp);
			}
			this.timestamp += 1;
			this.interval = setTimeout(this.loop.bind(this), this.timeout);
		}
	}
}
