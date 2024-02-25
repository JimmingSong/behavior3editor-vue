<template>
  <div class="left-type-box">
    <div class="header">{{title}} </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "LeftTypeBox"
})
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="less">
.left-type-box {
  width: 100%;
  .header {
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