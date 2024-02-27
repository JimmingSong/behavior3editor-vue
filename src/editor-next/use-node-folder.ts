
interface NodeFolderType {
    name: string;
    category: string;
    parent: string
}

export type NodeFolderPartialType = Partial<NodeFolderType>
export function useNodeFolder() {
    const show = ref(false);
    const state = ref<NodeFolderPartialType>({
        name: '',
        category: '',
        parent: ''
    })

    const setState = (data: NodeFolderPartialType) => {
        state.value = data
        show.value = true
    }
    return {
        show,
        state,

        setState
    }
}