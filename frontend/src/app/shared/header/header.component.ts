import {Component, Input, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  loggedIn = false
  private loginSub: Subscription;

  constructor( private authService : AuthService) {
    this.loginSub = new Subscription();
  }

  ngOnInit() {
    this.loginSub = this.authService.loginSuccess.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  logout() {
    this.authService.logout().subscribe(result => {
      if (result.ok) {
        this.loggedIn = false;
      }
    });
  }


  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.loginSub.unsubscribe();
  }
}
