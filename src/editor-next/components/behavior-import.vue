<template>
  <el-dialog model-value title="导出" width="700px" @close="handleClose">
    <el-input type="textarea" v-model="importData" :rows="20" />
    <template #footer>
      <el-button @click="handleLoadLocalFile">
        加载本地文件
        <input ref="fileInputRef" type="file" v-show="false" @change="fileChange" accept=".b3" />
      </el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="handleImport" type="primary">导入</el-button>
    </template>
  </el-dialog>
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
const handleImport = () => {
  try {
    const data = JSON.parse(importData.value);

    const i = toValue(editor).import;

    if (props.type === 'project') {
      i.projectAsData(data.data)
      return
    }
    if (props.type === 'tree') {
      i.treeAsData(data)
      return;
    }
    i.nodesAsData(data)
  } catch (e) {
    ElMessage.error('导入失败，请检查数据格式')
  }

}

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

const handleOpen = () => {
  isShow.value = true
}

const handleClose = () => {
  isShow.value = false
}

const handleLoadLocalFile = () => {
  fileInputRef.value?.click()
}
</script>


<style scoped lang="less">

</style>