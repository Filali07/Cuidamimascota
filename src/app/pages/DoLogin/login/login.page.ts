import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IUser } from 'src/app/model/iuser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  password: string;
  email: string;
  remember: boolean;
  users: IUser[];
  user: IUser = {} as IUser

  constructor(private router: Router, public alertController: AlertController, private authService: AuthService) { }

  ngOnInit() {
  }
 
  register(){
    this.router.navigateByUrl('/register-selection');
  }
  
  async goToHome(){
    const current = await this.authService.login(this.email, this.password);
    if(current) {
      this.router.navigateByUrl('home');
    }else{
      this.alerterror();
    }
  }

  async alerterror(){
    const alert = await this.alertController.create({
      header: 'Error de autentificación',
      message: 'Contrasña o email incorrecto, vuelve a introducirlos',
      buttons: ['De acuerdo']
    });
    await alert.present();
  }

  async loginGoogle(){
    if(!this.user.nombre || !this.user.apellidos || !this.user.edad || !this.user.email || !this.user.pass || !this.user.sexo || this.user.type == null){
      this.router.navigateByUrl('/register-selection');
    }else{
      const current = await this.authService.loginGoogle();
      if(current) {
        this.router.navigateByUrl('/home');
      }else{
        this.alerterror();
      }
    }
    
  }

  async loginFacebook(){
    const current = await this.authService.loginFacebook();
    if(current) {
      this.router.navigateByUrl('home');
    }else{
      this.alerterror();
    }
  }

  resetPass(){
    this.authService.resetPass(this.email).then(
      () => {
        this.alertResetPassword();
        this.router.navigateByUrl('/login');
      }
    ).catch(
      () => this.alertError()
    );
  }

  async alertResetPassword(){
    const alert = await this.alertController.create({
      header: 'Recuperación de contraseña correcto',
      message: `Se le ha enviado al correo ${this.email} el enlace que le permitirá recuerar la contraseña`,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async alertError(){
    const alert = await this.alertController.create({
      header: 'Recuperación de contraseña Incorrecto',
      message: 'No se ha podido enviar un correo para reestablecer la contraseña. Inténtalo más tarde',
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}
