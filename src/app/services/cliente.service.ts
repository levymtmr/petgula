import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { Cliente } from '../models/cliente.models';


@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    @Input() clientes: Cliente;
    @Output() mudouArrayClientes: EventEmitter<Cliente> = new EventEmitter<Cliente>();

    constructor(private _apiService: ApiService) { }

    async criarCliente(data) {
        try {
            const cliente: Cliente = await this._apiService.post('api/clientes/', data).toPromise();
            this.todosClientes();
            return cliente;
        } catch (error) {
            console.log('Error', error);
        }
    }

    async todosClientes() {
        try {
            const cliente = await this._apiService.get('api/clientes/').toPromise();
            this.clientes = cliente;
            this.mudouArrayClientes.emit(cliente);
            return this.clientes;
        } catch (error) {
            console.log('Error', error);
        }
    }

    async mudarDados(data, id_cliente) {
        try {
            const cliente = await this._apiService.patch(`api/clientes/${id_cliente}/`, data).toPromise();
        this.todosClientes();
        } catch (error) {
            console.log('Error', error);
        }
        
    }
}