import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage{
  form = new FormGroup({
    name: new FormControl('',[Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('',[Validators.required, Validators.minLength(3)]),
    username: new FormControl('',[Validators.required, Validators.minLength(6)]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)]),
    email: new FormControl('',[Validators.required, Validators.email]),
    //confirmPassword: new FormControl('',[Validators.required]),
  });
  constructor(
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }
  async onSubmit(){
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...'
    });
    await loading.present();
    this.authService.register(this.form.value).subscribe(
      async (res) => {
        console.log(res);
        const toast =  await this.toastCtrl.create({
          message: 'Usuario registrado',
          duration: 2000,
          color: 'dark'
        });
        await toast.present();
        loading.dismiss();
        this.form.reset();
        this.router.navigateByUrl('/login',{replaceUrl: true});
        //save token, auto login
        //redirect to profile
      },
      async (res) => {
        console.log(res);
        const alert = await this.alertCtrl.create({
          message: 'Error al registrar',
          buttons: ['OK']
        });
        alert.present();
        loading.dismiss();
      }
    );
  }
}
