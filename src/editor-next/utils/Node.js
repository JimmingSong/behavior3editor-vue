export class Node {
    constructor(isDefault) {
        this.spec = null;
        this.name = null;
        this.title = null;
        this.category = null;
        this.description = null;
        this.properties = {};
        this.DMNRefs = [];
        this.isDefault = !!isDefault;
    }

    /**
     * Copy this node.
     *
     * @method copy
     * @returns {b3e.Node} A copy of this node
     */
    copy = function () {
        var n = new Node(this.isDefault);
        n.spec = this.spec;
        n.name = this.name;
        n.title = this.title;
        n.category = this.category;
        n.description = this.description;
        n.properties = this.properties;
        n.DMNRefs = this.DMNRefs;
        return n;
    };
}