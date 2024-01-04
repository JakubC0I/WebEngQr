import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DraggableComponent} from "../draggable/draggable.component";
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { DataLoaderComponent } from '../data-loader/data-loader.component';

import {QRCodeComponent, QRCodeModule} from 'angularx-qrcode';
import { QrService } from '../services/qr.service';
import {SafeUrl} from "@angular/platform-browser";
@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [CommonModule, DraggableComponent, ReactiveFormsModule, FormsModule, DataLoaderComponent],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.css'
})
export class ImageEditorComponent {
  image:string = "";
  imageData:string = "";
  qrSize = new FormControl()
  qrService;

  fb: FormBuilder
  fg: FormGroup
  http: HttpClient

  constructor(http: HttpClient) {
    this.http = http;
    this.fb = new FormBuilder()
    this.fg = this.fb.group({
      firstname: '',
      lastname: '',
      eventName: '',
      encrypt: true,
      additionalFields: this.fb.array([])
    })

    this.qrService = new QrService(this.http)
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: "blob"
  }


  generateQr() {
    let filereader = new FileReader()
    this.qrService.generateQR(this.fg.getRawValue(), this.qrSize.value).subscribe(result => {
      filereader.readAsDataURL(result)
    })
    filereader.onloadend  = () => {
      console.log(filereader.result)
      this.image = ""+filereader.result
    };
  }




  getFields():FormArray {
    // console.log(this.fg.getRawValue())
    return this.fg.get("additionalFields") as FormArray
  }

  newField() {
    return this.fb.group({
      key: '',
      value: ''
    })
  }

  addField()  {
    this.getFields().push(this.newField())
  }

  removeField(i:number)  {
    this.getFields().removeAt(i)
  }


  @ViewChild("qrCode") qr!:HTMLDivElement;

}
