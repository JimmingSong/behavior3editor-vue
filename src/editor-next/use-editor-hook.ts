import { Ref } from 'vue';


export type EditorEventType =
  | 'nodechanged'

export type EditorType = Ref<EditorInstance>;

export type EditorInstance = {
  _game: any;
  project: any;
  on: (eventType: string, cb: Function) => void
  off: (eventType: string, cb: Function) => void;
  preview: (name: string) => HTMLCanvasElement
}
export function useEditorHook() {
  const editor = inject('editor') as EditorType;
  return {
    editor
  };
}
