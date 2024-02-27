<template>
  <n-modal show title="所有项目" preset="dialog" @close="handleClose" style="width: 40%;" type="info">
    <n-data-table class="project-table" :data="projectList" :columns="projectColumns" min-height="400px" max-height="400px" />
  </n-modal>
</template>

<script setup lang="ts">
import {DataTableColumns, NButton, NSpace, useMessage} from 'naive-ui'
import {projectStore} from "../project-store.ts";
import {useEditorHook} from "../use-editor-hook.ts";
import {useBehaviorInject} from "../use-behavior-inject.ts";
defineOptions({
  name: "behavior-project"
})

const isShow = defineModel('isShow', {default: false})
const handleClose = () => {
  isShow.value = false
}

const projectList =ref<{name: string}[]>([])

const { setProjectDetail } = useBehaviorInject()

const { success } = useMessage()
const {editor } = useEditorHook()
const projectColumns:DataTableColumns = [
  {
    title: '项目名称',
    key: 'name',
    align: 'center'
  },
  {
    title: '操作',
    key: 'name',
    align: 'center',
    render(rowData) {
      const edit = h(NButton, {
        text: true,
        onClick() {
          projectStore.getItem(rowData.name as string).then((project: any) => {
            const i = toValue(editor).import;
            i.projectAsData(project.data)
            setProjectDetail({name: project.name, description: project.description})
            handleClose()
          })
        },
      }, {
        default: ()=> '编辑'
      })
      const remove = h(NButton, {
        text: true,
        onClick() {
          projectStore.removeItem(rowData.name as string).then(() => {
            success('删除成功')
            handleClose()
          })
        },
      }, {
        default: ()=> '删除'
      })
        return h(NSpace, {
          justify: 'center',
        }, {
          default: () => [edit, remove]
        })
    },
  }
]

projectStore.keys().then((keys:string[]) => {
  projectList.value = keys.map(item => ({name: item}))
})
</script>


<style scoped lang="less">

</style>