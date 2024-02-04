import { Ref } from 'vue';
import * as Mousetrap from 'mousetrap'
import {EditorInstance} from "./use-editor-hook.ts";

export const defaultProjectConfig = {
  version: '0.3.0',
  scope: 'project',
  selectedTree: '410970e0-3121-4cf8-b1c0-26de8dea7291',
  trees: [
    {
      version: '0.3.0',
      scope: 'tree',
      id: '410970e0-3121-4cf8-b1c0-26de8dea7291',
      title: 'bbb333',
      description: '',
      root: null,
      properties: {},
      nodes: {},
      display: {
        camera_x: 400,
        camera_y: 278,
        camera_z: 1,
        x: 0,
        y: 0
      }
    }
  ],
  custom_nodes: []
} as any;
export function useCreateProject(editor: Ref<any>) {
  const getEditor = () => toValue(editor);
  const getProject = () => getEditor().project.get();

  const getTree = () => getProject().trees.getSelected();
  const createProject = (initialData?: any) => {
    getEditor().project.open(initialData ?? defaultProjectConfig);
  };

  const handleSaveProject = () => {
    const data = getEditor().export.projectToData();
    console.log('use-create-project 36 -> data', data);
  };

  const handleImportFile = async (files: FileList) => {
    const file = files[0];
    const text = await file.text();
    const content = JSON.parse(text);
    toValue(editor).import.projectAsData(content.data);
  };

  const handleNewTree = () => {
    getProject().trees.add();
  };

  const handleUndo = () => {
    getProject().history.undo();
  };

  const handleRedo = () => {
    getProject().history.redo();
  };

  const handleCopy = () => {
    getTree().edit.copy();
  };

  const handleCut = () => {
    getTree().edit.cut();
  };

  const handlePaste = () => {
    getTree().edit.paste();
  };

  const handleDelete = () => {
    getTree().edit.remove();
  };

  const handleDeleteAllConns = () => {
    getTree().edit.removeConnections();
  }

  const handleDeleteAllInConns = () => {
    getTree().edit.removeInConnections()
  }

  const handleDeleteAllOutConns = () => {
    getTree().edit.removeOutConnections()
  }

  const bindKeyboardEvent = () => {
    Mousetrap.bind('ctrl+z', handleUndo);
    Mousetrap.bind('ctrl+shift+z', handleRedo);
    Mousetrap.bind('ctrl+c', handleCopy);
    Mousetrap.bind('ctrl+v', handlePaste);
    Mousetrap.bind('ctrl+x', handleCut);
    Mousetrap.bind('del', handleDelete);
  };

  const unbindKeyboardEvent = () => {
    Mousetrap.unbind('ctrl+z');
    Mousetrap.unbind('ctrl+shift+z');
    Mousetrap.unbind('ctrl+c');
    Mousetrap.unbind('ctrl+v');
    Mousetrap.unbind('ctrl+x');
    Mousetrap.unbind('del');
  };

  return {

    getTree,
    getProject,
    getEditor,

    createProject,
    handleSaveProject,
    handleImportFile,

    bindKeyboardEvent,
    unbindKeyboardEvent,

    handleNewTree,

    handleUndo,
    handleRedo,
    handleCopy,
    handleCut,
    handlePaste,
    handleDelete,

    handleDeleteAllConns,
    handleDeleteAllInConns,
    handleDeleteAllOutConns
  };
}

export function getTree(editor:EditorInstance) {
  return getProject(editor).trees.getSelected();
}

export function getProject(editor: EditorInstance) {
  return editor.project.get();
}