import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api.service";
import {Cliente} from "../models/cliente.models";

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {


    clienteForm: FormGroup;
    clienteCriado: boolean = false;
    clientes: Cliente

    constructor(private _apiService: ApiService) {
    }

    ngOnInit() {
        this.todosClientes();
        this.createClienteForm();
    }

    createClienteForm() {
        this.clienteForm = new FormGroup({
            nome: new FormControl(null, Validators.required),
            endereco: new FormControl(null, Validators.required),
            telefone: new FormControl(null, Validators.required)
        })
    }

    async criarCliente() {
        try {
            const data = {
                nome: this.clienteForm.get('nome').value,
                endereco: this.clienteForm.get('endereco').value,
                telefone: this.clienteForm.get('telefone').value
            }
            const cliente: Cliente = await this._apiService.post('api/clientes/', data).toPromise();
            this.clienteCriado = true;
            this.clienteForm.reset();
        } catch (error) {
            console.log('Error', error);
        }
        setTimeout(() => {
            this.clienteCriado = false
        }, 3000);
        this.todosClientes();
    }

    async todosClientes() {
        try {
            const cliente = await this._apiService.get('api/clientes/').toPromise();
            this.clientes = cliente

        } catch (error) {
            console.log("Error", error);
        }

    }

}
