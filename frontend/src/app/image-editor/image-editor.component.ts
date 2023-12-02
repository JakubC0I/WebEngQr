import {Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DraggableComponent} from "../draggable/draggable.component";
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [CommonModule, DraggableComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.css'
})
export class ImageEditorComponent {
  private url  = "/api/qr"
  image:string = "";
  qrSize = new FormControl()

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
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: "blob"
  }

  generateQr() {
    console.log("FIRE")
    let filereader = new FileReader()
    let tmp = this.url;

    if (this.qrSize.value !== "" && this.qrSize.value != null) {
      tmp = this.url + "/" + this.qrSize.value;
    }

    this.http.post(tmp, this.fg.value , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: "blob"
    }).subscribe(result => {
      filereader.readAsDataURL(result)
    })
    filereader.onloadend  = () => {
      console.log(filereader.result)
      this.image = ""+filereader.result
    }
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
