import {Component, ElementRef, Output, ViewChild, EventEmitter, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-data-loader',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './data-loader.component.html',
  styleUrl: './data-loader.component.css'
})
export class DataLoaderComponent {

  @ViewChild("data") inputData !: ElementRef

  @Output() parseCsv = new EventEmitter<string[][]>();
  loaderGroup = new FormGroup(
    {file : new FormControl()}
  )
  constructor() {

  }

  sendFile() {
    let data : HTMLInputElement = this.inputData.nativeElement
    if (data.files != null) {
      let reader = new FileReader()
      let file = data.files[0]
      if (file.type == 'text/csv') {
        reader.readAsText(file)
        reader.onloadend = () => {

          let result= reader.result as String
          let rows = result.replaceAll("\r", "").split('\n')
          let nameFields : string[] = []
          let separator : string = "\t"
          if (rows.length > 1) {
            if (rows[0].includes(';')) {
              separator = ";"
            }
            if (rows[0].includes(',')) {
              separator = ","
            }
            nameFields = rows[0].split(separator)
          }
          let complete : string[][] = []
          rows.forEach((entry) => {
            complete.push(entry.split(separator))
          })
          this.parseCsv.emit(complete)
        }
      }
    }
  }
}
