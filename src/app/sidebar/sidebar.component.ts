import {Component, Input, OnInit} from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import {ApiService} from '../services/api.service';
import {JWTPayload} from '../models/jwt-payload.models';
import {Usuario} from '../models/usuario.models';
import {AuthService} from '../services/auth.service';
import {CaixaService} from '../services/caixa.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RegistrarUsuarioComponent } from '../modals/registrar-usuario/registrar-usuario.component';
import { Caixa } from '../models/caixa.models';
import * as moment from 'moment';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    data_hj = moment().format('L');
    usuario: any;

    caixa: any;
    
    constructor(private _apiService: ApiService,
                private  _authService: AuthService,
                private _caixaService: CaixaService,
                private _modalService: BsModalService) {
    }

    async ngOnInit() {
        await this.decoderToken();
        this.valorCaixaAtual();
        this._caixaService.mudouValorCaixa.subscribe(valor_caixa => {
            this.caixa = valor_caixa;
        });
    }

    openNav() {
        document.getElementById('mySidenav').style.width = '250px';
        document.getElementById('main').style.marginLeft = '250px';
    }

    closeNav() {
        document.getElementById('mySidenav').style.width = '0';
        document.getElementById('main').style.marginLeft = '0';
    }

    async valorCaixaAtual() {
        const caixa: Caixa = await this._apiService.get('api/fechar-caixa/?data=' + this.data_hj).toPromise();
        this.caixa = caixa[0]['valor_especie'];
    }

    async decoderToken() {
        const token = localStorage.getItem('token');
        const decoderToken = <JWTPayload>jwtDecode(token);
        const usuario_id = decoderToken['user_id'];
        const usuario: Usuario = await this._apiService.get(`api/usuarios/${usuario_id}/`).toPromise();
        this.usuario = usuario.username;
    }


    sair() {
        this._authService.logout();
    }

    registrarNovoUsuario() {
        const config = {
            animated: true,
            keyboard: false,
            backdrop: true,
            ignoreBackdropClick: true
        };
        this._modalService.show(RegistrarUsuarioComponent, config);
    }

}
