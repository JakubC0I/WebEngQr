import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class LoginComponent {
  @Input() action!: string;
  http: HttpClient

  constructor(http: HttpClient) {
    this.http = http;
  }

  userForm = new FormGroup({
    login: new FormControl(),
    password: new FormControl()
  })
  submitForm() {
    this.http.post(`/user/${this.action}`, this.userForm.value, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe(result => {
      console.log(result)
    })
  }
}
