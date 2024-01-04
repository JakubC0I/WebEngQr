import {Component, ElementRef, EventEmitter, Input, Output, SecurityContext, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {QRCodeModule} from "angularx-qrcode";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {DataLoaderComponent} from "../data-loader/data-loader.component";

@Component({
  selector: 'app-draggable',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeModule, NgOptimizedImage, DataLoaderComponent],
  templateUrl: './draggable.component.html',
  styleUrl: './draggable.component.css'
})
export class DraggableComponent {
  private ctx!:CanvasRenderingContext2D

  @ViewChild("draggable") dragDiv!: ElementRef;
  @ViewChild("inp") input!: ElementRef;
  @ViewChild("myCanvas") imageCanvas!: ElementRef;
  @ViewChild("qrImage") qrImage!: ElementRef;

  @Input() imageData = ""
  @Input() image = ""
  @Input() qrSize !: string
  @Output() dropQr = new EventEmitter()
  @Output() div= this.dragDiv;
  multi = false
  multiMergeData : {}[] = []

  imageSource = ""

  qrData = "";

  constructor(private sanitizer : DomSanitizer) {
  }

  addImage(e: Event) {
    let file = this.input.nativeElement.files[0];
    const canvas = this.imageCanvas.nativeElement
    this.ctx = canvas.getContext("2d");

    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
    canvas.height = img.height
    canvas.width = img.width
    console.log(`screenx: ${screenX} screeny: ${screenY}`)
    this.ctx.drawImage(img,0,0)
    }
    console.log(file)
  }


  addQrCode() {
    if (this.imageData != '') {
      this.qrData = this.imageData
    } else {
      this.imageSource = this.image;
    }
    console.log(this.qrSize)
  }

  onChangeURL(url : SafeUrl) {
    console.log(`URL: ${url}`)
    this.imageSource = url as string;
  }

  async merge(data ?: string) {
    const div = this.dragDiv.nativeElement
    const canvas = this.imageCanvas.nativeElement
    // console.log(`OFFSETS: TOP: ${div.offsetTop} ; LEFT: ${div.offsetLeft}`)
    if (data) {
      this.qrData = data
    }
    console.log(this.qrImage.nativeElement.src)

    this.ctx.drawImage(this.qrImage.nativeElement, div.offsetLeft, div.offsetTop)
  }

  downloadImage(canvas : HTMLCanvasElement) {
    let canvasUrl = canvas.toDataURL("image/png")
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = "image_with_qrCode";
    createEl.click();
    createEl.remove();
  }

  toDataUrl(data : string, filereader : FileReader) {

  }

  multiMerge() {
    this.multi = true
    this.multiMergeData.forEach(element => {
      this.merge(JSON.stringify(element)).then()
    })
  }

  generateQrLocal(csv: string[][]) {
    for (let height = 0; height < csv.length; height++) {
      let tmp: { [key: string]: string } = {};

      if (height == 0) {
        continue;
      }
      for (let width = 0; width < csv[height].length; width++) {
        tmp[csv[0][width]] = csv[height][width];
      }
      this.multiMergeData.push(tmp)
    }
    this.imageData = JSON.stringify(this.multiMergeData[0]);
  }


  // emit to parent information that closeDragElement happened
  // Create button to add element to canvas where the qr code is displayed and return a img to the user

  touchDragElement(e: TouchEvent) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var element = this.dragDiv.nativeElement
    const canvas = this.imageCanvas.nativeElement
    dragTouchDown(e, canvas.height, canvas.width,this.qrImage.nativeElement)

    function dragTouchDown(e: TouchEvent, canvasHeight:number, canvasWidth:number, qr:HTMLImageElement) {
      e.preventDefault();

      pos3 = e.targetTouches[0].clientX;
      pos4 = e.targetTouches[0].clientY;

      document.ontouchend = closeDragElement;
      document.ontouchmove = (event) => {
        elementTouchDrag(event, canvasHeight, canvasWidth, qr)
      };
    }

    function elementTouchDrag(e: TouchEvent, canvasHeight:number, canvasWidth:number, qr:HTMLImageElement) {
      console.log("MOVE")

      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.targetTouches[0].clientX
      pos2 = pos4 - e.targetTouches[0].clientY;
      pos3 = e.targetTouches[0].clientX;
      pos4 = e.targetTouches[0].clientY;
      // set the element's new position:
      if (element.offsetTop - pos2 >= canvasHeight- qr.height) {
        element.style.top = canvasHeight - qr.height
      } else if(element.offsetTop - pos2 <= 0) {
        element.style.top = 0
      } else {
        element.style.top = (element.offsetTop - pos2) + "px";
      }
      if (element.offsetLeft - pos1 >= canvasWidth- qr.width) {
        element.style.left = canvasWidth - qr.width
      } else if(element.offsetLeft - pos1 <= 0){
        element.style.left = 0;
      } else {
        element.style.left = (element.offsetLeft - pos1) + "px";
      }
    }

    function closeDragElement() {
      console.log("CLOSE")

      // stop moving when mouse button is released:
      document.ontouchend = null;
      document.ontouchmove = null;
    }

  }

  dragElement(e: MouseEvent) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var element = this.dragDiv.nativeElement
    const canvas = this.imageCanvas.nativeElement
    dragMouseDown(e, canvas.height, canvas.width,this.qrImage.nativeElement)



    function dragMouseDown(e: MouseEvent, canvasHeight:number, canvasWidth:number, qr:HTMLImageElement) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = (event) => {
        elementMouseDrag(event, canvasHeight, canvasWidth, qr)
      };
    }

    function elementMouseDrag(e: MouseEvent, canvasHeight:number, canvasWidth:number, qr:HTMLImageElement) {

      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      if (element.offsetTop - pos2 >= canvasHeight - qr.height) {
        element.style.top = canvasHeight - qr.height
      } else if(element.offsetTop - pos2 <= 0) {
        element.style.top = 0
      } else {
        element.style.top = (element.offsetTop - pos2) + "px";
      }
      if (element.offsetLeft - pos1 >= canvasWidth - qr.width) {
        element.style.left = canvasWidth - qr.width
      } else if(element.offsetLeft - pos1 <= 0){
        element.style.left = 0;
      } else {
        element.style.left = (element.offsetLeft - pos1) + "px";
      }
    }


    function closeDragElement() {
      console.log("CLOSE")

      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  protected readonly parseInt = parseInt;
}
