/**
 * @class Folder
 * @constructor
 */
export class Folder {
    /**
     *
     * @param {Boolean} [isDefault]
     */
    constructor(isDefault) {
        this.spec = null;
        this.name = b3.createUUID();
        this.title = null;
        this.category = null;
        this.description = null;
        this.parent = null;
        this.isDefault = !!isDefault;
    }

    copy() {
        const n = new Folder(this.isDefault);
        n.spec = this.spec;
        n.name = this.name;
        n.title = this.title;
        n.category = this.category;
        n.parent = this.parent;

        return n;
    };
}