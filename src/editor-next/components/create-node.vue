<template>
  <el-dialog model-value title="新建Node" @close="handleClose" width="600px">
    <el-form :model="nodeForm" label-width="100px" label-position="top">
      <el-form-item label="名称">
        <el-input v-model="nodeForm.name" />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="nodeForm.title" />
      </el-form-item>
      <el-form-item label="类型">
        <behavior-category v-model="nodeForm.category" />
      </el-form-item>
      <el-form-item label="所属分类">
        <behavior-folder-select :category="nodeForm.category" v-model="nodeForm.parent" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="5" v-model="nodeForm.description" />
      </el-form-item>
      <el-form-item label="属性">
        <template #label>
          <div>
            <span>属性</span>
            <el-icon @click="handleAddProperty"><Plus /></el-icon>
          </div>
        </template>
        <behavior-property v-model="nodeForm.properties" ref="behaviorPropertyRef" />
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
import BehaviorProperty from "./behavior-propert.vue";
import {Plus} from "@element-plus/icons-vue";
import {useEditorHook} from "../use-editor-hook.ts";
import { Node } from '../utils/Node'
import BehaviorFolderSelect from "./behavior-folder-select.vue";

defineOptions({
  name: "CreateNode"
})

const nodeData = defineModel<Node | null>('node', { default: null})
const isShow = defineModel('isShow', { default: false})

const behaviorPropertyRef = ref<InstanceType<typeof BehaviorProperty>>()

const handleAddProperty = () => {
  behaviorPropertyRef.value?.add('', '', false)
}
const handleClose = () => {
  isShow.value = false
}
const nodeForm = ref<Node>(new Node())

const isUpdate = !!nodeData.value
const active = () => {
  if (isUpdate) {
    nodeForm.value = nodeData.value?.copy()
    return
  }
  nodeForm.value.category = 'condition'
}

active()


const { editor } = useEditorHook()
const handleSure = () => {
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
}
</script>


<style scoped lang="less">

</style>