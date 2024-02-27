import * as localforage from "localforage";

export const projectStore = localforage.createInstance({
    name: 'behaviorProject'
})
