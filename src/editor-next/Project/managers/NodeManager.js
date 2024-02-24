import { Command } from '../../utils/Command.js';
import { Node } from '../../utils/Node.js';

export function NodeManager(editor, project) {
  /**
   * Register a node to the node list. You can provide:
   *
   * - a `b3.BaseNode` instance.
   * - a `b3e.Node` instance.
   * - a generic object containing the node prototype.
   */
  this.add = function (node, isDefault) {
    if (node.prototype) node = node.prototype;

    if (project._nodes[node.name]) {
      return false;
    }

    if (!(node instanceof Node)) {
      var n = new Node(isDefault);
      n.name = node.name;
      n.category = node.category;
      n.title = node.title;
      n.description = node.description;
      n.parent = node.parent;
      n.properties = tine.merge({}, node.properties || node.parameters);
      n.DMNRefs = node.DMNRefs || [];
      node = n;
    }

    project._nodes[node.name] = node;
    if (isDefault !== true) editor.trigger('nodeadded', node);

    var _old = [this, this.remove, [node]];
    var _new = [this, this.add, [node]];
    project.history._add(new Command(_old, _new));

    return node;
  };

  /**
   *
   */
  this.get = function (node) {
    if (typeof node !== 'string') return node;
    return project._nodes[node];
  };

  /**
   *
   */
  this.update = function (node, template) {
    node = this.get(node);
    var oldName = node.name;

    delete project._nodes[node.name];

    if (node.name !== template.name && this.get(template.name)) return false;

    var _oldValues = {
      name: node.name,
      title: node.title,
      description: node.description,
      parent: node.parent,
      category: node.category,
      properties: node.properties,
      DMNRefs: node.DMNRefs
    };

    if (typeof template.name !== 'undefined') {
      node.name = template.name;
    }
    if (typeof template.title !== 'undefined') {
      node.title = template.title;
    }
    if (typeof template.category !== 'undefined') {
      node.category = template.category;
    }
    if (typeof template.parent !== 'undefined') {
      node.parent = template.parent;
    }
    if (typeof template.description !== 'undefined') {
      node.description = template.description;
    }
    if (typeof template.properties !== 'undefined') {
      node.properties = tine.merge({}, template.properties);
    }
    if (typeof template.DMNRefs !== 'undefined') {
      node.DMNRefs = template.DMNRefs || [];
    }

    var _newValues = {
      name: node.name,
      title: node.title,
      description: node.description,
      category: node.category,
      parent: node.parent,
      properties: node.properties,
      DMNRefs: node.DMNRefs
    };
    if (typeof template.hostFOMObject !== 'undefined') {
      node.hostFOMObject = template.hostFOMObject || [];
      _newValues.hostFOMObject = node.hostFOMObject;
    }
    project.history._beginBatch();

    project.trees.each(function (tree) {
      var blocks = tree.blocks.getAll();
      for (var i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].name === oldName) {
          tree.blocks.update(blocks[i]);
        }
      }
    });

    project._nodes[node.name] = node;

    var _old = [this, this.update, [node, _oldValues]];
    var _new = [this, this.update, [node, _newValues]];
    project.history._add(new Command(_old, _new));
    project.history._endBatch();

    editor.trigger('nodechanged', node);
  };

  /**
   *
   */
  this.remove = function (node) {
    project.history._beginBatch();

    var name = node.name || node;
    delete project._nodes[name];

    project.trees.each(function (tree) {
      var blocks = tree.blocks.getAll();
      for (var i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].name === name) {
          tree.blocks.remove(blocks[i]);
        }
      }
    });

    var _old = [this, this.add, [node]];
    var _new = [this, this.remove, [node]];
    project.history._add(new Command(_old, _new));

    project.history._endBatch();

    editor.trigger('noderemoved', node);
  };

  /**
   * Iterates over node list.
   */
  this.each = function (callback, thisarg) {
    Object.keys(project._nodes).forEach(function (key) {
      callback.call(thisarg, project._nodes[key]);
    });
  };

  this._applySettings = function (settings) {};
}
