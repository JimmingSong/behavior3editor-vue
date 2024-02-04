import * as draw from '../draw';
export class Block extends createjs.Container {
  constructor(node) {
    super();
    var dict = node.prototype || node;
    this.id = b3.createUUID();
    this.node = node;
    this.name = dict.name;
    this.title = dict.title || this.name;
    this.category = dict.category;
    this.description = dict.description || '';
    this.properties = tine.merge({}, dict.properties);
    this.DMNRefs = dict.DMNRefs || [];

    this._settings = null;
    this._inConnection = null;
    this._outConnections = [];
    this._isSelected = null;
    this._isDragging = null;
    this._dragOffsetX = null;
    this._dragOffsetY = null;
    this._width = null;
    this._height = null;
    this._displayShape = new createjs.Shape();
    this._displaySymbol = null;
    this._displayShadow = null;
  }
  _applySettings(settings) {
    this._settings = settings;

    var color = this._settings.get('selection_color');
    this._displayShadow = new createjs.Shadow(color, 0, 0, 5);
    this._redraw();
  }
  _redraw() {
    var name = this.name;
    var category = this.category.toLowerCase();
    var shape = draw.SHAPES[category];
    var symbol = draw.SYMBOLS[name] || draw.textSymbol;

    this._width = this._settings.get('block_' + category + '_width');
    this._height = this._settings.get('block_' + category + '_height');
    this.removeAllChildren();

    this._displaySymbol = symbol(this, this._settings);
    this._displayShape.graphics.clear();
    this._displayShape = shape(this, this._settings);

    this.addChild(this._displayShape);
    this.addChild(this._displaySymbol);
  }
  _copy() {
    var block = new Block(this.node);

    block.category = this.category;
    block.title = this.title;
    block.description = this.description;
    block.properties = tine.merge({}, this.properties);
    block.DMNRefs = this.DMNRefs;

    block._applySettings(this._settings);
    block.x = this.x;
    block.y = this.y;

    return block;
  }
  /**
   * Snap the block according to the snap settings.
   *
   * @method _snap
   * @protected
   */
  _snap() {
    var snap_x = this._settings.get('snap_x');
    var snap_y = this._settings.get('snap_y');
    var dx = this.x % snap_x;
    var dy = this.y % snap_y;

    if (dx < 0) dx = snap_x + dx;
    if (dy < 0) dy = snap_y + dy;

    this.x -= dx;
    this.y -= dy;
  }

  /**
   * Returns the center position of the in anchor.
   *
   * @method _getInAnchorPosition
   * @returns {Object} An object {x, y}.
   * @protected
   */
  _getInAnchorPosition() {
    return {
      x: this.x - this._width / 2 - this._settings.get('anchor_offset_x'),
      y: this.y - this._height / 2 - this._settings.get('anchor_offset_x')
    };
  }

  /**
   * Returns the center position of the out anchor.
   *
   * @method _getOutAnchorPosition
   * @returns {Object} An object {x, y}.
   * @protected
   */
  _getOutAnchorPosition() {
    return {
      x: this.x + this._width / 2 + this._settings.get('anchor_offset_x'),
      y: this.y + this._height / 2 + this._settings.get('anchor_offset_x')
    };
  }

  /**
   * Select a block, adding a shadow effect to it.
   *
   * @method _select
   * @protected
   */
  _select() {
    this._isSelected = true;
    this._displayShape.shadow = this._displayShadow;
  }

  /**
   * Deselect a block, removing the shadow effect.
   *
   * @method _deselect
   * @protected
   */
  _deselect() {
    this._isSelected = false;
    this._displayShape.shadow = null;
  }

  _collapse() {}
  _expand() {}

