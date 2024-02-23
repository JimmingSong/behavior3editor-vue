<template>
  <el-dialog model-value title="新建Folder" width="600px" @close="handleClose">
    <el-form :model="folderForm" label-width="100px">
      <el-form-item label="名称">
        <el-input placeholder="请输入Folder名称" v-model="folderForm.name" />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="folderForm.title" />
      </el-form-item>
      <el-form-item label="分类">
        <behavior-category v-model="folderForm.category" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="5" v-model="folderForm.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSure">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import BehaviorCategory from "./behavior-category.vue";
import {useEditorHook} from "../use-editor-hook.ts";

defineOptions({
  name: "CreateFolder"
})

const isShow = defineModel('isShow', {
  default: false
})

const handleClose = () => {
  isShow.value =false
}

const folderForm = ref({
  name: '',
  title: '',
  description: '',
  category: ''
})

const { editor } = useEditorHook()
const handleSure = () => {
  const p = toValue(editor).project.get();
  p.folders.add(toValue(folderForm));
}
</script>


<style scoped lang="less">

</style>