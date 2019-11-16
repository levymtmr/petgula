import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private _authService: AuthService, private _router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        if (this._authService.isLoggedIn()) {
            return true;
        }
        this._router.navigate(['/']);
        return false;

    }
}