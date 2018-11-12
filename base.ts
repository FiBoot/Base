
/**
 * @interface IBaseOptions
 */
interface IBaseOptions {
	/**
	 * time between loop call
	 * @type {number}
	 * @memberof IBaseOptions
	 */
	timeout: number;
	/**
	 * callback function for loop
	 * @memberof IBaseOptions
	 */
	loopCallback: (timestamp?: number) => void;
	/**
	 * callback function for keys
	 * @memberof IBaseOptions
	 */
	keyCallback: (key: string, pressed: boolean) => void;
	/**
	 * Boolean preventing all keys
	 * @type {boolean}
	 * @memberof IBaseOptions
	 */
	preventDefaultAllKey: boolean;
	/**
	 * String array preventing specifice key names
	 * @type {string[]}
	 * @memberof IBaseOptions
	 */
	preventDefaultKeys: string[];
}


/**
 * @class Base
 * @implements {IBaseOptions}
 */
class Base implements IBaseOptions {
	timeout: number;
	loopCallback: (timestamp?: number) => void;
	keyCallback: (key: string, pressed: boolean) => void;
	preventDefaultAllKey: boolean;
	preventDefaultKeys: string[] = [];

	private interval;
	private timestamp: number;
	private running: boolean

	constructor(options: IBaseOptions) {
		Object.assign(this, options);

		window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (this.preventDefaultAllKey || this.preventDefaultKeys.includes(event.key)) { event.preventDefault(); }
			if (this.keyCallback) { this.keyCallback(event.key, true); }
		});
		window.addEventListener('keyup', event => {
			if (this.preventDefaultAllKey || this.preventDefaultKeys.includes(event.key)) { event.preventDefault(); }
			if (this.keyCallback) { this.keyCallback(event.key, false); }
		});

		this.stop();
	}

	public isRunning(): boolean {
		return this.running;
	}
	public getTimeout(): number {
		return this.timeout;
	}
	public setTimeout(timeout: number, force?: boolean): boolean {
		if (!this.running || force) {
			this.timeout = timeout;
			return true;
		} else {
			console.warn('[setTimeout] Cannot set timeout while running');
			return false;
		}
	}

	public stop(): void {
		this.running = false;
		this.timestamp = 0;
	}
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
