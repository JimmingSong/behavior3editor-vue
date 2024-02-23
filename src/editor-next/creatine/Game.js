import {DEFAULT_CONFIG, DefaultConfigType} from "./config.js";
import createjs from 'createjs'

export class Game {
    constructor(config, state) {
        /**
         * The configuration object (may be modified by the game or the game
         * systems).
         *
         * @property {Object} config
         */
        this.config = null;

        /**
         * An object containing functions.
         * @property {Object} state
         */
        this.state = null;


        /**
         * The `createjs.Stage` object.
         * @property {Stage} stage
         */
        this.state = null;

        /**
         * The instance for `creatine.FactoryManager`.
         * @property {FactoryManager} create
         */
        this.create = null;

        /**
         * The instance for `creatine.ResourceManager`.
         * @property {ResourceManager} load
         */
        this.load = null;

        /**
         * The instance for `creatine.KeyboardManager`.
         * @property {KeyboardManager} keyboard
         */
        this.keyboard = null;

        /**
         * The instance for `creatine.MouseManager`.
         * @property {MouseManager} mouse
         */
        this.mouse = null;

        /**
         * The instance for `creatine.TouchManager`.
         * @property {TouchManager} touch
         */
        this.touch = null;

        /**
         * The instance for `creatine.GamepadManager`.
         * @property {GamepadManager} gamepad
         */
        this.gamepad = null;

        /**
         * The instance for `creatine.StorageManager`.
         * @property {StorageManager} storage
         */
        this.storage = null;

        /**
         * The instance for `creatine.SoundManager`.
         * @property {SoundManager} sound
         */
        this.sound = null;

        /**
         * The instance for `creatine.PluginManager`.
         * @property {PluginManager} plugins
         */
        this.plugins = null;

        /**
         * The instance for `creatine.SceneManager`.
         * @property {SceneManager} director
         */
        this.director = null;

        /**
         * The instance for `creatine.TimeManager`.
         * @property {TimeManager} time
         */
        this.time = null;

        /**
         * The instance for `creatine.DisplayManager`.
         * @property {DisplayManager} display
         */
        this.display = null;

        /**
         * The instance for `creatine.DeviceManager`.
         * @property {DeviceManager} device
         */
        this.device  = null;

        // if config is a string, consider as a path for a JSON file.
        // if (typeof config === 'string') {
        //     var self = this;
        //     creatine.getJSON(config, function(data) {
        //         self._initialize(data, state);
        //     })
        //
        //     // otherwise it considers as an object.
        // } else {
        // }
        /**
         * The canvas element.
         * @property {HTMLCanvasElement} canvas
         */
        this.canvas = null;
        this._initialize(config, state)

    }
    _initializeConfig(config) {
        if (!config) {
            const _config = Object.assign({}, DEFAULT_CONFIG);
            this.config = _config;
            return _config
        }
        const _config = Object.assign({}, DEFAULT_CONFIG, config);

        // project
        if (typeof _config.project !== 'string') {
            throw Error('Invalid project name. Please use a string.');
        } else if (!/^\w+$/i.test(config.project)) {
            throw Error('Invalid project name. Please only use letters, numbers and underscore');
        }

        // width
        if (_config.width !== parseInt(_config.width + '', 10) || _config.width === 0) {
            _config.width = DEFAULT_CONFIG['width'];
        }

        // height
        if (_config.height !== parseInt(_config.height + '', 10) || _config.height === 0) {
            _config.height = DEFAULT_CONFIG['height'];
        }

        // framerate
        if (_config.framerate !== parseInt(_config.framerate + '', 10) || _config.framerate === 0) {
            _config.framerate = DEFAULT_CONFIG['framerate'];
        }

        // debug
        _config.debug = Boolean(_config.debug);

        // showfps
        _config.showfps = Boolean(_config.showfps);

        this.config = _config;
        return _config;
    }
    _initializeState(state) {
        function isFunction(value) {
            return typeof value === 'function';
        }

        if (!state) state = {};
        if (!isFunction(state.boot)) delete state.boot;
        if (!isFunction(state.preload)) delete state.preload;
        if (!isFunction(state.create)) delete state.create;
        if (!isFunction(state.update)) delete state.update;
        if (!isFunction(state.draw)) delete state.draw;
        this.state = state;
    }
    _initialize(config, state) {
        this._initializeConfig(config);
        this._initializeState(state);


        // Canvas
        const canvas = document.createElement('canvas');
        canvas.width = config.width;
        canvas.height = config.height;
        canvas.style.backgroundColor = config.background_color;
        canvas.style.outline = 'none';
        canvas.setAttribute('tabindex','0');
        canvas.addEventListener("mousedown", () => this.canvas.focus, false);

        const container = this.getContainer();
        container.appendChild(canvas);
        canvas.focus();

        this.stage = new createjs.Stage(canvas);
        this.stage.snapToPixelEnabled = true;
        createjs.Ticker.framerate = config.framerate;
        createjs.Touch.enable(this.stage);
        createjs.Sound.initializeDefaultPlugins();

        this.time = new TimeManager(this);

        return canvas
    }
    getContainer() {
        if (!this.config?.container) {
            return document.body
        }
        if (this.config?.container instanceof HTMLElement) {
            return this.config.container
        }
        return document.getElementById(this.config.container);
    }
}