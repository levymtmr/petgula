import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-registrar-usuario',
    templateUrl: './registrar-usuario.component.html',
    styleUrls: ['./registrar-usuario.component.scss']
})
export class RegistrarUsuarioComponent implements OnInit {


    usuarioForm: FormGroup;

    constructor(private _bsModalRef: BsModalRef, private _apiService: ApiService) {
    }

    ngOnInit() {
        this.criarUsuarioForm();
    }

    criarUsuarioForm() {
        this.usuarioForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required),
            email: new FormControl(null, Validators.required)
        });
    }

    async registraNovoUsuario() {
        try {
            const data = {
                username: this.usuarioForm.get('username').value,
                password: this.usuarioForm.get('password').value,
                email: this.usuarioForm.get('email').value
            };
            const usuario = await this._apiService.post('api/usuarios/', data).toPromise();
            this._bsModalRef.hide();
        } catch (error) {
            this._bsModalRef.hide();
            console.log('Error', error);
        }


    }

}
