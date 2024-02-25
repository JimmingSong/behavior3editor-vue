<template>
  <div class="behavior-left">
    <div class="behavior-left__header">
      <span>编辑</span>
      <n-space>
        <n-button text type="primary" size="small">Tree</n-button>
        <n-button text type="primary" size="small" @click="setNodeDialogShow()">Node</n-button>
        <n-button text type="primary" size="small" @click="setFolderDialogShow()">Folder</n-button>
      </n-space>
    </div>
    <div>
      <behavior-tree />
        <left-type-box :title="item.name"  v-for="(item) in listDataComputed" :key="item.id">
          <n-tree block-line :data="item.children" label-field="name" key-field="id" draggable @dragstart="handleDragStart" :allow-drop="nodeAllowDrop" />
        </left-type-box>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorHook } from '../../use-editor-hook.ts';
import { useCreateFolder } from "../use-create-folder.ts";
import { cloneFnJSON } from '@vueuse/core'
import { useDragEvent } from "./use-drag-event.ts";
import BehaviorTree from "./behavior-tree.vue";
import {useBehaviorInject} from "../../use-behavior-inject.ts";
import LeftTypeBox from "./left-type-box.vue";

defineOptions({
  name: 'BehaviorLeft'
});
const { editor } = useEditorHook();

const { handleDragStart, nodeAllowDrop, handleNodeDrop } = useDragEvent()
const {setFolderDialogShow, setNodeDialogShow} = useBehaviorInject()

interface ListDataType {
  id: string;
  name: string;
  title: string;
  category: string;
  isDefault: boolean;
  type?: string;
  index?: number;
  parent?: string;
  hostFOMObject?: any
}
const listData = ref<ListDataType[]>([])

const listDataToTreeData = (data: any[]) => {
  const dataMap: Record<string, any> = {}
  data.forEach(item => {
    dataMap[item.id] = item;
  })
  const typeMap: Record<string, any> = {
    composite: {
      name: 'composite',
      id: 'composite',
      children: []
    },
    decorator: {
      name: 'decorator',
      id: 'decorator',
      children: []
    },
    action: {
      name: 'action',
      id: 'action',
      children: []
    },
    condition: {
      name: 'condition',
      id: 'condition',
      children: []
    }
  }
  data.forEach(item => {
    if (item.parent) {
      const parent = dataMap[item.parent]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
      return;
    }
    if (item.type === 'folder') {
      typeMap[item.category].children.unshift(item);
      return
    }
    typeMap[item.category].children.push(item)
  })
  return Object.values(typeMap)
}
const listDataComputed = computed(() => {
  return listDataToTreeData(cloneFnJSON(listData.value))
})

const { folderDialogShow } = useCreateFolder()
const nodeDialogShow = ref(false)
function _getTitle(node: any) {
  let title = node.title || node.name;
  title = title.replace(/(<\w+>)/g, () => '@');
  return title;
}

const _activate = () => {
  const result: ListDataType[] = []
  const p = toValue(editor).project.get();
  if (!p) {
    return;
  }
  p.nodes.each(function (node: any) {
    if (['tree', 'root'].includes(node.category)) {
      return;
    }
    result.push({
      id: node.name,
      name: node.name,
      title: _getTitle(node),
      category: node.category,
      parent: node.parent,
      isDefault: node.isDefault
    })
  });

  p.folders.each((folder: any) => {
    if (folder.category === 'tree') return
    result.push({
      id: folder.name,
      name: _getTitle(folder),
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
  edit.on('blockchanged', _event);


  edit.on('folderremoved', _event)
  edit.on('folderadded', _event)
  edit.on('folderchanged', _event)
};

function _destroy() {
  const edit = toValue(editor);
  edit.off('nodechanged', _event);
  edit.off('noderemoved', _event);
  edit.off('nodeadded', _event);
  edit.off('blockchanged', _event);

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
  .folder-icon {
    margin-right: 6px;
  }
  .custom-node {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__right {
      &>span + span {
         margin-left: 4px;
       }
    }
  }
  &__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    border-bottom: 1px solid #7d7d7d;
    padding: 3px 6px;
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
