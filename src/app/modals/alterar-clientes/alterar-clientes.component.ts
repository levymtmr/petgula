import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-alterar-clientes',
    templateUrl: './alterar-clientes.component.html',
    styleUrls: ['./alterar-clientes.component.scss']
})
export class AlterarClientesComponent implements OnInit {

    clienteForm: FormGroup;


    constructor(private _modalService: BsModalService,
                private _apiService: ApiService,
                public _bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        this.createFormCliente();
        this.popularDadosCliente();
    }

    async popularDadosCliente() {
        const id_cliente = this._modalService.config.initialState['cliente'];
        const cliente = await this._apiService.get(`api/clientes/${id_cliente}/`).toPromise();
        this.clienteForm.get('nome').setValue(cliente.nome);
        this.clienteForm.get('endereco').setValue(cliente.endereco);
        this.clienteForm.get('telefone').setValue(cliente.telefone);

    }

    createFormCliente() {
        this.clienteForm = new FormGroup({
            nome: new FormControl(),
            endereco: new FormControl(),
            telefone: new FormControl()
        });
    }

    async alteraCliente() {
        const id_cliente = this._modalService.config.initialState['cliente'];
        const data = {
            nome: this.clienteForm.get('nome').value,
            endereco: this.clienteForm.get('endereco').value,
            telefone: this.clienteForm.get('telefone').value
        };
        const cliente = await this._apiService.patch(`api/clientes/${id_cliente}/`, data).toPromise();
        this.fecharModal()
    }

    fecharModal() {
        this._bsModalRef.hide();
      }

}
