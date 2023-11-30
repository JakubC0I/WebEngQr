import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

import {LoginComponent} from "./form/form.component";
import {ImageEditorComponent} from "./image-editor/image-editor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterOutlet, LoginComponent, ImageEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
