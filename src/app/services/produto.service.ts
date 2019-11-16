import { Injectable, Input, Output } from '@angular/core';
import { ApiService } from './api.service';
import { OutletContext } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProdutoService {

    @Input() id_produto: number;
    @Output() mudouIdProduto: EventEmitter<number> = new EventEmitter<number>();

    constructor(private _apiService: ApiService) {}

    


}