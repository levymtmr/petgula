import { Component, OnInit } from '@angular/core';
import {Produto} from "../models/produto.models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
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
    })
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

}
