<template>
  <div class="behavior-header">
    <span>Behavior3 Editor</span>
    <n-space align="center">
      <n-icon @click="handleSaveProject" size="22px">
        <SaveOutline/>
      </n-icon>
      <n-icon size="22px" @click="handleUndo">
        <ArrowUndoOutline/>
      </n-icon>
      <n-icon size="22px" @click="handleRedo">
        <ArrowRedoOutline/>
      </n-icon>
      <!--<pick-file label="导入b3文件" accept=".b3" @change="handleImportFile" />-->
      <el-dropdown @command="handleEditCommand" placement="bottom-start">
        <span>编辑</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in editMenuOption" :key="item.command" :command="item.command"
                              :divided="item.divided">
              <div>
                <span>{{ item.label }}</span>
                <span>{{ item.keyboard }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown @command="handleViewCommand" placement="bottom-start">
        <span>视图</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in viewMenuOption" :key="item.command" :command="item.command">
              <div>
                <span>{{ item.label }}</span>
                <span>{{ item.keyboard }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown @command="handleSelectCommand" placement="bottom-start">
        <span>选择</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in selectMenuOption" :key="item.command" :command="item.command">
              <div>
                <span>{{ item.label }}</span>
                <span>{{ item.keyboard }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {useEditorHook} from '../use-editor-hook.ts';
import {SaveOutline, ArrowUndoOutline, ArrowRedoOutline} from '@vicons/ionicons5';
import {useCreateProject} from '../use-create-project.ts';
import {useViewHook} from "../use-view-hook.ts";
import {useSelectHook} from "../use-select-hook.ts";

defineOptions({
  name: 'BehaviorHeader'
});

const {editor} = useEditorHook();

const projectHandle = useCreateProject(editor);

const {handleSaveProject, handleUndo, handleRedo} = projectHandle;
projectHandle.bindKeyboardEvent();

const editMenuOption = [
  {
    command: 'handleUndo',
    label: '撤销',
    keyboard: 'ctrl+z'
  },
  {
    command: 'handleRedo',
    label: '回撤',
    keyboard: 'ctrl+shift+z'
  },
  {
    divided: true,
    command: 'handleCopy',
    label: '复制',
    keyboard: 'ctrl+c'
  },
  {
    command: 'handleCut',
    label: '剪切',
    keyboard: 'ctrl+x'
  },
  {
    command: 'handlePaste',
    label: '粘贴',
    keyboard: 'ctrl+v'
  },
  {
    command: 'handleDelete',
    label: '删除',
    keyboard: 'delete'
  },
  {
    divided: true,
    command: 'handleDeleteAllConns',
    label: '删除全部conns',
  },
  {
    command: 'handleDeleteAllInConns',
    label: '删除全部in-conns',
  },
  {
    command: 'handleDeleteAllOutConns',
    label: '删除全部out-conns',
  }
];

const viewMenuOption = [
  {
    command: 'onAutoOrganize',
    label: '自动组织',
    keyboard: 'a'
  },
  {
    command: 'handleZoomIn',
    label: '放大',
    keyboard: 'ctrl+up'
  },
  {
    command: 'handleZoomOut',
    label: '缩小',
    keyboard: 'ctrl+down'
  }
]


const selectMenuOption = [
  {
    command: 'handleSelectAll',
    label: '选中全部',
    keyboard: 'ctrl+a'
  },
  {
    command: 'handleSelectInverse',
    label: '取消全部',
    keyboard: 'ctrl+i'
  },
  {
    command: 'handleSelectNone',
    label: '反选',
    keyboard: 'esc'
  }
]
const handleEditCommand = (command: keyof Omit<typeof projectHandle, 'handleImportFile'>) => {
  projectHandle[command]?.();
};

const viewCommandMap = useViewHook(editor)


viewCommandMap.bindViewMousetrap()

onBeforeUnmount(() => {
  viewCommandMap.unbindViewMousetrap();
})
const handleViewCommand = (command: keyof typeof viewCommandMap) => {
  viewCommandMap[command]?.()
}


onBeforeUnmount(() => {
  projectHandle.unbindKeyboardEvent();
});

const selectHook = useSelectHook(editor)

const handleSelectCommand = (command: keyof typeof selectHook) => {
  selectHook[command]?.()
}

</script>

<style scoped lang="less">
.behavior-header {
  & > span {
    margin-right: 10px;
  }
}
</style>
