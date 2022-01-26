import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  activeUser: any;
  form = new FormGroup({
    name: new FormControl('Luis',[Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('Delgado Rodriguez',[Validators.required, Validators.minLength(3)]),
    username: new FormControl('Luis',[Validators.required, Validators.minLength(6)]),
    password: new FormControl('password',[Validators.required, Validators.minLength(6)]),
    email: new FormControl('ldelgado@unitru.edu.pe',[Validators.required, Validators.email]),
  });
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.authService.loginState().subscribe(state => {
      if(state !== true) {
        this.router.navigateByUrl('/login', {replaceUrl: true});
      }
    });
  }
  ngOnInit(): void {

  }
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }
}
