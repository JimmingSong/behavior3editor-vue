/**
 * Editor package.
 * 
 * This package is independent from the application, and represent the graph
 * (canvas element) and logic part of the editor. For organization purposes, 
 * the editor is divided into several namespaces:
 *
 * - **b3e**         : contains all base classes, functions and constants;
 * - **b3e.draw**    : contains functions to draw the block shapes and symbols;
 * - **b3e.editor**  : contains the editor class, editor-related managers and 
 *                     symbols;
 * - **b3e.project** : contains the project class and project-related managers;
 * - **b3e.tree**    : contains the tree class and tree-related managers;
 *
 * As a general rule, an application has a single editor instance; the editor
 * can handle several projects but only a single project can be active in a 
 * given time; a project can have several trees.
 *
 * Each project has a set of nodes (default fixed nodes and custom nodes). A 
 * block is a visual instance of a node.
 *
 * Also notice that, the Editor, Project, Tree, Block, Connection and 
 * SelectionBox are all children of `createjs.DisplayObject` or 
 * `createjs.Container`.
 * 
 */
import './utils/SettingsManager.js'
import './project/Project.js'
import './editor/managers/ProjectManager.js'
import './editor/managers/ImportManager.js'
import './editor/managers/ExportManager.js'
import './editor//managers/ShortcutManager.js'
import './editor/systems/CameraSystem.js'
import './editor/systems/CollapseSystem.js'
import './editor/systems/ConnectionSystem.js'
import './editor/systems/DragSystem.js'
import './editor/systems/SelectionSystem.js'
import './editor/systems/ShortcutSystem.js'
import './editor/Editor.js';
import './tree/Tree.js';
import './draw/shapes.js'
import './draw/symbols.js'


window.b3e         = window.b3e || {};
window.b3e.draw    = window.b3e.draw || {};
window.b3e.editor  = window.b3e.editor || {};
window.b3e.project = window.b3e.project || {};
window.b3e.tree    = window.b3e.tree || {};



window.b3e.VERSION = '[BUILD_VERSION]';

