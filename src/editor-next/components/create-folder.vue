<template>
  <n-modal preset="dialog" show title="新建Folder" style="width: 40%" @close="handleClose">
    <n-form :model="folderForm" label-width="100px" :rules="folderRules" ref="folderFormRef">
      <n-form-item label="名称">
        <n-input placeholder="请输入Folder名称" v-model:value="folderForm.name" readonly />
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input v-model:value="folderForm.title" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="类型" path="category">
        <behavior-category v-model:value="folderForm.category" :disabled="!!type" />
      </n-form-item>
      <n-form-item label="所属分类">
        <behavior-folder-select v-model="folderForm.parent" :category="folderForm.category" />
      </n-form-item>
      <n-form-item label="描述">
        <n-input type="textarea" :rows="5" v-model:value="folderForm.description" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="handleClose">取消</n-button>
      <n-button type="primary" @click="handleSure">确定</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import BehaviorCategory from "./behavior-category.vue";
import {useEditorHook} from "../use-editor-hook.ts";
import BehaviorFolderSelect from "./behavior-folder-select.vue";
import {FormInst, FormRules} from "naive-ui";

defineOptions({
  name: "CreateFolder"
})
const props = defineProps({
  type:  {
    type: String,
    default: ''
  }
})

const isShow = defineModel('isShow', {
  default: false
})

const folderFormRef = ref<FormInst>()

const handleClose = () => {
  isShow.value =false
}

const folderForm = ref({
  name: b3.createUUID(),
  title: '',
  description: '',
  category: props.type || 'condition',
  parent: ''
})

const { editor } = useEditorHook()
const handleSure = () => {
  folderFormRef.value?.validate((isValid) => {
    if (!isValid) {
      const p = toValue(editor).project.get();
      p.folders.add(toValue(folderForm));
      isShow.value = false
    }
  })
}

const folderRules: FormRules = {
  title: [{required: true, message: 'title为必填项', trigger: 'blur'}],
  category: [{required: true, message: 'category为必填项', trigger: 'blur'}],
}

</script>

<script lang="ts">
export default {
  name: "CreateFolder"
}
</script>


<style scoped lang="less">

</style>