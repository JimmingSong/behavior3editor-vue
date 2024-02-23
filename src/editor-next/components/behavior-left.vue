<template>
  <div class="behavior-left">
    <div class="behavior-left__header">
      <span>编辑</span>
      <span>
        <el-button text type="primary" size="small">Tree</el-button>
        <el-button text type="primary" size="small" @click="nodeDialogShow = true">Node</el-button>
        <el-button text type="primary" size="small" @click="folderDialogShow = true">Folder</el-button>
      </span>
    </div>
    <template v-for="(item) in listDataComputed" :key="item.id">
      <div class="behavior-left__category">{{ item.name }}</div>
      <el-tree :data="item.children" :props="{ label: 'name' }" node-key="id" draggable @node-drag-start="handleDragStart" :allow-drop="() => false"></el-tree>
    </template>
    <create-folder v-if="folderDialogShow" v-model:is-show="folderDialogShow" />
    <create-node v-if="nodeDialogShow" v-model:is-show="nodeDialogShow" />
  </div>
</template>

<script setup lang="ts">
import { useEditorHook } from '../use-editor-hook.ts';
import {useCreateFolder} from "./use-create-folder.ts";
import CreateFolder from "./create-folder.vue";
import CreateNode from "./create-node.vue";
import { nanoid } from 'nanoid'

defineOptions({
  name: 'BehaviorLeft'
});
const { editor } = useEditorHook();

const listData = ref<any[]>([])

const listDataToTreeData = (data: any[]) => {
  const typeMap: Record<string, any> = {}
  data.forEach(item => {
    if (!typeMap[item.category]) {
      typeMap[item.category] = {
        name:   item.category,
        id: nanoid(),
        children: [item]
      }
      return
    }
    typeMap[item.category].children.push(item)
  })
  return Object.values(typeMap).sort(item => {
    if (item.name === 'Tree') {
      return 1
    }
    return -1
  })
}

const listDataComputed = computed(() => {
  return listDataToTreeData(listData.value)
})

const { folderDialogShow } = useCreateFolder()
const nodeDialogShow = ref(false)
function _getTitle(node: any) {
  let title = node.title || node.name;
  title = title.replace(/(<\w+>)/g, () => '@');
  return title;
}

const _activate = () => {
  const result: any[] = []
  const p = toValue(editor).project.get();
  if (!p) {
    return;
  }
  p.nodes.each(function (node: any) {
    if (['tree', 'root'].includes(node.category)) {
      return;
    }
    result.push({
      name: node.name,
      category: node.category,
      title: _getTitle(node),
      isDefault: node.isDefault
    })

  });

  const selected = p.trees.getSelected();
  p.trees.each(function (tree: any) {
    const root = tree.blocks.getRoot();
    result.push({
      id: tree._id,
      name: root.title || 'A behavior tree',
      category: 'tree',
      active: tree === selected,
      hostFOMObject: root.hostFOMObject
    })
  });

  p.folders.each((folder: any) => {
    result.push({
      name: folder.name,
      title: _getTitle(folder),
      category: folder.category,
      parent: folder.parent,
      type: 'folder',
      index: result.length,
      isDefault: folder.isDefault
    })
  })
  listData.value = result
};

const handleDragStart = (node: any, e: DragEvent) => {
  const attrs = node.data;
  let canvas = toValue(editor).preview(attrs.name) as HTMLCanvasElement;
  const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  if (isChrome) {
    const img = document.createElement('img');
    img.src = canvas.toDataURL();

    // 10ms delay in order to proper create the image object
    // ugly hack =(
    let time = new Date().getTime();
    const delay = time + 10;
    while (time < delay) {
      time = new Date().getTime();
    }
    //@ts-ignore
    canvas = img;
  }

  e.dataTransfer!.setData('name', attrs.name);
  e.dataTransfer!.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
};

const _event = () => {
  setTimeout(function () {
    _activate();
  }, 0);
};

const _create = () => {
  const edit = toValue(editor);
  edit.on('nodechanged', _event);
  edit.on('noderemoved', _event);
  edit.on('nodeadded', _event);
  edit.on('treeadded', _event);
  edit.on('blockchanged', _event);
  edit.on('treeselected', _event);
  edit.on('treeremoved', _event);
  edit.on('treeimported', _event);

  edit.on('folderremoved', _event)
  edit.on('folderadded', _event)
  edit.on('folderchanged', _event)
};

function _destroy() {
  const edit = toValue(editor);
  edit.off('nodechanged', _event);
  edit.off('noderemoved', _event);
  edit.off('nodeadded', _event);
  edit.off('treeadded', _event);
  edit.off('blockchanged', _event);
  edit.off('treeselected', _event);
  edit.off('treeremoved', _event);
  edit.off('treeimported', _event);

  edit.off('folderremoved', _event)
  edit.off('folderadded', _event)
  edit.off('folderchanged', _event)
}

nextTick(() => {
  _activate();
  _create();
});

onBeforeUnmount(() => {
  _destroy();
});
</script>

<style scoped lang="less">
.behavior-left {
  width: var(--b3-left-width);
  overflow-y: auto;
  &__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    border-bottom: 1px solid #7d7d7d;
    padding: 3px 0;
    box-sizing: border-box;
  }
  &__category {
    cursor: pointer;
    display: block;
    margin-top: 10px;
    padding: 2px 5px;
    text-transform: capitalize;
    color: #999;
    font-family: sans-serif;
    font-weight: 400;
  }
}
</style>
