<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import {Produto} from "../models/produto.models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api.service";
=======
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
>>>>>>> e7c9e227... Adicionado caculo da quantidade quando for passado apenas o valor do produto

@Component({
    selector: 'app-produtos',
    templateUrl: './produtos.component.html',
    styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
<<<<<<< HEAD
  produtoForm: FormGroup;
  produtoCriado: boolean = false;
  produtos: Produto;
  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    this.createProdutoForm();

    this.todosProdutos();
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
      console.log(e)
    }
    setTimeout(()=> { this.produtoCriado = false }, 3000);
  }

  async todosProdutos() {
    const produtos: Produto = await this._apiService.get('api/produtos/').toPromise();
    this.produtos = produtos;
  }
=======
    // tslint:disable-next-line: no-shadowed-variable
    produtoForm: FormGroup;
    produtoCriado = false;
    produtos: Array<Produto> = [];
    operador: User;

    asyncSelected: string;
    typeaheadLoading: boolean;
    typeaheadNoResults: boolean;
    dataSource: Observable<any>;

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
        }).pipe(mergeMap((search: string) => this.pesquisarProdutos(search)));
    }

    async ngOnInit() {
        this.createProdutoForm();
        this.createSearchForm();
        this.todosProdutos();

        this._produtoService.mudouArrayProdutos.subscribe(produtos => {
            this.produtos = produtos;
        });
        this.operador = await this._tokenService.decoderToken();
    }

    createSearchForm() {
        this.searchForm = new FormGroup({
            search: new FormControl(null, Validators.required)
        });
    }
>>>>>>> e7c9e227... Adicionado caculo da quantidade quando for passado apenas o valor do produto

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
        await this._produtoService.todosProdutos();
        this.produtos.push(this._produtoService.produtos);
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

    async pesquisarProdutos(search) {
        this._apiService.get(`api/produtos?search=${search}`).subscribe(res => {
            this.produtos = res;
            return res;
        });
    }

    changeTypeaheadLoading(e: boolean): void {
        this.typeaheadLoading = e;
    }

    typeaheadOnSelect(e: TypeaheadMatch): void {
        console.log('Selected value: ', e.value);
    }
}
