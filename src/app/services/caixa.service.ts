import {EventEmitter, Injectable, Input, Output} from '@angular/core';
import {Caixa} from '../models/caixa.models';
import * as moment from 'moment';
import {ApiService} from './api.service';


@Injectable({
    providedIn: 'root'
})
export class CaixaService {

    data_hj = moment().format('L');

    @Input() caixa: number;
    @Output() mudouValorCaixa: EventEmitter<number> = new EventEmitter<number>();

    constructor(private _apiService: ApiService) {
    }

    

    async getValorEspecie() {
        try {
            const caixa: Caixa = await this._apiService.get('api/fechar-caixa/?data=' + this.data_hj).toPromise();
            this.mudouValorCaixa.emit(caixa[0].valor_especie);
            return caixa.valor_especie;
        } catch (error) {
            console.log('Error', error);
        }

    }
}
