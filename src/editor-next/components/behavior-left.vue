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
      <el-tree v-if="item.id === 'tree'" :data="item.children" :props="{ label: 'name' }" node-key="id" :current-node-key="selectedTreeId" highlight-current></el-tree>
      <el-tree v-else :data="item.children" :props="{ label: 'name' }" node-key="id" draggable @node-drag-start="handleDragStart" :allow-drop="nodeAllowDrop" empty-text="空" @node-drop="handleNodeDrop" @node-drag-leave="handleDragStart">
        <template #default="{ data }">
          <el-icon v-if="data.type === 'folder'" class="folder-icon">
            <Folder />
          </el-icon>
          <span>{{data.name}}</span>
        </template>
      </el-tree>
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
import { Folder } from '@element-plus/icons-vue'
import { cloneFnJSON } from '@vueuse/core'

defineOptions({
  name: 'BehaviorLeft'
});
const { editor } = useEditorHook();

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
    tree: {
      name: 'tree',
      id: 'tree',
      children: []
    },
    condition: {
      name: 'condition',
      id: 'condition',
      children: []
    },
    action: {
      name: 'action',
      id: 'action',
      children: []
    },
    decorator: {
      name: 'decorator',
      id: 'decorator',
      children: []
    },
    composite: {
      name: 'composite',
      id: 'composite',
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

const selectedTreeId = ref('')

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

  const selected = p.trees.getSelected();

  selectedTreeId.value = selected._id

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

  p.folders.each((folder: any) => {
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
const nodeAllowDrop = (draggingNode: any, dropNode: any, type: string) => {
  if (['prev','next'].includes(type)) return false
  if (dropNode.type === 'folder') return true;
  if (draggingNode.isDefault || dropNode.isDefault) {
    return false
  }
}
const handleDragStart = (node: any, e: DragEvent) => {
  const attrs = node.data;
  if (attrs.type !== 'folder') {
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
    e.dataTransfer!.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
  }

  e.dataTransfer!.setData('name', attrs.name);
  e.dataTransfer!.setData('type', attrs.type);
};


const handleNodeDrop = (dragNode: any, node: any) => {
  dragNode.data.parent = node.data.parent
}

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
  --el-color-primary-light-9: #00c1fa;
  .folder-icon {
    margin-right: 6px;
  }
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
