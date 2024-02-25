<template>
  <div class="left-type-box">
    <div class="header">
      <span class="header-title">{{title}} </span>
      <span class="header-tool">
        <slot name="tool" />
        <span @click="handleFolder">folder</span>
      </span>
    </div>
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
const emits = defineEmits(['folder'])
const handleFolder = (e: MouseEvent) => {
  emits('folder', e)
}
</script>

<style scoped lang="less">
.left-type-box {
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-top: 10px;
    padding: 2px 5px;
    text-transform: capitalize;
    &-title {
      color: #999;
      font-family: sans-serif;
      font-weight: 400;
    }
    &-tool {
      display: none;
      color: #00c1fa;
      &>span + span {
        margin-left: 6px;
      }
    }
    &:hover .header-tool {
        display: inline-block;
    }
  }
}
</style>