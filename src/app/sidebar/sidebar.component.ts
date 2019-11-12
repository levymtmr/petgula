import {Component, Input, OnInit} from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import {ApiService} from '../services/api.service';
import {JWTPayload} from '../models/jwt-payload.models';
import {Usuario} from '../models/usuario.models';
import {AuthService} from '../services/auth.service';
import {VendasComponent} from '../vendas/vendas.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    usuario: any;

    caixa: any;

    constructor(private _apiService: ApiService, private  _authService: AuthService, private _venda: VendasComponent) {

    }

    async ngOnInit() {
        await this.decoderToken();
        this._venda.mudouValorCaixa.subscribe(valor => {
            this.caixa = valor;
        });
        console.log('recebe caixa', this.caixa);
    }

    openNav() {
        document.getElementById('mySidenav').style.width = '250px';
        document.getElementById('main').style.marginLeft = '250px';
    }

    closeNav() {
        document.getElementById('mySidenav').style.width = '0';
        document.getElementById('main').style.marginLeft = '0';
    }

    async decoderToken() {
        const token = localStorage.getItem('token')
        const decoderToken = <JWTPayload>jwtDecode(token);
        const usuario_id = decoderToken['user_id'];
        const usuario: Usuario = await this._apiService.get(`api/usuarios/${usuario_id}/`).toPromise();
        this.usuario = usuario.username;
    }


    sair() {
        this._authService.logout();
    }

}