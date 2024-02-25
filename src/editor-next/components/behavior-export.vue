<template>
  <n-modal preset="dialog" show title="导出" style="width: 700px" @close="isShow = false" display-directive="if">
    <n-input type="textarea" v-model:value="showJsonData" :rows="20" />
    <template #action>
      <n-button @click="handleCopy">复制</n-button>
      <n-button @click="handlePretty">{{  isCompact ? '紧凑' : '美化' }}</n-button>
      <n-button @click="handleSave" type="primary">保存</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {useEditorHook} from "../use-editor-hook.ts";
import { useClipboard } from '@vueuse/core'
import {useMessage} from "naive-ui";

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

const {success} = useMessage()
const handleCopy = () => {
  copy(showJsonData.value).then(() => {
    success('复制成功')
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