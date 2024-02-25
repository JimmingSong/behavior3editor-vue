<template>
  <n-select v-bind="$attrs" :options="options" />
</template>

<script setup lang="ts">
defineOptions({
  name: "BehaviorCategory"
})

const options = [
  {
    label: 'Composite',
    value: 'composite'
  },
  {
    label: 'Decorator',
    value: 'decorator'
  },
  {
    label: 'Action',
    value: 'action'
  },
  {
    label: 'Condition',
    value: 'condition'
  }
]
</script>


<style scoped lang="less">

</style>