import {DrawBoard, EditorConfig} from "./DrawBoard.ts";

export class Editor {
    board: DrawBoard;

    constructor(public config: EditorConfig) {
        this.board = new DrawBoard(config)
    }

    zoomIn() {
        this.board.ctx.scale(2, 1)
    }

    zoomOut() {}

}