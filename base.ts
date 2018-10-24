/**
 * Base Options Interface
 * @class IBaseOptions
 */
class IBaseOptions {
	timeout: number;
	loopCallback: (timestamp?: number) => void;
	keyCallback: (key: string, pressed: boolean) => void;
	preventDefaultAllKey: boolean;
	preventDefaultKeys: string[];
}

/**
 * @class Base
 */
class Base implements IBaseOptions {
	
	timeout: number;
	loopCallback: (timestamp?: number) => void;
	keyCallback: (key: string, pressed: boolean) => void;
	preventDefaultAllKey: boolean;
	preventDefaultKeys: string[] = [];

	private interval;
	private timestamp: number;
	private running: boolean;

	constructor(options: IBaseOptions) {
		// mapping options
		Object.assign(this, options);

		// mapping key callbacks
		window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (this.PreventDefaultAllKey || this.preventDefaultKeys.includes(event.key)) { event.preventDefault(); }
			if (this.keyCallback) { this.keyCallback(event.key, true); }
		});
		window.addEventListener('keyup', event => {
			if (this.PreventDefaultAllKey || this.preventDefaultKeys.includes(event.key)) { event.preventDefault(); }
			if (this.keyCallback) { this.keyCallback(event.key, false); }
		});

		// initializing
		this.stop();
	}

	/**
	 * GETTER SETTER
	 */
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
