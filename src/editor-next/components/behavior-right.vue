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
        <el-input v-model="block.title"/>
      </div>
      <div>描述</div>
      <div>
        <el-input type="textarea" v-model="block.description"/>
      </div>
      <div>
        <span>属性</span>
        <span @click="addProperty('', '', false)">+</span>
      </div>
      <div v-for="item in properties" :key="item.key">
        <el-input v-model="item.key"/>
        <el-input v-model="item.value"/>
        <span>-</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useEditorHook} from "../use-editor-hook.ts";
import {onBeforeUnmount} from "vue";

defineOptions({
  name: 'BehaviorRight'
});

const {editor} = useEditorHook()


const original = shallowRef<any>(null)
const block = ref<null | any>(null);
const properties = ref<any[]>([]);

const addProperty = (key: string, value: string, fixed: boolean) => {
  properties.value.push({key, value, fixed});
}
const parseProperties = (properties?: any) => {
  if (!properties) {
    return;
  }
  for (const propertiesKey in properties) {
    addProperty(propertiesKey, properties[propertiesKey], false)
  }
}
const _active = () => {
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
      //@ts-ignore
      properties: tine.merge({name: '111'}, _original.properties)
    }
    parseProperties(properties)
    console.log(block)
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
}
</style>
