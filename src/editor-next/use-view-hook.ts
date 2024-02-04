import {getTree} from "./use-create-project.ts";
import {EditorInstance} from "./use-editor-hook.ts";
import {Ref} from "vue";
import {bind, unbind} from 'mousetrap'

export function useViewHook(editor: Ref<EditorInstance>) {

  const getEditor = () => toRaw(editor.value)
  const onAutoOrganize = () => {
    getTree(getEditor()).organize.organize();
  }
    const handleZoomIn = () => {
    getTree(getEditor()).view.zoomIn();
  }
  const handleZoomOut = () => {
    getTree(getEditor()).view.zoomOut()
  }

  const bindViewMousetrap = () => {
    bind('ctrl+up', handleZoomIn)
    bind('ctrl+down', handleZoomOut)
    bind('a', onAutoOrganize)
  }

  const unbindViewMousetrap = () => {
    unbind('ctrl+up')
    unbind('ctrl+down')
    unbind('a')
  }



  return {
    onAutoOrganize,
    handleZoomIn,
    handleZoomOut,

    bindViewMousetrap,
    unbindViewMousetrap
  }
}