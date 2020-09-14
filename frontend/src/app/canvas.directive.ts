import {Directive, ElementRef, HostListener} from '@angular/core';

declare interface Position {
  offsetX: number;
  offsetY: number;
}

@Directive({
  selector: '[appCanvas]'
})
export class CanvasDirective {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  userStrokeStyle = '#030303';
  position: {
    start: {};
    stop: {};
  };
  line = [];
  prevPos: Position = {
    offsetX: 0,
    offsetY: 0,
  };
  isPainting = false;

  constructor(private el: ElementRef) {
    this.canvas = this.el.nativeElement;
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.canvas.className = 'paint-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 2;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown({offsetX, offsetY}): void {
    this.isPainting = true;
    this.prevPos = {
      offsetX,
      offsetY,
    };
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove({offsetX, offsetY}): void {
    if (this.isPainting) {
      const offsetData = {offsetX, offsetY};
      this.position = {
        start: {...this.prevPos},
        stop: {...offsetData},
      };
      this.line = this.line.concat(this.position);
      this.draw(this.prevPos, offsetData, this.userStrokeStyle);
    }
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    if (this.isPainting) {
      this.isPainting = false;
    }
  }

  @HostListener('mouseleave')
  onmouseleave(): void {
    if (this.isPainting) {
      this.isPainting = false;
    }
  }

  draw(
    {offsetX: x, offsetY: y}: Position,
    {offsetX, offsetY}: Position,
    strokeStyle
  ): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = {
      offsetX,
      offsetY,
    };
  }
}
