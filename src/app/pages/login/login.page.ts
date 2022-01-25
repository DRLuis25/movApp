import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      identifier: ['ldelgado@unitru.edu.pe',[Validators.required,Validators.email]],
      password: ['password',[Validators.required,Validators.minLength(6)]]
    });
  }
  async login(){
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.login(this.credentials.value).subscribe(
     async (res) => {
       await loading.dismiss();
       this.router.navigateByUrl('/tabs',{replaceUrl: true});
     },
     async (res)=>{
       await loading.dismiss();
       const alert = await this.alertController.create({
         header: 'Error al iniciar sesión',
         message: 'Usuario o contraseña incorrecta',//res.error.error,
         buttons: ['OK'],
       });
       await alert.present();
     }
    );
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get email() {
    return this.credentials.get('identifier');
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get password() {
    return this.credentials.get('password');
  }

}
