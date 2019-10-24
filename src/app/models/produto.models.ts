export class Produto {

    constructor(
        public id: number,
        public nome: string,
        public quantidade: number,
        public valor_compra: number,
        public valor_venda: number
    ) {}
}