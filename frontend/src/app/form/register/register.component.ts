import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { Success } from "../../shared/model/success.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Input() action!: string;
  http: HttpClient
  router: Router

  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
  }

  userForm = new FormGroup({
    email: new FormControl(),
    login: new FormControl(), 
    password: new FormControl(),
    password2: new FormControl()

  })
  submitForm() {
    this.http.post<Success>(`/user/register`, this.userForm.value, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe((result: Success) => {
      console.log(result.message)
      if (result.ok) {
        this.router.navigate(['/login'])
      }
    });
  }
}
