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
        <span class="behavior-property__handle">
          <el-icon @click="removeProperty(dex)"><Minus /></el-icon>
        </span>
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

const properties = defineModel<Record<string, any>>({default: () => ({})})

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

const resolvePropertiesToList = () => {
  const property = properties.value
  const result: RowsType[] = []
  for (const key in properties.value) {
    result.push({key, value: property[key], fixed: false, id: getId()})
  }
  rows.value = result
}

resolvePropertiesToList()

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
  add: addProperty,
  reset: resolvePropertiesToList
})

</script>


<style scoped lang="less">
.behavior-property {
  width: 100%;
  &__handle {
    display: inline-flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    &:hover {
      background: #013849;
    }
  }
}
</style>