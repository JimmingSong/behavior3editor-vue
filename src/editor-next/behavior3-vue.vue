<template>
  <n-config-provider :abstract="true" :theme="darkTheme">
    <n-message-provider>
      <div class="behavior" ref="behaviorBoxRef" @keydown.ctrl.a.prevent>
        <behavior-header class="behavior__header"/>
        <div class="behavior-container">
          <behavior-left/>
          <div id="behavior-box" @dragover.prevent></div>
          <behavior-right/>
        </div>
        <behavior-export :type="exportType" v-if="exportDialogShow" v-model:is-show="exportDialogShow"/>
        <behavior-import :type="importType" v-if="importDialogShow" v-model:is-show="importDialogShow"/>
        <create-folder v-if="folderDialogShow" v-model:is-show="folderDialogShow" :folder-data="updateFolderData"/>
        <create-node v-if="nodeDialogShow" v-model:is-show="nodeDialogShow" :node-data="updateNodeData"/>
        <behavior-project v-if="projectDialogShow" v-model:is-show="projectDialogShow"/>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {Editor} from './Editor/Editor';
import BehaviorLeft from './components/behavior-left/behavior-left.vue';
import BehaviorRight from './components/behavior-right.vue';
import {defaultProjectConfig} from './use-create-project.ts';
import './utils/functions';
import BehaviorHeader from './components/behavior-header.vue';
import {EditorInstance} from "./use-editor-hook.ts";
import BehaviorExport from "./components/behavior-export.vue";
import BehaviorImport from "./components/behavior-import.vue";
import BehaviorProject from "./components/behavior-project.vue";
import {behaviorProviderKey, ProjectDetailType} from "./use-behavior-inject.ts";
import {darkTheme} from "naive-ui";
import CreateNode from "./components/create-node.vue";
import CreateFolder from "./components/create-folder.vue";
import {useNodeFolder} from "./use-node-folder.ts";

defineOptions({
  name: 'Behavior3Vue'
});
const behaviorBoxRef = ref();
const editor = shallowRef();
provide('editor', editor);


const projectDetail = ref<ProjectDetailType>({
  name: 'projectName',
  description: ''
})

const setProjectDetail = (data: ProjectDetailType) => {
  projectDetail.value = data;
}

const createProject = (initialData?: any) => {
  toValue(editor).project.open(initialData ?? defaultProjectConfig);
};


/**
 * 绑定拖拽事件
 * @param editor1
 */
const bindDropEvent = (editor1: EditorInstance) => {
  editor1._game.canvas.addEventListener('drop', (e: DragEvent) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    const name = e.dataTransfer!.getData('name');

    const canvas = editor1._game.canvas;
    const rect = canvas.getBoundingClientRect();
    const project = editor1.project.get();
    const tree = project.trees.getSelected();

    const point = tree.view.getLocalPoint(e.clientX - rect.x, e.clientY - rect.y);
    tree.blocks.add(name, point.x, point.y);

    editor1._game.canvas.focus();
  });
  editor1._game.canvas.setAttribute('b3-drop-node', 'true');
};
onMounted(() => {
  const box = behaviorBoxRef.value;
  const editor1: any = new Editor({
    container: 'behavior-box',
    width: box.clientWidth,
    height: box.clientHeight,
    background_color: '#242424'
  });
  editor.value = editor1;
  createProject();
  bindDropEvent(editor1);
});


const exportDialogShow = ref(false)
const exportType = ref('project');

const setExportDialogShow = (type: 'project' | 'tree' | 'node') => {
  exportType.value = type;
  exportDialogShow.value = true
}

const importDialogShow = ref(false)
const importType = ref('project')
const setImportDialogShow = (type: 'project' | 'tree' | 'node') => {
  importType.value = type
  importDialogShow.value = true;
}

const projectDialogShow = ref(false)
const setProjectDialogShow = () => {
  projectDialogShow.value = true
}

const { show: folderDialogShow, state: updateFolderData, setState: setFolderDialogShow } = useNodeFolder()
const { show: nodeDialogShow, state: updateNodeData, setState: setNodeDialogShow } = useNodeFolder()

provide(behaviorProviderKey, {
  setExportDialogShow,
  setImportDialogShow,
  setProjectDialogShow,
  setFolderDialogShow,
  setNodeDialogShow,
  projectDetail,
  setProjectDetail
})

</script>

<style scoped lang="less">
.behavior {
  width: 100%;
  height: 100%;
  --b3-left-width: 300px;
  --b3-right-width: 300px;
  --b3-header-height: 50px;

  &__header {
    display: flex;
    height: var(--b3-header-height);
    width: 100%;
    align-items: center;
    border-bottom: 1px solid #1a1a1a;
    box-sizing: border-box;
    line-height: 1;
  }
}

.behavior-container {
  display: flex;
  width: 100%;
  height: calc(100% - var(--b3-header-height));

  #behavior-box {
    width: calc(100% - var(--b3-left-width) - var(--b3-right-width));
    height: 100%;
  }
}
</style>
