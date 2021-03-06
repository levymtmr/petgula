import {Component, OnInit} from '@angular/core';
import {Produto} from '../models/produto.models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {BsModalService, ModalOptions, TypeaheadMatch} from 'ngx-bootstrap';
import {EditarProdutosComponent} from '../modals/editar-produtos/editar-produtos.component';
import {ProdutoService} from '../services/produto.service';
import {User} from '../models/user.models';
import {TokenService} from '../services/token.service';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Component({
    selector: 'app-produtos',
    templateUrl: './produtos.component.html',
    styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
    // tslint:disable-next-line: no-shadowed-variable
    produtoForm: FormGroup;
    produtoCriado = false;
    produtos: any;
    operador: User;
    typeaheadLoading: boolean;
    typeaheadNoResults: boolean;
    produtosCadastrados: Array<any> = [];
    dataSource: Observable<any>;
    asyncSelected: string;
    itensCadastrados: Array<any> = [];
    compraForm: FormGroup;
    compraFinalizada: boolean = false;

    selected: string;

    searchForm: FormGroup;

    modalConfig: ModalOptions = {
        animated: true,
        keyboard: false,
        backdrop: false,
        ignoreBackdropClick: true
    };

    constructor(
        private _apiService: ApiService,
        private _modalService: BsModalService,
        private _produtoService: ProdutoService,
        private _tokenService: TokenService) {
        this.dataSource = Observable.create((observer: any) => {
            observer.next(this.asyncSelected);
        })
            .pipe(
                mergeMap((search: string) => this.pesquisaProdutosCadastrados(search))
            );

    }

    async ngOnInit() {
        this.createCompraForm();
        this.createProdutoForm();
        this.createSearchForm();
        this.todosProdutos();
        this.operador = await this._tokenService.decoderToken();
        this.carregarProdutosCadastrados();

    }

    createSearchForm() {
        this.searchForm = new FormGroup({
            search: new FormControl(null, Validators.required)
        });
    }

    createCompraForm() {
        this.compraForm = new FormGroup({
            quantidade: new FormControl(null, Validators.required),
            valor_compra: new FormControl(null, Validators.required),
            valor_venda: new FormControl(null, Validators.required)
        });
    }

    createProdutoForm() {
        this.produtoForm = new FormGroup({
            nome: new FormControl(null, Validators.required),
            quantidade: new FormControl(null, Validators.required),
            valor_compra: new FormControl(null, Validators.required),
            valor_venda: new FormControl(null, Validators.required)
        });
    }

    async criarProduto() {
        try {
            const data = {
                nome: this.produtoForm.get('nome').value,
                quantidade: this.produtoForm.get('quantidade').value,
                valor_compra: this.produtoForm.get('valor_compra').value,
                valor_venda: this.produtoForm.get('valor_venda').value
            };
            const produto: Produto = await this._apiService.post('api/produtos/', data).toPromise();
            this.produtoCriado = true;
            await this.todosProdutos();
            this.produtoForm.reset();
        } catch (e) {
            console.log(e);
        }
        setTimeout(() => {
            this.produtoCriado = false;
        }, 3000);
    }

    async todosProdutos() {
        const produtos = await this._apiService.get('api/produtos').toPromise();
        this.produtos = produtos;
    }

    chamaModalEditarProduto(id) {
        if (this.operador.is_staff) {
            this._produtoService.id_produto = id;
            this._modalService.show(
                EditarProdutosComponent, this.modalConfig
            );
        } else {
            alert('Você não tem permissão para alterar um produto');
        }
    }

    async pesquisarProdutosTabela(event: any) {
        this._apiService.get(`api/produtos?search=${event.target.value}`).subscribe(res => {
            this.produtos = res;
            return res;
        });
    }

    async carregarProdutosCadastrados(search = '') {
        const produtos = await this._apiService.get(`api/produtos?search=${search}`).toPromise();
        this.produtosCadastrados = produtos;

    }

    pesquisaProdutosCadastrados(search: string) {
        const query = new RegExp(search, 'i');
        this.carregarProdutosCadastrados(search);
        return of(
            this.produtosCadastrados.filter((items: any) => {
                return query.test(items['nome']);
            })
        );

    }

    changeTypeaheadLoading(e: boolean): void {
        this.typeaheadLoading = e;
    }

    typeaheadOnSelect(e: TypeaheadMatch): void {
        this.itensCadastrados.push(e.item);
    }

    async fecharCompra() {
        // Solucao para adicionar apenas uma compra por vez
        // a estrutura do projeto inviabilizou de fazer a melhor forma
        const compra = {
            'produto': this.itensCadastrados[0],
            'quantidade': this.compraForm.get('quantidade').value,
            'valor_compra': this.compraForm.get('valor_compra').value,
            'valor_venda': this.compraForm.get('valor_venda').value
        };
        try {
            await this._apiService.post('api/estoques/', compra).toPromise();
            this.compraForm.reset();
            this.itensCadastrados.length = 0;
            this.todosProdutos();
        } catch (error) {
            console.log("Error", error);
        }
    }
}