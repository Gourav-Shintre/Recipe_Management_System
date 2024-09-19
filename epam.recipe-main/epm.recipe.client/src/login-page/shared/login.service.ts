import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from './login';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { 
  }

  url: string = environment.apiBaseUrl + 'api/authservice/login';
  

  loginUser(loginObj: Login): Observable<any> {
    return this.http.post<string>(this.url, loginObj).pipe(
        map(res => {
            return res;
        }),
        catchError(err => {
            return throwError(err);
        })
    );
}
}
