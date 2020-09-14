import {Component, ElementRef, ViewChild} from '@angular/core';
import {HttpService} from './http.service';

export interface SignatureData {
  signatureImageData: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  canvas: HTMLCanvasElement;
  @ViewChild('canvasElement') canvasElement: ElementRef;

  constructor(private httpService: HttpService) {
  }

  confirmSignature(): void {
    if (!this.isCanvasBlank()) {
      const signatureData: SignatureData = {
        signatureImageData: this.getBase64(this.canvasElement.nativeElement.toDataURL())
      };
      this.httpService.postSignature(signatureData)
        .subscribe(
          response => {
            console.log(response);
          }, error => {
            console.log(error);
          });
    }
  }

  clearCanvas(): void {
    this.canvas = this.canvasElement.nativeElement;
    this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  isCanvasBlank(): boolean {
    this.canvas = this.canvasElement.nativeElement;
    const canvasContext = this.canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(
      canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height).data.buffer
    );

    return !pixelBuffer.some(color => !!color);
  }

  getBase64(imageDataURL): string {
    return imageDataURL.replace(/^data:image\/png;base64,/, '');
  }
}
