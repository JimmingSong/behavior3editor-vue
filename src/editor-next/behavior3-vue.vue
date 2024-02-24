<template>
  <div class="behavior" ref="behaviorBoxRef">
    <behavior-header class="behavior__header" />
    <div class="behavior-container">
      <behavior-left />
      <div id="behavior-box" @dragover.prevent></div>
      <behavior-right />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Editor } from './Editor/Editor';
import BehaviorLeft from './components/behavior-left.vue';
import BehaviorRight from './components/behavior-right.vue';
import { useCreateProject } from './use-create-project.ts';
import './utils/functions';
import BehaviorHeader from './components/behavior-header.vue';
import {EditorInstance} from "./use-editor-hook.ts";

defineOptions({
  name: 'Behavior3Vue'
});
const behaviorBoxRef = ref();
const editor = shallowRef();
provide('editor', editor);

const { createProject } = useCreateProject(editor);

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
  const editor1: any = new Editor({ container: 'behavior-box', width: box.clientWidth, height: box.clientHeight, background_color: '#242424' });
  editor.value = editor1;
  createProject();
  bindDropEvent(editor1);
});

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
