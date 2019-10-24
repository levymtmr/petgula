import {Produto} from "./produto.models";

export class OrdemProduto {
    constructor(
        public id: number,
        public quantidade: number,
        public unidade: string,
        public produto: Produto,
        public total: number
    ){

    }
}