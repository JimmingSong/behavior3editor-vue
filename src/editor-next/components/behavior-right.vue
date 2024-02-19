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
        <span @click="addProperty('', '', false)">+</span>
      </div>
      <el-form>
        <el-form-item v-for="(item, index) in properties" :key="index">
          <el-col :span="10">
            <el-input v-model="item.key" @change="changePropertyKey" />
          </el-col>
          <el-col :span="10" :offset="1">
            <el-input v-model="item.value" @change="changePropertyValue"/>
          </el-col>
          <el-col :span="1" :offset="1">
            <span @click="removeProperty(index)">-</span>
          </el-col>
        </el-form-item>
      </el-form>
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
const parseProperties = (property?: any) => {
  if (!property) {
    return;
  }
  for (const propertiesKey in property) {
    addProperty(propertiesKey, property[propertiesKey], false)
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
      // properties: tine.merge({name: '111'}, _original.properties)
    }
    parseProperties(properties)
    return
  }
  block.value = null
}

const parsePropertiesToObject = () => {
  return toValue(properties).reduce((acc: any, cur: any) => {
    acc[cur.key] = cur.value;
    return acc;
  }, {} as any)
}
const update = () => {
  const p = editor.value.project.get();
  const t = p.trees.getSelected();
  t.blocks.update(toValue(original), {
    ...toValue(block),
    properties: parsePropertiesToObject()
  })
}

const changePropertyKey = (propertyKey: string) => {
  console.log(propertyKey)
  update()
}
const changePropertyValue = (propertyValue: string) => {
  console.log(propertyValue)
  update()
}

const removeProperty = (index: number) => {
  properties.value.splice(index, 1);
}

const _events = () => {
  setTimeout(() => {
    properties.value = []
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
  &__properties {
    display: flex;

  }
}
</style>
