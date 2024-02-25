<template>
  <n-modal show title="所有项目" preset="dialog" @close="handleClose">
    <n-data-table :data="projectList" :columns="projectColumns" />
  </n-modal>
</template>

<script setup lang="ts">
import { DataTableColumns } from 'naive-ui'
defineOptions({
  name: "behavior-project"
})

const isShow = defineModel('isShow', {default: false})
const handleClose = () => {
  isShow.value = false
}

const projectList =ref([])

const projectColumns:DataTableColumns = [
  {
    title: '项目名称',
    key: 'name',
    align: 'center'
  },
  {
    title: '操作',
    key: 'name',
    align: 'center'
  }
]
</script>


<style scoped lang="less">

</style>