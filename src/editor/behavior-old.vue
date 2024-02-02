<template>
  <div class="behavior-box" id="behavior-box" ref="behaviorBoxRef">
  </div>
</template>
<script setup lang="ts">
import './namespaces'
import {onMounted, ref} from "vue";
const behaviorBoxRef = ref()
onMounted(() => {
  const box = behaviorBoxRef.value
  const editor = new window.b3e.editor.Editor({container: 'behavior-box', width: box.clientWidth, height: box.clientHeight})
  console.log(editor)
})
</script>


<style scoped>
.behavior-box {
  width: 1200px;
  height: 800px;
}
</style>