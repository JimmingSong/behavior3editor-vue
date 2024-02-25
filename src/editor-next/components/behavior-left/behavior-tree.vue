<template>
  <left-type-box title="Tree">
    <el-tree :data="behaviorTreeData" node-key="id" :props="{label: 'name'}" :current-node-key="selectedId" highlight-current>
      <template #default="{data}">
        <span>
          <span>{{data.name}}</span>
          <span>编辑</span>
        </span>
      </template>
    </el-tree>
  </left-type-box>
</template>

<script setup lang="ts">
import LeftTypeBox from "./left-type-box.vue";
import {useEditorHook} from "../../use-editor-hook.ts";

defineOptions({
  name: "BehaviorTree"
})

const behaviorTreeData = ref([])
const selectedId = ref('')

const { editor } = useEditorHook()
const active = () => {
  const p = toValue(editor).project.get();
  if (!p) {
    return;
  }

  const result = []

  const selected = p.trees.getSelected();

  selectedId.value = selected._id

  p.trees.each(function (tree: any) {
    const root = tree.blocks.getRoot();
    result.push({
      id: tree._id,
      name: root.title || 'A behavior tree',
      title: root.title,
      category: 'tree',
      hostFOMObject: root.hostFOMObject,
      isDefault: false
    })
  });
  p.folders.each(folder => {
    if (folder.category !== 'tree') return;
    result.push({
      id: folder.name,
      name: folder.title,
      title: folder.title,
      category: folder.category,
      parent: folder.parent,
      type: 'folder',
      index: result.length,
      isDefault: folder.isDefault
    })
  })
  behaviorTreeData.value = result
}


const _event = () => {
   setTimeout(() => active(), 0)
 }

nextTick(() => {
  const edit = toValue(editor)
  edit.on('treeadded', _event);
  edit.on('treeselected', _event);
  edit.on('treeremoved', _event);
  edit.on('treeimported', _event);

  edit.on('folderremoved', _event)
  edit.on('folderadded', _event)
  edit.on('folderchanged', _event)
  active()
})

onBeforeUnmount(() => {
  const edit = toValue(editor)
  edit.off('treeadded', _event);
  edit.off('treeselected', _event);
  edit.off('treeremoved', _event);
  edit.off('treeimported', _event);

  edit.off('folderremoved', _event)
  edit.off('folderadded', _event)
  edit.off('folderchanged', _event)
})


</script>

<style scoped lang="less">

</style>