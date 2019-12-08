import {Produto} from './produto.models';

export class Estoque {

    constructor(
        public id: number,
        public produto: Produto,
        public quantidade: number,
        public valor_compra: string,
        public valor_venda: string
    ) {}
}