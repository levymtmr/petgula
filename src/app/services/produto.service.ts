import { Injectable, Input, Output } from '@angular/core';
import { ApiService } from './api.service';
import { OutletContext } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Produto } from '../models/produto.models';

@Injectable({
    providedIn: 'root'
})
export class ProdutoService {

    @Input() id_produto: number;
    @Output() mudouIdProduto: EventEmitter<number> = new EventEmitter<number>();

    @Input() produtos: Produto;
    @Output() mudouArrayProdutos: EventEmitter<Produto> = new EventEmitter<Produto>();

    constructor(private _apiService: ApiService) {}


    async todosProdutos() {
        const produtos: Produto = await this._apiService.get('api/produtos/').toPromise();
        this.produtos = produtos;
        this.mudouArrayProdutos.emit(produtos);
        return produtos;
      }
}