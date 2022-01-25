import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import {map, tap, switchMap,filter, take} from 'rxjs/operators';
import { User } from '../models/user.model';

const TOKEN_KEY = 'my-token';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated:  BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken(){
    const token = await Storage.get({key: TOKEN_KEY});
    if (token && token.value) {
      console.log('token: ',token.value);
      this.token = token.value; //save token?
      this.isAuthenticated.next(true);
    }else{
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: {identifier; password}): Observable<any>{
    return this.http.post(`https://api-movil-tais.herokuapp.com/auth/local`,credentials).pipe(
      map((data: any) => data.jwt),
      switchMap(token => from(Storage.set({key: TOKEN_KEY, value: token}))),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    );
  }
  loginState(){
    return this.isAuthenticated.asObservable();
  }
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    console.log('adios');
    return Storage.remove({key: TOKEN_KEY});
  }
  // RegisterPage
  register(user: User){
    return this.http.post(`https://api-movil-tais.herokuapp.com/auth/local/register`, user);
  }

  prueba(data){
    const token = Storage.get({key: TOKEN_KEY});
    const headers = new HttpHeaders(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      {Authorization: 'Bearer ' + token}
    );
    this.http.post('https://api-movil-tais.herokuapp.com/auth/local/register',data,{headers}).subscribe(res => {
      console.log(res);
    });
  }
}
