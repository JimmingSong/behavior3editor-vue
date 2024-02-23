<template>
  <el-select v-bind="$attrs">
    <el-option value="tree">Tree</el-option>
    <el-option value="composite" label="Composite"/>
    <el-option value="decorator" label="Decorator"/>
    <el-option value="action" label="Action"/>
    <el-option value="condition" label="Condition"/>
  </el-select>
</template>

<script setup lang="ts">
defineOptions({
  name: "BehaviorCategory"
})
</script>


<style scoped lang="less">

</style>