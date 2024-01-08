import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { Success } from '../../shared/model/success.model';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Input() action!: string;
  @Output() loginSuccess = new EventEmitter<boolean>()
  http: HttpClient
  router: Router

  constructor(http: HttpClient, router: Router, private authService: AuthService) {
    this.http = http;
    this.router = router;
  }

  userForm = new FormGroup({
    login: new FormControl(),
    password: new FormControl()
  })
  submitForm() {
    if (this.authService.login(this.userForm.value.login, this.userForm.value.password)) {
      this.router.navigate(['/ticket']);
    }
  }
}
