import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {Cliente} from '../models/cliente.models';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AlterarClientesComponent} from '../modals/alterar-clientes/alterar-clientes.component';
import { ClienteService } from '../services/cliente.service';
import { User } from '../models/user.models';
import { TokenService } from '../services/token.service';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {


    clienteForm: FormGroup;
    clienteCriado = false;
    clientes: Cliente;
    operador: User;


    bsModalRef: BsModalRef;
    config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
    };

    constructor(
        private _apiService: ApiService, 
        private _modalService: BsModalService,
        private _clienteService: ClienteService,
        private _tokenService: TokenService) {
    }

    async ngOnInit() {
        this.createClienteForm();
        this.todosClientes();
        this._clienteService.mudouArrayClientes.subscribe(clientes => {
            this.clientes = clientes;
        });
        this.operador =  await this._tokenService.decoderToken();
    }

    createClienteForm() {
        this.clienteForm = new FormGroup({
            nome: new FormControl('', Validators.required),
            endereco: new FormControl(null, Validators.required),
            telefone: new FormControl(null, Validators.required)
        });
    }

    async novoCliente() {
        try {
            const data = {
                nome: this.clienteForm.get('nome').value,
                endereco: this.clienteForm.get('endereco').value,
                telefone: this.clienteForm.get('telefone').value
            };
            const cliente: Cliente = await this._clienteService.criarCliente(data);
            this.clienteCriado = true;
            this.clienteForm.reset();
        } catch (error) {
            console.log('Error', error);
        }
        setTimeout(() => {
            this.clienteCriado = false;
        }, 3000);
        this.todosClientes();
    }

    async todosClientes() {
        try {
            const cliente = await this._apiService.get('api/clientes/').toPromise();
            this.clientes = cliente;

        } catch (error) {
            console.log('Error', error);
        }
    }


    async alterarCliente(id_cliente) {
        if (this.operador.is_staff) {
            const initialState = {
                cliente: id_cliente
            };
            this.bsModalRef = this._modalService.show(AlterarClientesComponent, {initialState});
        } else {
            alert('Você não tem permissão para alterar um produto');
          }
    }


}
