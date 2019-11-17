import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../models/usuario.models";
import {Router} from "@angular/router";
import {ApiService} from "./api.service";
import * as jwtDecode from 'jwt-decode';
import { JWTPayload } from '../models/jwt-payload.models';
import { User } from '../models/user.models';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    usuario: User;

    constructor(private _apiService: ApiService, private router: Router) {
    }


    async obterToken(username: string, password: string) {
        try {
            const data = {
                username: username,
                password: password
            };
            const token = await this._apiService.post('api/token/', data).toPromise();
            localStorage.setItem('token', token['access']);
            await this.router.navigate(['/vendas']);
        } catch (error) {
            console.log("Error token", error);
        }
    }

    async decoderToken() {
        const token = localStorage.getItem('token');
        const decoderToken = <JWTPayload>jwtDecode(token);
        const usuario_id = decoderToken['user_id'];
        const usuario: User = await this._apiService.get(`api/usuarios/${usuario_id}/`).toPromise();
        return usuario;
    }
}
