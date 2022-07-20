import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTodosGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private router:Router,
    private snackBar: MatSnackBar
    ){}
  

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser.pipe(map((user) => {
      /* Se user for igual a nulo, não há usuário logado e a pessoa será redirecionada para a página de login */
      if (user == null) {
        return this.router.parseUrl('/auth/login')
      }
      if(!user.emailVerified){
        user.sendEmailVerification()
        this.snackBar.open("Email não verificado. Foi enviado outro email!", "Ok",{
          verticalPosition:'top',
          duration:3000
        })
        return this.router.parseUrl('/auth/verify-email')
      }
      return true
      /* Se a pessoa está logada, mas ainda não verificou o email, esta será redirecionada para a página
      informando que ela precisa verificar o email */
    }))
  }
  
}
