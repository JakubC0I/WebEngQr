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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Input() action!: string;
  http: HttpClient
  router: Router

  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
  }

  userForm = new FormGroup({
    login: new FormControl(),
    password: new FormControl()
  })
  submitForm() {
    this.http.post<Success>(`/user/login`, this.userForm.value, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe((result: Success) => {
      console.log(result.message)
      if (result.ok) {
        this.router.navigate(['/ticket'])
      }
    });
  }
}
