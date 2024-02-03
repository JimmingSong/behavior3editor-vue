export class SettingsManager {
    constructor() {
        this._dict = {}
    }

    clear() {
        this._dict = {}
    }

    set(key, value) {
        this._dict[key] = value
    }
    get(key) {
        return this._dict[key]
    }

    load(data) {
        for (const dataKey in data) {
            this.set(dataKey, data[dataKey])// 这里需要判断类型，如果是对象，需要递归调用load方法
        }
    }
}