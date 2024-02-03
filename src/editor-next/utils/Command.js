
export class Command {
    constructor(undo, redo) {
        if (undo.length !== 3) throw 'Invalid undo command, must have [target, method, args]';
        if (redo.length !== 3) throw 'Invalid redo command, must have [target, method, args]';
        this.context = null;
        this._undo = undo
        this._redo = redo
    }
    execute(target, method, args) {
        method.apply(target, args);
    }
    redo () {
        const redo = this._redo
        this.execute(redo[0], redo[1], redo[2]);
    }
    undo () {
        const undo = this._undo
        this.execute(undo[0], undo[1], undo[2]);
    }
}
export class Commands {
    constructor(commands) {
        this.context = null;
        this.commands = commands
    }
    redo() {
        for (let i=0; i<this.commands.length; i++) {
            this.commands[i].redo();
        }
    }
    undo () {
        for (let i= this.commands.length-1; i>=0; i--) {
            this.commands[i].undo();
        }
    }
}