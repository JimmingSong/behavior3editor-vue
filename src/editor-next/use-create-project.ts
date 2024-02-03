import {Ref} from "vue";

export const defaultProjectConfig = {
    "version": "0.3.0",
    "scope": "project",
    "selectedTree": "410970e0-3121-4cf8-b1c0-26de8dea7291",
    "trees": [
        {
            "version": "0.3.0",
            "scope": "tree",
            "id": "410970e0-3121-4cf8-b1c0-26de8dea7291",
            "title": "bbb333",
            "description": "",
            "root": null,
            "properties": {},
            "nodes": {},
            "display": {
                "camera_x": 960,
                "camera_y": 278,
                "camera_z": 1,
                "x": 0,
                "y": 0
            }
        }
    ],
    "custom_nodes": []
};
export function useCreateProject(editor: Ref<any>) {
    const createProject = (initialData?: any) => {
        editor.value.project.open(initialData ?? defaultProjectConfig);
    }
    return {
        createProject
    }
}