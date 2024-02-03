<template>
  <div class="behavior" ref="behaviorBoxRef">
    <behavior-header />
    <div class="behavior-container">
      <behavior-left />
      <div id="behavior-box" @dragover.prevent></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {Editor} from "./Editor/Editor";
import BehaviorLeft from "./components/behavior-left.vue";
import {useCreateProject} from "./use-create-project.ts";
import './utils/functions'
import BehaviorHeader from "./components/behavior-header.vue";

defineOptions({
  name: "Behavior3Vue"
})
const behaviorBoxRef = ref()
const editor = shallowRef()
provide('editor', editor)

const {createProject} = useCreateProject(editor)
onMounted(() => {
  const box = behaviorBoxRef.value
  const editor1: any = new Editor({container: 'behavior-box', width: box.clientWidth, height: box.clientHeight})
  editor.value = editor1
  createProject()
  editor1._game.canvas.addEventListener('drop', (e: DragEvent) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    const name = e.dataTransfer!.getData('name');

    const canvas = editor1._game.canvas;
    const rect = canvas.getBoundingClientRect()
    const project = editor1.project.get();
    const tree = project.trees.getSelected();

    const point = tree.view.getLocalPoint(e.clientX - rect.x, e.clientY - rect.y);
    tree.blocks.add(name, point.x, point.y);

    editor1._game.canvas.focus();
  })
  editor1._game.canvas.setAttribute('b3-drop-node', 'true')
})
</script>


<style scoped>
.behavior {
  width: 100%;
  height: 100%;
  --b3-left-width: 300px;
  --b3-header-height: 50px;
}
.behavior-container {
  display: flex;
  width: 100%;
  height: calc(100% - var(--b3-header-height));
  #behavior-box {
    width: calc(100% - var(--b3-left-width));
    height: 100%;
  }
}
</style>