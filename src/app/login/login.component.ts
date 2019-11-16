import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Usuario } from '../models/usuario.models';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { RegistrarUsuarioComponent } from "../modals/registrar-usuario/registrar-usuario.component";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    private _usuario: Usuario = new Usuario();


    constructor(
        private _apiService: ApiService, 
        private _authService: AuthService, 
        private _router: Router, 
        private _modalService: BsModalService) {
    }

    ngOnInit() {
        this.createLoginForm();
    }

    createLoginForm() {
        this.loginForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }

    async login() {
        try {
            const username = this.loginForm.get('username').value;
            const password = this.loginForm.get('password').value;
            const token = await this._authService.login(username, password);
        } catch (error) {
            console.log('Error', error);
        }
    }

   

}
