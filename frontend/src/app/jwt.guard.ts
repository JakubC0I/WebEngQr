import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {firstValueFrom} from "rxjs";




export const jwtGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).canActivate();
}
