<template>
  <div class="behavior-box" id="behavior-box" ref="behaviorBoxRef">
  </div>
</template>
<script setup lang="ts">
import './editor/namespaces'
import {onMounted, ref} from "vue";
const behaviorBoxRef = ref()
onMounted(() => {
  const box = behaviorBoxRef.value
  new window.b3e.editor.Editor({container: 'behavior-box', width: box.clientWidth, height: box.clientHeight})
})
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
