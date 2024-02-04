import {
  createUUID,
  Sequence,
  Priority,
  MemSequence,
  MemPriority,
  Repeater,
  RepeatUntilFailure,
  RepeatUntilSuccess,
  MaxTime,
  Inverter,
  Limiter,
  Failer,
  Succeeder,
  Runner,
  Error,
  Wait
} from 'behavior3js';

import { Root } from '../utils/Root.js';
import { TreeManager } from './managers/TreeManager.js';
import { NodeManager } from './managers/NodeManager.js';
import { HistoryManager } from './managers/HistoryManager.js';
export class Project extends createjs.Container {
  constructor(editor) {
    super();
    // Variables
    this._id = createUUID();
    this._editor = editor;
    this._selectedTree = null;
    this._clipboard = null;
    this._nodes = {};

    // Managers
    this.trees = null;
    this.nodes = null;
    this.history = null;
    this.DMNRefs = [];
    this.hostFOMObject = [];

    this._initialize();
  }
  _initialize = function () {
    this.trees = new TreeManager(this._editor, this);
    this.nodes = new NodeManager(this._editor, this);
    this.history = new HistoryManager(this._editor, this);

    this.nodes.add(Root, true);
    this.nodes.add(Sequence, true);
    this.nodes.add(Priority, true);
    this.nodes.add(MemSequence, true);
    this.nodes.add(MemPriority, true);
    this.nodes.add(Repeater, true);
    this.nodes.add(RepeatUntilFailure, true);
    this.nodes.add(RepeatUntilSuccess, true);
    this.nodes.add(MaxTime, true);
    this.nodes.add(Inverter, true);
    this.nodes.add(Limiter, true);
    this.nodes.add(Failer, true);
    this.nodes.add(Succeeder, true);
    this.nodes.add(Runner, true);
    this.nodes.add(Error, true);
    this.nodes.add(Wait, true);

    this._applySettings(this._editor._settings);
    this.history.clear();
    this._editor.clearDirty();
  };
  _applySettings = function (settings) {
    this.trees._applySettings(settings);
    this.nodes._applySettings(settings);
    this.history._applySettings(settings);
  };
}
