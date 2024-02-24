<template>
  <div class="behavior-header">
    <span>Behavior3 Editor</span>
    <n-space align="center">
      <n-icon @click="projectHandle.handleSaveProject" size="22px">
        <SaveOutline/>
      </n-icon>
      <n-icon size="22px" @click="projectHandle.handleUndo">
        <ArrowUndoOutline/>
      </n-icon>
      <n-icon size="22px" @click="projectHandle.handleRedo">
        <ArrowRedoOutline/>
      </n-icon>
      <n-config-provider :theme="darkTheme">
       <n-dropdown :options="projectOptions">项目</n-dropdown>
      </n-config-provider>
      <el-dropdown @command="handleEditCommand" placement="bottom-start">
        <span>编辑</span>
        <template #dropdown>
          <el-dropdown-menu class="behavior-header__tool">
            <el-dropdown-item v-for="item in editMenuOption" :key="item.command" :command="item.command"
                              :divided="item.divided">
              <div class="menu-label">
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
          <el-dropdown-menu class="behavior-header__tool">
            <el-dropdown-item v-for="item in viewMenuOption" :key="item.command" :command="item.command">
              <div class="menu-label">
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
          <el-dropdown-menu class="behavior-header__tool">
            <el-dropdown-item v-for="item in selectMenuOption" :key="item.command" :command="item.command">
              <div class="menu-label">
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
import {DropdownDividerOption, DropdownOption, darkTheme} from "naive-ui";

defineOptions({
  name: 'BehaviorHeader'
});

const {editor} = useEditorHook();

const projectHandle = useCreateProject(editor);

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
    label: '删除全部连线',
  },
  {
    command: 'handleDeleteAllInConns',
    label: '删除全部输入连线',
  },
  {
    command: 'handleDeleteAllOutConns',
    label: '删除全部输出联系',
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

const selectMenuOption = [
  {
    command: 'onSelectAll',
    label: '选中全部',
    keyboard: 'ctrl+a'
  },
  {
    command: 'onDeselectAll',
    label: '取消全部',
    keyboard: 'ctrl+i'
  },
  {
    command: 'onInvertSelection',
    label: '反选',
    keyboard: 'esc'
  }
]
const selectHook = useSelectHook(editor)

const handleSelectCommand = (command: keyof typeof selectHook) => {
  selectHook[command]?.()
}

const {setExportDialogShow} = inject('exportProvide') as any
const projectOptions: Array<DropdownOption | DropdownDividerOption> = [
  {
    key: 'allProject',
    label: '所有项目'
  },
  {
    key: 'closeProject',
    label: '关闭项目'
  },
  {
    key: 'saveProject',
    label: '保存项目',
    props: {
      onClick(){
        setExportDialogShow('project')
      }
    }
  },
  {
    key: 'exportDivider',
    type: 'divider'
  },
  {
    key: 'export',
    label: '导出',
    children: [
      {
        key: 'exportProjectJson',
        label: 'Project as Json',
        props: {
          onClick() {
            setExportDialogShow('project')
          }
        }
      },
      {
        key: 'exportTreeJson',
        label: 'Tree as Json',
        props: {
          onClick() {
            setExportDialogShow('tree')
          }
        }
      },
      {
        key: 'exportNodeJson',
        label: 'Node as Json',
        props: {
          onClick() {
            setExportDialogShow('node')
          }
        }
      }
    ]
  },
  {
    key: 'import',
    label: '导入',
    children: [
      {
        key: 'importProjectJson',
        label: 'Project as Json',
        props: {
          onClick() {
            setExportDialogShow('project')
          }
        }
      },
      {
        key: 'importTreeJson',
        label: 'Tree as Json',
        props: {
          onClick() {
            setExportDialogShow('tree')
          }
        }
      },
      {
        key: 'importNodeJson',
        label: 'Node as Json',
        props: {
          onClick() {
            setExportDialogShow('node')
          }
        }
      }
    ]
  },
  {
    key: 'importDivider',
    type: 'divider'
  },
  {
    key: 'newTree',
    label: 'new Tree',
  },
  {
    key: 'nodeNode',
    label: 'new Node',
  },
]
</script>

<style scoped lang="less">
.behavior-header {
  & > span {
    margin-right: 10px;
  }

}
</style>
<style lang="less">
.behavior-header__tool {
  .menu-label {
    width: 140px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
