import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class QrService {
  private url  = "/api/qr"
  image = ""

  constructor(private http : HttpClient) { }

  generateQR(data : string, size : number) : Observable<any> {
    console.log("FIRE")
    let tmp = this.url;

    if (size !== 0 && size != null) {
      tmp = this.url + "/" + size;
    }

    return this.http.post(tmp, data , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: "blob"
    })
  }
}
