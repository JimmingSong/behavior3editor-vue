<template>
  <el-dialog model-value title="新建Folder" width="600px" @close="handleClose">
    <el-form :model="folderForm" label-width="100px" :rules="folderRules" ref="folderFormRef">
      <el-form-item label="名称">
        <el-input placeholder="请输入Folder名称" v-model="folderForm.name" readonly />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="folderForm.title" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="类型">
        <behavior-category v-model="folderForm.category" />
      </el-form-item>
      <el-form-item label="所属分类">
        <behavior-folder-select v-model="folderForm.parent" :category="folderForm.category" />
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
import {FormInstance, FormRules} from "element-plus";
import BehaviorFolderSelect from "./behavior-folder-select.vue";

defineOptions({
  name: "CreateFolder"
})

const isShow = defineModel('isShow', {
  default: false
})

const folderFormRef = ref<FormInstance>()

const handleClose = () => {
  isShow.value =false
}

const folderForm = ref({
  name: b3.createUUID(),
  title: '',
  description: '',
  category: 'condition',
  parent: ''
})

const { editor } = useEditorHook()
const handleSure = () => {
  folderFormRef.value?.validate((isValid) => {
    if (isValid) {
      const p = toValue(editor).project.get();
      p.folders.add(toValue(folderForm));
      isShow.value = false
    }
  })
}

const folderRules: FormRules = {
  title: [{required: true, message: 'title为必填项', trigger: 'blur'}]
}

</script>

<script lang="ts">
export default {
  name: "CreateFolder"
}
</script>


<style scoped lang="less">

</style>