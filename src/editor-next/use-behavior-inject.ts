

export const behaviorProviderKey = Symbol('behaviorProviderKey');

export type BehaviorProjectType = 'project'|'tree' | 'node'
interface BehaviorProviderInjectType {
    setExportDialogShow: (type: BehaviorProjectType) => void,
    setImportDialogShow: (type: BehaviorProjectType) => void,
    setProjectDialogShow: () => void,
}

export function useBehaviorInject() {

    const behaviorInject = inject(behaviorProviderKey) as BehaviorProviderInjectType;

    return behaviorInject
}