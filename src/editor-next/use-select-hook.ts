import {EditorInstance} from "./use-editor-hook.ts";
import {MaybeRef} from "vue";
import {getTree} from "./use-create-project.ts";

export function useSelectHook(editor: MaybeRef<EditorInstance>) {
  const getEditor = () => toValue(editor)
  const onSelectAll = () => {
    getTree(getEditor()).selection.selectAll()
  }
  function onDeselectAll() {
    getTree(getEditor()).selection.deselectAll();
  }
  function onInvertSelection() {
    getTree(getEditor()).selection.invertSelection();
  }

  return {
    onSelectAll,
    onDeselectAll,
    onInvertSelection
  }
}