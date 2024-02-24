<template>
  <el-dialog model-value title="导出" width="700px" @close="isShow = false">
    <el-input type="textarea" v-model="showJsonData" :rows="20" />
    <template #footer>
      <el-button @click="handleCopy">复制</el-button>
      <el-button @click="handlePretty">{{  isCompact ? '紧凑' : '美化' }}</el-button>
      <el-button @click="handleSave" type="primary">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {useEditorHook} from "../use-editor-hook.ts";
import { useClipboard } from '@vueuse/core'
import {ElMessage} from "element-plus";

defineOptions({
  name: "behaviorExport"
})
const props = defineProps({
  type: {
    required: true,
    type: String as PropType<'project' | 'tree' | 'node'>
  }
})

const isShow = defineModel('isShow', {default: false})

const jsonData = ref('');
const {editor} = useEditorHook()
const isCompact = ref(true)
const active = () => {
  const e = toValue(editor).export;
  if (props.type === 'project') {
    jsonData.value = e.projectToData();
    return
  }
  if (props.type === 'tree') {
    jsonData.value = e.treeToData();
    return;
  }
  jsonData.value = e.nodesToData()
}

active()

const showJsonData = computed(() => {
  const data = toValue(jsonData)
  if (isCompact.value) {
    return JSON.stringify(data, null, 2)
  }
  return JSON.stringify(data)
})

const { copy } = useClipboard({legacy: true})
const handleCopy = () => {
  copy(showJsonData.value).then(() => {
    ElMessage.success('复制成功')
  })
}

const handlePretty = () => {
  isCompact.value = !isCompact.value
}

const handleSave = () => {
  const data = new Blob([showJsonData.value], {type: 'application/b3'})
  const url = URL.createObjectURL(data)
  const a = document.createElement('a');
  a.href = url
  a.download = `${props.type}.b3`;
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
</script>


<style scoped lang="less">

</style>