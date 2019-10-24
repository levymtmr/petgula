import {OrdemProduto} from "./ordem-produto.models";

export class Venda {
    constructor(
        public id: string,
        public cliente: number,
        public ordem_produtos: OrdemProduto,
        public total: number,
        public pagamento: string
    ) {

    }
}