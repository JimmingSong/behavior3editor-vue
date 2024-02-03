<template>
  <div class="behavior-header">
    <n-button @click="handleSave">保存</n-button>
  </div>
</template>

<script setup lang="ts">
import {useEditorHook} from "../use-editor-hook.ts";

defineOptions({
  name: "BehaviorHeader"
})

const {editor} = useEditorHook()
const handleSave = () => {
  const export1 = toValue(editor).export
  console.log(export1.treeToData())
}
</script>


<style scoped lang="less">
.behavior-header {
  width: 100%;
  height: var(--b3-header-height, 50px);
  line-height: var(--b3-header-height, 50px);
  border-bottom: 1px solid #1a1a1a;
}
</style>