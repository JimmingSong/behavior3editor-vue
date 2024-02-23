import { SettingsManager } from '../utils/SettingsManager.js';
import { ProjectManager } from './managers/ProjectManager.js';
import { ExportManager } from './managers/ExportManager.js';
import { ImportManager } from './managers/ImportManager.js';
import { ShortcutManager } from './managers/ShortcutManager.js';
import { CameraSystem } from './systems/CameraSystem.js';
import { ConnectionSystem } from './systems/ConnectionSystem.js';
import { DragSystem } from './systems/DragSystem.js';
import { CollapseSystem } from './systems/CollapseSystem.js';
import { SelectionSystem } from './systems/SelectionSystem.js';
import { ShortcutSystem } from './systems/ShortcutSystem.js';
import { Block } from '../utils/Block.js';
import { DEFAULT_SETTINGS } from '../utils/settings.js';
export class Editor extends createjs.Container {
  constructor(config) {
    super();
    this.config = config;
    // Variables
    this._project = null;
    this._game = null;
    this._settings = new SettingsManager();
    this._dirty = 0;

    // Systems
    this._systems = [];

    // Managers
    this.project = null;
    this.export = null;
    this.import = null;
    this.shortcuts = null;
    this._createGame();
  }
  _createGame() {
    var self = this;
    this._game = new tine.Game(this.config, {
      update: function () {
        self._update();
      }
    });

    this._initialize();
  }

  /**
   * Initializes DOM, DOM events, managers and display objects.
   */
  _initialize() {
    const container = document.getElementById(this.config.container);
    // RESIZE
    const resize = () => {
      this._game.canvas.width = container.clientWidth;
      this._game.canvas.height = container.clientHeight;
    };
    window.onresize = resize;
    resize();

    // GAME
    this._game.stage.addChild(this);

    // MANAGERS
    this.project = new ProjectManager(this);
    this.export = new ExportManager(this);
    this.import = new ImportManager(this);
    this.shortcuts = new ShortcutManager(this);

    // SYSTEMS
    this._systems.push(new CameraSystem(this));
    this._systems.push(new ConnectionSystem(this));
    this._systems.push(new SelectionSystem(this));
    this._systems.push(new DragSystem(this));
    this._systems.push(new CollapseSystem(this));
    this._systems.push(new ShortcutSystem(this));

    // SETTINGS
    this.applySettings('default');
  }

  /**
   * Called by creatine game.
   */
  _update() {
    var delta = this._game.time.delta;
    this._systems.forEach(function (system) {
      system.update(delta);
    });
  }

  trigger(name, target, variables) {
    variables = variables || {};

    var event = new createjs.Event(name);
    event._target = target;
    event._data = variables;
    this.dispatchEvent(event);
  }

  applySettings(settings) {
    if (settings === 'default') {
      settings = DEFAULT_SETTINGS;
      this._settings.clear();
    }

    if (settings) {
      this._settings.load(settings);
    }

    var canvas = this._game.canvas;
    canvas.style.backgroundColor = this._settings.get('background_color');

    this.project._applySettings(this._settings);
    this.export._applySettings(this._settings);
    this.import._applySettings(this._settings);
    this.shortcuts._applySettings(this._settings);
  }

  preview(name) {
    var canvas = document.createElement('canvas');

    var p = this.project.get();
    var node = p.nodes.get(name)  || p.folders.get(name);
    var tree = p.trees.getSelected();

    if (!node) return;
    var block = new Block(node);
    block._applySettings(this._settings);
    block.x = block._width;
    block.y = block._height;

    canvas.setAttribute('width', block._width * tree.scaleX * 2);
    canvas.setAttribute('height', block._height * tree.scaleY * 2);

    var stage = new createjs.Stage(canvas);
    stage.scaleX = tree.scaleX;
    stage.scaleY = tree.scaleY;
    stage.addChild(block);
    stage.update();

    return canvas;
  }

  isDirty() {
    return this._dirty !== 0;
  }

  clearDirty() {
    this._dirty = 0;
  }
}
