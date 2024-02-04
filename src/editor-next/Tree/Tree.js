import { createUUID } from 'behavior3js';
import { SelectionBox } from '../utils/SelectionBox.js';
import { BlockManager } from './managers/BlockManager.js';
import { ConnectionManager } from './managers/ConnectionManager.js';
import { EditManager } from './managers/EditManager.js';
import { SelectionManager } from './managers/SelectionManager.js';
import { ViewManager } from './managers/ViewManager.js';
import { OrganizeManager } from './managers/OrganizeManager.js';

export class Tree extends createjs.Container {
  constructor(editor, project) {
    super();
    // Variables
    this._id = createUUID();
    this._editor = editor;
    this._project = project;
    this._selectedBlocks = [];
    this._selectionBox = null;
    this._root = null;

    // Layers
    this._blocks = new createjs.Container();
    this._connections = new createjs.Container();
    this._overlay = new createjs.Container();
    // Managers
    this.blocks = null;
    this.connections = null;
    this.edit = null;
    this.selection = null;
    this.view = null;
    this.organizer = null;
    this._initialize();
  }
  _initialize() {
    this.blocks = new BlockManager(this._editor, this._project, this);
    this.connections = new ConnectionManager(this._editor, this._project, this);
    this.edit = new EditManager(this._editor, this._project, this);
    this.selection = new SelectionManager(this._editor, this._project, this);
    this.view = new ViewManager(this._editor, this._project, this);
    this.organize = new OrganizeManager(this._editor, this._project, this);

    this.addChild(this._connections);
    this.addChild(this._blocks);
    this.addChild(this._overlay);

    this._selectionBox = new SelectionBox();
    this._overlay.addChild(this._selectionBox);

    this._root = this.blocks.add('Root', 0, 0);
    this._applySettings(this._editor._settings);

    this.view.center();
  }

  _applySettings(settings) {
    this._selectionBox._applySettings(settings);

    this.blocks._applySettings(settings);
    this.connections._applySettings(settings);
    this.edit._applySettings(settings);
    this.selection._applySettings(settings);
    this.view._applySettings(settings);
    this.organize._applySettings(settings);
  }
}
