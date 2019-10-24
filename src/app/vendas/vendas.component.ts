import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {Venda} from "../models/venda.models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Produto} from "../models/produto.models";
import {Cliente} from "../models/cliente.models";
import {OrdemProduto} from "../models/ordem-produto.models";
import * as moment from 'moment';
import {Caixa} from "../models/caixa.models";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap";
import {AberturaCaixaComponent} from "../modals/abertura-caixa/abertura-caixa.component";
import {Carrinho} from "../models/carrinho.models";


@Component({
    selector: 'app-vendas',
    templateUrl: './vendas.component.html',
    styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {
    // @ts-ignore

    ordemForm: FormGroup;
    clienteForm: FormGroup;


    clientes: Cliente;
    cliente: Cliente;

    produtos: Produto;

    carrinhoAtivo: Carrinho;

    produtoOrdems: Array<OrdemProduto> = [];

    resumoForm: FormGroup;

    troco: number;

    formaPagamento: boolean = false;

    bsModalRef: BsModalRef;

    modalConfig: ModalOptions = {
        animated: true,
        keyboard: false,
        backdrop: false,
        ignoreBackdropClick: true
    };
    data_hj = moment().format('L');

    caixa: Caixa;

    vendaFinalizada: boolean = false;


    constructor(private _apiService: ApiService, private _modalService: BsModalService) {
    }

    ngOnInit() {
        this.createFormCliente();

        this.todosClientes();

        this.selecionarCliente();

        this.createOrdemForm();

        this.todosProdutos();

        this.createResumoForm();

        this.tipoPagamento();

        this.abrirCaixa();

        this.getValorEspecie();
    }


    createFormCliente() {
        this.clienteForm = new FormGroup({
            cliente: new FormControl(null, Validators.required)
        })
    }

    createOrdemForm() {
        this.ordemForm = new FormGroup({
            quantidade: new FormControl(null, Validators.required),
            unidade: new FormControl(null, Validators.required),
            produto: new FormControl(null, Validators.required)
        })
    }

    createResumoForm() {
        this.resumoForm = new FormGroup({
            total: new FormControl(null, Validators.required),
            valor_recebido: new FormControl(null, Validators.required),
            troco: new FormControl(null, Validators.required),
            pagamento: new FormControl(null, Validators.required)
        })
    }

    async todosClientes() {
        const clientes = await this._apiService.get('api/clientes/').toPromise();
        this.clientes = clientes;
    }



    async todosProdutos() {
        const produtos = await this._apiService.get('api/produtos/').toPromise();
        this.produtos = produtos;
    }

    async produtoPorId(id_produto) {
        const produto: Produto = await this._apiService.get(`api/produtos/${id_produto}`).toPromise();
        return produto;
    }

    async ordemPorId(id_ordem) {
        const ordem_produto: OrdemProduto = await this._apiService.get(`api/ordem-produtos/${id_ordem}/`).toPromise();
        return ordem_produto;
    }

    async selecionarCliente() {
        this.clienteForm.get('cliente').valueChanges.subscribe(async cliente_id => {
            const cliente: Cliente = await this._apiService.get(`api/clientes/${cliente_id}`).toPromise();
            this.cliente = cliente;
            this.verificarCarrinhoAtivo(cliente.id);
        })
    }


    async verificarCarrinhoAtivo(id_cliente) {
        const carrinho: Carrinho = await this._apiService.get(`api/carrinho/?cliente=${id_cliente}&ativo=true`).toPromise();
        if (carrinho['length'] != 0) {
            this.carrinhoAtivo = carrinho[0];
            await this.ordensDoCarrinho();
        } else {
            this.carrinhoAtivo = null;
        }
    }

    async adicionarOrdemCarrinhoExistente(id_carrinho) {
        const ordens_antigas: Array<any> = [];
        this.carrinhoAtivo.ordem_produtos.forEach(element => {
            ordens_antigas.push(element)
        });
        const novaOrdemCriada: OrdemProduto = await this.criarOrdem();
        ordens_antigas.push(novaOrdemCriada.id);
        const data = {
            ordem_produtos: ordens_antigas
        };
        const carrinho: Carrinho = await this._apiService.patch(`api/carrinho/${id_carrinho}/`, data).toPromise();
        await this.verificarCarrinhoAtivo(this.cliente.id);
    }

    async ordensDoCarrinho() {
        this.produtoOrdems.length = 0;
        if (this.carrinhoAtivo != null) {
            for (let i = 0; i < this.carrinhoAtivo.ordem_produtos.length; i++) {
                this.produtoOrdems.push(await this.ordemPorId(this.carrinhoAtivo.ordem_produtos[i]));
            }
        }
    }

    async adicionarOrdemCarrinho() {
        await this.verificarCarrinhoAtivo(this.cliente.id);
        if (this.carrinhoAtivo == null) {
            const novaOrdem: OrdemProduto = await this.criarOrdem();
            await this.criarCarrinho(novaOrdem);
        } else {
            const ordemParaAdicionar = await this.adicionarOrdemCarrinhoExistente(this.carrinhoAtivo.id);
        }
    }

    async criarOrdem() {
        try {
            const data = {
                produto: await this.produtoPorId(this.ordemForm.get('produto').value),
                quantidade: this.ordemForm.get('quantidade').value,
                unidade: this.ordemForm.get('unidade').value
            };
            const ordem: OrdemProduto = await this._apiService.post('api/ordem-produtos/', data).toPromise();
            await this.verificarCarrinhoAtivo(this.cliente.id);
            this.ordemForm.reset();
            return ordem;
        } catch (error) {
            alert(error);
        }

    }

    async criarCarrinho(produtoOrdem: OrdemProduto) {
        const carrinhoOrdem: Array<any> = [];
        carrinhoOrdem.push(produtoOrdem.id);
        const data = {
            cliente: this.cliente.id,
            ordem_produtos: carrinhoOrdem,
            ativo: true
        };
        const carrinho: Carrinho = await this._apiService.post('api/carrinho/', data).toPromise();
        this.ordensDoCarrinho();
        await this.verificarCarrinhoAtivo(this.cliente.id);
    }

    async finalizarVenda() {
        try {
            const data = {
                cliente: this.cliente.id,
                carrinho: this.carrinhoAtivo.id,
                pagamento: this.resumoForm.get('pagamento').value,
                ativo: false
            };
            const venda = await this._apiService.post('api/vendas/', data).toPromise();
            const carrinhoData = {
                ativo: false
            };
            const carrinho = await this._apiService.patch(`api/carrinho/${this.carrinhoAtivo.id}/`, carrinhoData).toPromise();
            this.resumoForm.reset();
            this.formaPagamento = false;
            this.verificarCarrinhoAtivo(this.cliente.id);
            this.getValorEspecie();
            this.vendaFinalizada = true;
        } catch (error) {
            console.log("Error", error);
        }
        setTimeout(()=> { this.vendaFinalizada = false }, 3000);
    }

    tipoPagamento() {
        if (this.resumoForm.get('pagamento').value == 'Dinheiro') {
            this.formaPagamento = true;
            this.trocoParaRetornar();
        }
    }

    trocoParaRetornar() {
        const valor_recebido = this.resumoForm.get('valor_recebido').value;
        const troco: number = valor_recebido - this.carrinhoAtivo.total;
        this.troco = troco;
    }

    async deletarOrdem(id_ordem) {
        try {
            const ordem = await this._apiService.delete(`api/ordem-produtos/${id_ordem}/`).toPromise();
            this.verificarCarrinhoAtivo(this.cliente.id);
        } catch (error) {
            console.log(error);
        }
    }

    async abrirCaixa() {
        try {
            const caixa = await this._apiService.get(`api/caixa/?data=` + this.data_hj).toPromise();
            if (caixa.length == 0) {
                this.bsModalRef = this._modalService.show(AberturaCaixaComponent, this.modalConfig);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getValorEspecie() {
        const caixa: Caixa = await this._apiService.get('api/fechar-caixa/?data=' + this.data_hj).toPromise();

        this.caixa = caixa[0].valor_especie;
    }

}
