import {Component, ElementRef, Input, ViewChild, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-draggable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './draggable.component.html',
  styleUrl: './draggable.component.css'
})
export class DraggableComponent {
  @ViewChild("draggable") dragDiv!: ElementRef;
  @ViewChild("inp") input!: ElementRef;
  @ViewChild("myCanvas") imageCanvas!: ElementRef;
  @ViewChild("qrImage") qrImage!: ElementRef;


  @Input() imageData!: Object
  @Input() canvas!: HTMLCanvasElement
  @Output() dropQr = new EventEmitter()
  @Output() div= this.dragDiv;


  addImage(e: Event) {
    let file = this.input.nativeElement.files[0];
    const canvas = this.imageCanvas.nativeElement
    const ctx = canvas.getContext("2d");

    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
    canvas.height = img.height
    canvas.width = img.width
    console.log(`screenx: ${screenX} screeny: ${screenY}`)
    ctx.drawImage(img,0,0)
    }
    console.log(file)
  }


  addQrCode() {
    const qr = this.qrImage.nativeElement

    qr.src = this.imageData;
  }


  // emit to parent information that closeDragElement happened
  // Create button to add element to canvas where the qr code is displayed and return a img to the user

  touchDragElement(e: TouchEvent) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var element = this.dragDiv.nativeElement
    var canvas = this.canvas;

    dragTouchDown(e)

    function dragTouchDown(e: TouchEvent) {
      e.preventDefault();

      pos3 = e.targetTouches[0].clientX;
      pos4 = e.targetTouches[0].clientY;

      document.ontouchend = closeDragElement;
      document.ontouchmove = elementTouchDrag;
    }

    function elementTouchDrag(e: TouchEvent) {
      console.log("MOVE")

      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.targetTouches[0].clientX
      pos2 = pos4 - e.targetTouches[0].clientY;
      pos3 = e.targetTouches[0].clientX;
      pos4 = e.targetTouches[0].clientY;
      // set the element's new position:
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
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
    var canvas = this.canvas;

    dragMouseDown(e)



    function dragMouseDown(e: MouseEvent) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementMouseDrag;
    }

    function elementMouseDrag(e: MouseEvent) {
      console.log("MOVE")

      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }


    function closeDragElement() {
      console.log("CLOSE")

      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

}
