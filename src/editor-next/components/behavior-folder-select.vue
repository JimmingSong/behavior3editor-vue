<template>
  <el-select v-bind="$attrs">
    <el-option v-for="item in folders" :key="item.name" :label="item.title" :value="item.name" />
  </el-select>
</template>

<script setup lang="ts">
import {useEditorHook} from "../use-editor-hook.ts";
import {Folder} from "../utils/Folder";

defineOptions({
  name: "BehaviorFolderSelect"
})

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})
const folders = ref<Folder[]>([])
const {editor} = useEditorHook()

const active = () => {
  const p = toValue(editor).project.get()

  p.folders.each((item: Folder) => {
    if (props.category && item.category === props.category) {
      folders.value.push(item)
    }
  })
}

watch(() => props.category, active, {immediate: true})

</script>


<style scoped lang="less">

</style>