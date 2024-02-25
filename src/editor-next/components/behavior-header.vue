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
        <n-space>
          <n-dropdown :options="projectOptions">项目</n-dropdown>
          <n-dropdown :options="editOptions">编辑</n-dropdown>
          <n-dropdown :options="viewOptions">视图</n-dropdown>
          <n-dropdown :options="selectOptions">选择</n-dropdown>
        </n-space>
      </n-config-provider>
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
import {useBehaviorInject} from "../use-behavior-inject.ts";

defineOptions({
  name: 'BehaviorHeader'
});

const {editor} = useEditorHook();

const projectHandle = useCreateProject(editor);

projectHandle.bindKeyboardEvent();


const viewCommandMap = useViewHook(editor)
const selectHook = useSelectHook(editor)
selectHook.bindSelectMousetrap()

viewCommandMap.bindViewMousetrap()

onBeforeUnmount(() => {
  viewCommandMap.unbindViewMousetrap();
  projectHandle.unbindKeyboardEvent();
  selectHook.unbindSelectMousetrap()
})


const {setExportDialogShow, setImportDialogShow, setProjectDialogShow} = useBehaviorInject()
type DropdownOptions = Array<DropdownOption | DropdownDividerOption>
const projectOptions: DropdownOptions = [
  {
    key: 'allProject',
    label: '所有项目',
    props: {
      onClick() {
        setProjectDialogShow()
      }
    }
  },
  {
    key: 'closeProject',
    label: '关闭项目'
  },
  {
    key: 'saveProject',
    label: '保存项目',
    props: {
      onClick() {
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
            setImportDialogShow('project')
          }
        }
      },
      {
        key: 'importTreeJson',
        label: 'Tree as Json',
        props: {
          onClick() {
            setImportDialogShow('tree')
          }
        }
      },
      {
        key: 'importNodeJson',
        label: 'Node as Json',
        props: {
          onClick() {
            setImportDialogShow('node')
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
const editOptions: DropdownOptions = [
  {
    key: 'handleUndo',
    label: '撤销 ctrl+z',
    props: {
      onClick() {
        projectHandle.handleUndo()
      }
    }
  },
  {
    key: 'handleRedo',
    label: '回撤 ctrl+shift+z',
    props: {
      onClick() {
        projectHandle.handleRedo()
      }
    }
  },
  {
    key: 'divider-1',
    type: 'divider'
  },
  {
    key: 'handleCopy',
    label: '复制 ctrl+c',
    props: {
      onClick() {
        projectHandle.handleCopy()
      }
    }
  },
  {
    key: 'handleCut',
    label: '剪切 ctrl+x',
    props: {
      onClick() {
        projectHandle.handleCut()
      }
    }
  },
  {
    key: 'handlePaste',
    label: '粘贴 ctrl+v',
    props: {
      onClick() {
        projectHandle.handlePaste()
      }
    }
  },
  {
    key: 'handleDelete',
    label: '删除 delete',
    props: {
      onClick() {
        projectHandle.handleDelete()
      }
    }
  },
  {
    type: 'divider'
  },
  {
    key: 'handleDeleteAllConns',
    label: '删除全部连线',
    props: {
      onClick() {
        projectHandle.handleDeleteAllConns()
      }
    }
  },
  {
    key: 'handleDeleteAllInConns',
    label: '删除全部输入连线',
    props: {
      onClick() {
        projectHandle.handleDeleteAllInConns()
      }
    }
  },
  {
    key: 'handleDeleteAllOutConns',
    label: '删除全部输出连线',
    props: {
      onClick() {
        projectHandle.handleDeleteAllOutConns()
      }
    }
  }
]
const viewOptions: DropdownOptions = [
  {
    key: 'onAutoOrganize',
    label: '自动组织 a',
    props: {
      onClick() {
        viewCommandMap.onAutoOrganize()
      }
    }
  },
  {
    key: 'handleZoomIn',
    label: '放大 ctrl+up',
    props: {
      onClick() {
        viewCommandMap.handleZoomIn()
      }
    }
  },
  {
    key: 'handleZoomOut',
    label: '缩小 ctrl+down',
    props: {
      onClick() {
        viewCommandMap.handleZoomOut()
      }
    }
  }
]

const selectOptions: DropdownOptions = [
  {
    key: 'onSelectAll',
    label: '选中全部 ctrl+a',
    props: {
      onClick() {
        selectHook.onSelectAll()
      }
    }
  },
  {
    key: 'onDeselectAll',
    label: '取消全部 ctrl+i',
    props: {
      onClick() {
        selectHook.onDeselectAll()
      }
    }
  },
  {
    key: 'onInvertSelection',
    label: '反选 esc',
    props: {
      onClick() {

        selectHook.onInvertSelection()
      }
    }
  }
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
