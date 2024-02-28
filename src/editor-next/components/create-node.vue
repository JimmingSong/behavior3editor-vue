<template>
  <n-modal show title="新建Node" display-directive="if" @close="handleClose" style="width: 40%" preset="dialog">
    <n-form :model="nodeForm" label-width="100px" label-position="top" :rules="nodeRules" ref="nodeFormRef">
      <n-form-item label="名称" path="name">
        <n-input v-model:value="nodeForm.name" />
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input v-model:value="nodeForm.title" />
      </n-form-item>
      <n-form-item label="类型" path="category">
        <behavior-category v-model:value="nodeForm.category" />
      </n-form-item>
      <n-form-item label="所属分类">
        <behavior-folder-select :category="nodeForm.category" v-model:value="nodeForm.parent" />
      </n-form-item>
      <n-form-item label="描述">
        <n-input type="textarea" :rows="5" v-model:value="nodeForm.description" />
      </n-form-item>
      <n-form-item label="属性">
        <template #label>
          <div>
            <span>属性</span>
            <el-icon @click="handleAddProperty"><Plus /></el-icon>
          </div>
        </template>
        <behavior-property v-model="nodeForm.properties" ref="behaviorPropertyRef" />
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
import BehaviorProperty from "./behavior-propert.vue";
import {Plus} from "@element-plus/icons-vue";
import {useEditorHook} from "../use-editor-hook.ts";
import { Node } from '../utils/Node'
import BehaviorFolderSelect from "./behavior-folder-select.vue";
import {FormInst} from "naive-ui";
import {NodeFolderPartialType} from "../use-node-folder.ts";
import {getProject} from "../use-create-project.ts";

defineOptions({
  name: "CreateNode"
})

const nodeFormRef = ref<FormInst>()

const nodeRules = {
  name: [{required: true, message: 'name为必填项', trigger: 'blur'}],
  title: [{required: true, message: 'title为必填项', trigger: 'blur'}],
  category: [{required: true, message: 'category为必填项', trigger: 'blur'}]
}
const nodeData = defineModel<NodeFolderPartialType | null>('node', { default: null})
const isShow = defineModel('isShow', { default: false})

const behaviorPropertyRef = ref<InstanceType<typeof BehaviorProperty>>()

const handleAddProperty = () => {
  behaviorPropertyRef.value?.add('', '', false)
}
const handleClose = () => {
  isShow.value = false
}
const nodeForm = ref<Node>(new Node())
const originalNode = shallowRef<Node>()

const isUpdate = !!nodeData.value?.name
const active = () => {
  if (isUpdate) {
    const p = getProject(toValue(editor)).project.get()
    console.log("nodeData.value?.name ------", nodeData.value?.name)
    const node = p.nodes.get(nodeData.value?.name)
    originalNode.value = node
    nodeForm.value = node?.copy()
    return
  }
  nodeForm.value.category = toValue(nodeData)?.category ?? 'condition'
}

active()


const { editor } = useEditorHook()
const handleSure = () => {
  nodeFormRef.value?.validate((errors) => {
    if (errors) return
    const p = toValue(editor).project.get()
    const formValue = toValue(nodeForm)
    if (isUpdate) {
      p.nodes.update(toValue(nodeData), formValue)
      nodeData.value = null
      return
    }
    p.nodes.add(formValue)
    nodeData.value = null
    handleClose()
  })
}
</script>


<style scoped lang="less">

</style>