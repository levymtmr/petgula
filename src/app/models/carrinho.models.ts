import {OrdemProduto} from "./ordem-produto.models";
import {Cliente} from "./cliente.models";

export class Carrinho {
    constructor(
        public id: number,
        public cliente: Cliente,
        public ordem_produtos: Array<OrdemProduto>,
        public ativo: boolean,
        public total: number
    ){}
}
