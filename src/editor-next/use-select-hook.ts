import {EditorInstance} from "./use-editor-hook.ts";
import {MaybeRef} from "vue";
import {getTree} from "./use-create-project.ts";
import * as Mousetrap from "mousetrap";

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

  const bindSelectMousetrap = () => {
    Mousetrap.bind('ctrl+a', onSelectAll)
    Mousetrap.bind('ctrl+i', onDeselectAll)
  }

  const unbindSelectMousetrap = () => {
    Mousetrap.unbind('ctrl+a') // 取消绑定
    Mousetrap.unbind('ctrl+i') // 取消绑定
  }

  return {
    onSelectAll,
    onDeselectAll,
    onInvertSelection,

    bindSelectMousetrap,
    unbindSelectMousetrap
  }
}