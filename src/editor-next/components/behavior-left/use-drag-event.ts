import {useEditorHook} from "../../use-editor-hook.ts";


export function useDragEvent() {
    const {editor} = useEditorHook()
    const nodeAllowDrop = (info: any) => {
        const type = info.dropPosition;
        const dropNode = info.node;
        if (['prev','next'].includes(type)) return false
        if (dropNode.type === 'folder') return true;
        // if (draggingNode.isDefault || dropNode.isDefault) {
        //     return false
        // }
        return false
    }
    const handleDragStart = (data: any) => {
        const attrs = data.node;
        const e = data.event;
        if (attrs.type !== 'folder') {
            let canvas = toValue(editor).preview(attrs.name) as HTMLCanvasElement;
            const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
            if (isChrome) {
                const img = document.createElement('img');
                img.src = canvas.toDataURL();

                // 10ms delay in order to proper create the image object
                // ugly hack =(
                let time = new Date().getTime();
                const delay = time + 10;
                while (time < delay) {
                    time = new Date().getTime();
                }
                //@ts-ignore
                canvas = img;
            }
            e.dataTransfer!.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
        }

        e.dataTransfer!.setData('name', attrs.name);
        e.dataTransfer!.setData('type', attrs.type);
    };


    const handleNodeDrop = (dragNode: any, node: any) => {
        dragNode.data.parent = node.data.parent
    }

    return {
        handleNodeDrop,
        handleDragStart,
        nodeAllowDrop
    }
}