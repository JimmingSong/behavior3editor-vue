import {NodeFolderPartialType} from "./use-node-folder.ts";
import {Ref} from "vue";


export const behaviorProviderKey = Symbol('behaviorProviderKey');

export type BehaviorProjectType = 'project'|'tree' | 'node'
interface BehaviorProviderInjectType {
    setExportDialogShow: (type: BehaviorProjectType) => void,
    setImportDialogShow: (type: BehaviorProjectType) => void,
    setProjectDialogShow: () => void,
    setFolderDialogShow: (data?: NodeFolderPartialType) => void,
    setNodeDialogShow: (data?: NodeFolderPartialType) => void,

    projectDetail: Ref<ProjectDetailType>
    setProjectDetail: (data: ProjectDetailType) => void
}

export interface ProjectDetailType {
    name: string
    description: string
}

export function useBehaviorInject() {

    const behaviorInject = inject(behaviorProviderKey) as BehaviorProviderInjectType;

    return behaviorInject
}