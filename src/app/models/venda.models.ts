import {Carrinho} from './carrinho.models';

export class Venda {
    constructor(
        public id: string,
        public cliente: number,
        public carrinho: Carrinho,
        public total: number,
        public pagamento: string
    ) {

    }
}