var Base = /** @class */ (function () {
    function Base(options) {
        var _this = this;
        Object.assign(this, options);
        window.addEventListener('keydown', function (event) {
            if (_this.keyCallback) {
                _this.keyCallback(event.key, true);
            }
        });
        window.addEventListener('keyup', function (event) {
            if (_this.keyCallback) {
                _this.keyCallback(event.key, false);
            }
        });
        this.stop();
    }
    /**
     * GETTER SETTER
     */
    Base.prototype.isRunning = function () {
        return this.running;
    };
    Base.prototype.getTimeout = function () {
        return this.timeout;
    };
    Base.prototype.setTimeout = function (timeout, force) {
        if (!this.running || force) {
            this.timeout = timeout;
        }
        else {
            console.warn('[setTimeout] Cannot set timeout while running');
        }
    };
    /**
     * FUNC
     */
    Base.prototype.start = function () {
        this.running = true;
        this.loop();
    };
    Base.prototype.pause = function () {
        this.running = !this.running;
        clearTimeout(this.interval);
        if (this.running) {
            this.interval = setTimeout(this.start.bind(this), this.timeout);
        }
    };
    Base.prototype.stop = function () {
        this.running = false;
        this.timestamp = 0;
    };
    Base.prototype.loop = function () {
        if (this.running) {
            if (this.loopCallback) {
                this.loopCallback(this.timestamp);
            }
            this.timestamp += 1;
            this.interval = setTimeout(this.loop.bind(this), this.timeout);
        }
    };
    return Base;
}());
var IBaseOptions = /** @class */ (function () {
    function IBaseOptions() {
    }
    return IBaseOptions;
}());