  /**
   * Verifies if the position (x, y) hits any part of the block. This is
   * equivalent to:
   *
   *     block._hitBody(x, y) || block._hitInAnchor(x, y) || block._hitOutAnchor(x, y)
   *
   * @method _hitTest
   * @param {number} x The x position.
   * @param {number} y The y position.
   * @returns {Boolean} Whether hit the block or not.
   * @protected
   */
  _hitTest(x, y) {
    return this._displayShape.hitTest(x - this.x, y - this.y);
  }

  /**
   * Verifies if the position (x, y) hits the body of the block.
   *
   * @method _hitBody
   * @param {number} x The x position.
   * @param {number} y The y position.
   * @returns {Boolean} Whether hit the block's body or not.
   * @protected
   */
  _hitBody(x, y) {
    if (this._settings.get('layout') === 'horizontal') {
      return Math.abs(x - this.x) < this._width / 2;
    }
    return Math.abs(y - this.y) < this._height / 2;
  }

  /**
   * Verifies if the position (x, y) hits the in anchor of the block.
   *
   * @method _hitInAnchor
   * @param {number} x The x position.
   * @param {number} y The y position.
   * @returns {Boolean} Whether hit the in anchor or not.
   * @protected
   */
  _hitInAnchor(x, y) {
    if (this._settings.get('layout') === 'horizontal') {
      var dx = x - this.x;
      return Math.abs(dx) > this._width / 2 && dx < 0;
    }
    var dy = y - this.y;
    return Math.abs(dy) > this._height / 2 && dy < 0;
  }

  /**
   * Verifies if the position (x, y) hits the out anchor of the block.
   *
   * @method _hitInAnchor
   * @param {number} x The x position.
   * @param {number} y The y position.
   * @returns {Boolean} Whether hit the out anchor or not.
   * @protected
   */
  _hitOutAnchor(x, y) {
    if (this._settings.get('layout') === 'horizontal') {
      var dx = x - this.x;
      return Math.abs(dx) > this._width / 2 && dx > 0;
    }
    var dy = y - this.y;
    return Math.abs(dy) > this._height / 2 && dy > 0;
  }

  /**
   * Verifies if this block is contained inside a given rectangle.
   *
   * @method _isContainedIn
   * @param {number} x1 The x position.
   * @param {number} y1 The y position.
   * @param {number} x2 The x+w position.
   * @param {number} y2 The y+h position.
   * @returns {Boolean} Whether the block is contained in the rectangle or not.
   * @protected
   */
  _isContainedIn(x1, y1, x2, y2) {
    if (x1 < this.x - this._width / 2 && y1 < this.y - this._height / 2 && x2 > this.x + this._width / 2 && y2 > this.y + this._height / 2) {
      return true;
    }

    return false;
  }

  /**
   * Get the compiled title of the block. You can use patterns like `<varname>`
   * in the block title and this method will look through block properties for
   * the var name. For example.
   *
   *     block.title = 'A <thing> title';
   *     block.properties['thing'] = 'pretty';
   *     block.getTitle() === 'A pretty title';
   *
   * @method getTitle
   * @returns {String} The compiled title.
   */
  getTitle() {
    var s = this.title || this.name;
    var this_ = this;
    return s.replace(/(<\w+>)/g, function (match, key) {
      var attr = key.substring(1, key.length - 1);
      if (this_.properties.hasOwnProperty(attr)) return this_.properties[attr];
      return match;
    });
  }

  /**
   * Runs a traversal over the subtree which this block is root.
   *
   *     block.traversal(function(block) {
   *       console.log(block);
   *     })
   *
   * @method traversal
   * @param {Function} callback The callback called for each block in the
   *                            subtree. The current block will be passed as
   *                            argument to the callback.
   * @param {Object} thisarg The object for `this` reference.
   */
  traversal(callback, thisarg) {
    var blocks = [this];
    while (blocks.length > 0) {
      var block = blocks.pop();
      if (callback.call(thisarg, block) === false) return;

      for (var i = block._outConnections.length - 1; i >= 0; i--) {
        var c = block._outConnections[i];
        if (c._outBlock) blocks.push(c._outBlock);
      }
    }
  }
}
