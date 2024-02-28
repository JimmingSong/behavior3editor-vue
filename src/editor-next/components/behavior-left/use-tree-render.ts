import {NButton, NIcon, NSpace} from "naive-ui";
import {FolderOutline} from "@vicons/ionicons5";
import {useBehaviorInject} from "../../use-behavior-inject.ts";

export function useTreeRender() {
    const { setFolderDialogShow, setNodeDialogShow } = useBehaviorInject()
    const renderPrefix = (info: any) => {
        const option = info.option;
        const type = option.type
        return type === 'folder' ? h(NIcon, null, {default: () => h(FolderOutline)}) : null
    }


    const renderSuffix = (info: any) => {
        const option = info.option;

        const category = option.category;
        const type = option.type;
        const isFolder = type === 'folder';

        const folder = h(NButton, {
            text: true
        }, {
            default: () => 'folder'
        })

        const node = h(NButton, {
            text: true,
            onClick() {
                setNodeDialogShow({category, parent: isFolder ? option.name : undefined})
            }
        }, {
            default: () => 'node'
        })

        const edit = h(NButton, {
            text: true,
            onClick() {
                if (isFolder) {
                    setFolderDialogShow({name: option.name, category, parent: isFolder ? option.name : undefined})
                    return
                }
                setNodeDialogShow({name: option.name, category, parent: option.parent ?? ''})
            }
        }, {
            default: () => 'edit'
        })
        return option.isDefault ? null : type === 'folder' ? h(NSpace, null, {
            default: () => [node, folder, edit]
        }) : edit
    }

    return {
        renderPrefix,
        renderSuffix
    }
}