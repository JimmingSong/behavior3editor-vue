type CanvasParams<T extends (...args: any[]) => any> = Parameters<T>
export class Graph{
    constructor(private ctx: CanvasRenderingContext2D) {
    }
    fillColor() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 450)
        gradient.addColorStop(0, '#000000')
        gradient.addColorStop(1, '#FF0000')
        this.ctx.fillStyle = gradient
        return this
    }
    fill() {
        this.ctx.fill();
        return this;
    }
    fillRect(...args: CanvasParams<CanvasRect['fillRect']>) {
        this.ctx.fillRect(...args)
        return this;
    }
    zoom(...args: Parameters<CanvasTransform['scale']>) {
        this.ctx.scale(...args)
        return this;
    }
    stroke(...args: CanvasParams<CanvasDrawPath['stroke']>) {
        this.ctx.stroke(...args);
        return this;
    }
    strokeRect() {
        this.ctx.strokeRect(0, 0, 500, 500)
        return this;
    }
    clearRect() {
        this.ctx.clearRect(0, 0, 500, 500)
        return this;
    }
    rect(...args: Parameters<CanvasPath['rect']>) {
        this.ctx.rect(...args)
    }
}