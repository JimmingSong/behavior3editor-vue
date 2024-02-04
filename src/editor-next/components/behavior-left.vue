<template>
  <div class="behavior-left">
    <template v-for="(item, key) in nodesData" :key="key">
      <div class="behavior-left__category">{{ key }}</div>
      <div v-for="it in item" :key="it.id" draggable="true" @dragover.prevent @dragstart="handleDragStart($event, it)">{{ it.title }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useEditorHook } from '../use-editor-hook.ts';

defineOptions({
  name: 'BehaviorLeft'
});
const { editor } = useEditorHook();
const nodesData = ref<Record<string, any>>({
  composite: [],
  decorator: [],
  action: [],
  condition: []
});

function _getTitle(node: any) {
  let title = node.title || node.name;
  title = title.replace(/(<\w+>)/g, () => '@');
  return title;
}
const trees = ref<any[]>([]);

const _activate = () => {
  nodesData.value = {
    composite: [],
    decorator: [],
    action: [],
    condition: []
  };
  const p = toValue(editor).project.get();
  if (!p) {
    return;
  }
  p.nodes.each(function (node: any) {
    if (node.category === 'tree') {
      return;
    }

    var list = toValue(nodesData)[node.category];
    if (!list) {
      return;
    }
    list.push({
      name: node.name,
      title: _getTitle(node),
      isDefault: node.isDefault
    });
  });

  var selected = p.trees.getSelected();
  p.trees.each(function (tree: any) {
    const root = tree.blocks.getRoot();
    trees.value.push({
      id: tree._id,
      name: root.title || 'A behavior tree',
      active: tree === selected,
      hostFOMObject: root.hostFOMObject
    });
  });
};

const handleDragStart = (e: DragEvent, attrs: any) => {
  var canvas = toValue(editor).preview(attrs.name);
  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  if (isChrome) {
    var img = document.createElement('img');
    img.src = canvas.toDataURL();

    // 10ms delay in order to proper create the image object
    // ugly hack =(
    var time = new Date().getTime();
    var delay = time + 10;
    while (time < delay) {
      time = new Date().getTime();
    }
    canvas = img;
  }

  e.dataTransfer!.setData('name', attrs.name);
  e.dataTransfer!.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
};

const _event = (e: any) => {
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
