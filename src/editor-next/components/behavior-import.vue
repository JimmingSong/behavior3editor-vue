<template>
  <n-modal preset="dialog" show title="导出" style="width: 700px" @close="handleClose">
    <el-input type="textarea" v-model="importData" :rows="20" />
    <template #action>
      <n-button @click="handleLoadLocalFile">
        加载本地文件
        <input ref="fileInputRef" type="file" v-show="false" @change="fileChange" accept=".b3" />
      </n-button>
      <n-button @click="handleClose">取消</n-button>
      <n-button @click="handleImport" type="primary">导入</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {useEditorHook} from "../use-editor-hook.ts";

defineOptions({
  name: "behaviorImport"
})

const props = defineProps({
  type: {
    required: true,
    type: String as PropType<'project' | 'tree' | 'node'>
  }
})
const isShow = defineModel('isShow', {default: false})

const importData = ref('')
const { editor } = useEditorHook()


const fileInputRef =ref<HTMLInputElement>()

const fileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files!
  const file = files[0]

  const reader = new FileReader()
  reader.onload = (e) => {
    importData.value = e.target?.result as string
  }
  reader.readAsText(file)
}

const handleClose = () => {
  isShow.value = false
}

const handleLoadLocalFile = () => {
  fileInputRef.value?.click()
}
const handleImport = () => {
  try {
    const data = JSON.parse(importData.value);

    const i = toValue(editor).import;

    if (props.type === 'project') {
      i.projectAsData(data.data)
    } else if (props.type === 'tree') {
      i.treeAsData(data)
    } else {
      i.nodesAsData(data)
    }
    handleClose()
  } catch (e) {
    ElMessage.error('导入失败，请检查数据格式')
  }
}
</script>


<style scoped lang="less">

</style>