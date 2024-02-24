<!--
* @Author: 宋计民
* @Date: 2024/2/4
* @Version: 1.0
* @Content: behavior-right.vue
-->
<template>
  <div class="behavior-right">
    <div>属性</div>
    <div v-if="block">
      <div>标题</div>
      <div>
        <el-input v-model="block.title" @change="update"/>
      </div>
      <div>描述</div>
      <div>
        <el-input type="textarea" v-model="block.description" @change="update"/>
      </div>
      <div>
        <span>属性</span>
        <span @click="addProperty">+</span>
      </div>
      <behavior-property v-model="block.properties" ref="behaviorPropertyRef" @change="update" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useEditorHook} from "../use-editor-hook.ts";
import {onBeforeUnmount} from "vue";
import BehaviorProperty from "./behavior-propert.vue";

defineOptions({
  name: 'BehaviorRight'
});

const {editor} = useEditorHook()


const original = shallowRef<any>(null)
const block = ref<null | any>(null);
const behaviorPropertyRef = ref<InstanceType<typeof BehaviorProperty>>()
const addProperty = () => {
  behaviorPropertyRef.value?.add('','', false)
}

const _active = () => {
  behaviorPropertyRef.value?.reset()
  const p = editor.value.project.get();
  const t = p.trees.getSelected();
  const s = t.blocks.getSelected();
  if (s.length === 1) {
    const _original = s[0];
    original.value = _original
    const properties = Object.assign({}, _original.properties)
    block.value = {
      title: _original.title,
      description: _original.description,
      properties
    }
    return
  }
  block.value = null
}

const update = () => {
  const p = editor.value.project.get();
  const t = p.trees.getSelected();
  t.blocks.update(toValue(original), toValue(block))
}

const _events = () => {
  setTimeout(() => {
    _active();
  }, 0)
}

const _created = () => {
  const _editor = editor.value
  _editor.on('blockselected', _events);
  _editor.on('blockdeselected', _events);
  _editor.on('blockremoved', _events);
  _editor.on('treeselected', _events);
  _editor.on('nodechanged', _events);
}

const _destroyed = () => {
   const _editor = editor.value
  _editor.off('blockselected', _events);
  _editor.off('blockdeselected', _events);
  _editor.off('blockremoved', _events);
  _editor.off('treeselected', _events);
  _editor.off('nodechanged', _events);
 }

nextTick(() => {
  _active();
  _created()
})

onBeforeUnmount(() => {
  _destroyed()
})
</script>

<style scoped lang="less">
.behavior-right {
  width: var(--b3-right-width, 300px);
  height: 100%;
  &__properties {
    display: flex;

  }
}
</style>
