import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {JWTPayload} from "../models/jwt-payload.models";

import * as jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import {Router} from "@angular/router";


@Injectable()
export class AuthService {

    constructor(private _apiService: ApiService, private _router:Router) {
    }

    private setSession(authResults) {
        const token = authResults;
        const payload = <JWTPayload>jwtDecode(token);
        const expiresAt = moment.unix(payload.exp);

        localStorage.setItem('token', authResults);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    get token(): string {
        return localStorage.getItem('token');
    }

    async login(username: string, password: string) {
        try {
            const token = await this._apiService.post('api/token/', {username, password}).toPromise();
            this.setSession(token['access']);
            await this._router.navigate(['vendas']);
        } catch (error) {
            if (error['detail'] === "No active account found with the given credentials") {
                alert("Usuario ou Senha não encontrados");
            }
            console.log("Error", error);
        }

    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('expires_at');
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);

        return moment(expiresAt);
    }

    isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    async refreshToken() {
        if (moment().isBetween(this.getExpiration().subtract(1, 'days'), this.getExpiration())) {
            const refreshToken = await this._apiService.post('api/token/refresh/', {token: this.token}).toPromise();
            return refreshToken;
        }
    }
}