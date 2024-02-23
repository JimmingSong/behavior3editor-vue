<template>
  <el-select v-bind="$attrs">
    <el-option value="tree">Tree</el-option>
    <el-option value="composite">Composite</el-option>
    <el-option value="decorator">Decorator</el-option>
    <el-option value="action">Action</el-option>
    <el-option value="condition">Condition</el-option>
  </el-select>
</template>

<script setup lang="ts">
defineOptions({
  name: "BehaviorCategory"
})
</script>


<style scoped lang="less">

</style>