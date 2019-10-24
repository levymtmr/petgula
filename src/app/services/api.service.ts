import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpParams, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = `${environment.API}`;

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  constructor(private http: HttpClient) {}

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(this.baseUrl + `${path}`, { params, headers: new HttpHeaders({'Authorization':`Bearer ${localStorage.getItem('token')}`})})
      .pipe(catchError(this.formatErrors));
  }

  // {'Authorization':`Bearer ${localStorage.getItem('token')}`}

  post(path: string, body = {}): Observable<any> {
    return this.http
      .post(this.baseUrl + `${path}`, body, {headers:new HttpHeaders({'Authorization':`Bearer ${localStorage.getItem('token')}`})})
      .pipe(catchError(this.formatErrors));
  }

  patch(path: string, body ={}): Observable<any> {
    return this.http.patch(this.baseUrl + `${path}`, body,{headers:new HttpHeaders({'Authorization':`Bearer ${localStorage.getItem('token')}`})}).pipe(catchError(this.formatErrors));
  }


  delete(path): Observable<any> {
    return this.http.delete(this.baseUrl +  `${path}`,{headers:new HttpHeaders({'Authorization':`Bearer ${localStorage.getItem('token')}`})}).pipe(catchError(this.formatErrors));
  }
}
