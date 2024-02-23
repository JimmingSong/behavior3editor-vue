<template>
  <div class="behavior-property">
    <el-row v-for="(item, dex) in rows" :key="item.id">
      <el-col :span="9">
        <el-input v-model="item.key" placeholder="属性名" @change="change" />
      </el-col>
      <el-col :span="9" :offset="1">
        <el-input v-model="item.value" placeholder="属性名" @change="change" />
      </el-col>
      <el-col :span="4" :offset="1">
        <el-icon @click="removeProperty(dex)"><Minus /></el-icon>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Minus } from '@element-plus/icons-vue'
defineOptions({
  name: "BehaviorProperty"
})

let id = 0;
const getId = () => {
  return ++id;
}

const properties = defineModel({default: () => ({})})

interface RowsType {
  key: string;
  value: string;
  fixed: boolean;
  id: number
}
const rows = ref<RowsType[]>([])

const addProperty = (key: string, value: string, fixed: boolean) => {
  rows.value.push({key, value, fixed, id: getId()})
}

const resolvePropertiesToList = (property: Record<string, any>) => {
  const result: RowsType[] = []
  for (const key in property) {
    result.push({key, value: property[key], fixed: false, id: getId()})
  }
  rows.value = result
}

resolvePropertiesToList(properties.value)

const removeProperty = (index: number) => {
  rows.value.splice(index, 1)
  change()
}


const updatePropertyByRows = () => {
  const result: Record<string, any> = {}
  toValue(rows).forEach(item => {
    result[item.key] = item.value
  })
  properties.value = result
}
const change = () => {
  updatePropertyByRows()
}

defineExpose({
  add: addProperty
})

</script>


<style scoped lang="less">

</style>