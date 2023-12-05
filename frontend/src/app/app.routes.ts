import { Routes } from '@angular/router';
import { LoginComponent } from "./form/form.component";
import {ImageEditorComponent} from "./image-editor/image-editor.component";
export const routes: Routes = [
  {path: "login", component: LoginComponent, data: {"action": "login"}},
  {path: "register", component: LoginComponent, data: {"action": "register"}},
  {path: "", component: ImageEditorComponent}
];
