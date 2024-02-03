import {Ref} from "vue";

export type EditorType = Ref<any>
export function useEditorHook() {
    const editor = inject('editor') as EditorType
    return {
        editor
    }
}