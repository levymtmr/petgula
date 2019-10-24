import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../models/usuario.models";
import {Router} from "@angular/router";
import {ApiService} from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

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
}
