export interface EditorConfig{
    container: string | HTMLDivElement
}
export class DrawBoard {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(private config: EditorConfig) {
        this.canvas = this.getCanvas()
        this.ctx =  this.canvas.getContext('2d') as CanvasRenderingContext2D
    }

    getCanvas() {
        let container = this.config.container
        if (typeof container === 'string') {
            container = document.getElementById(container) as HTMLDivElement
        }
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);
        // 设置canvas的属性，用于后续操作
        canvas.setAttribute('tabindex', '0') // 使canvas元素可以聚焦
        return canvas
    }
    createRectGraphic() {
        this.ctx.rect(10, 10, 100, 100)
    }
}