import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthAngularFireService {
  authState = null;
  constructor(
    private authService: AngularFireAuth,
  ) {
    console.log('Conectando a firebase');
    authService.authState.subscribe(state => this.authState = state);
  }
  login(user: User) {
    return this.authService
        .signInWithEmailAndPassword(user.email, user.password)
        .then(usr => {
            this.authState = usr;
    });
  }
  registro(user: User) {
    return this.authService
        .createUserWithEmailAndPassword(
            user.email,
            user.password
        )
        .then(usr => {
            this.authState = usr;
            return usr;
        });
  }
  getUserID(){
    return '61eeee42f209f33520b36ca4';
  }
}
