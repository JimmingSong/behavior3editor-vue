<template>
  <div class="behavior-box" id="behavior-box" ref="behaviorBoxRef">
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Editor} from './Editor.ts'
import {Graph} from "./Graph.ts";
defineOptions({
  name: "BehaviorContainer"
})
const behaviorBoxRef = ref()
onMounted(() => {
  const editor = new Editor({
    container: behaviorBoxRef.value
  })
  const graph = new Graph(editor.board.ctx)
  graph.fillColor().fill().zoom(1.5, 1).fillRect(10, 10, 100, 200).zoom(1.5, 1).fillRect(100, 100, 100, 200)
})
</script>


<style scoped>
.behavior-box {
  width: 100%;
  height: 100%;
}

</style>