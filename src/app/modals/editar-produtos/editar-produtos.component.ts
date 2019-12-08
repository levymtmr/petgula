import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ApiService} from 'src/app/services/api.service';
import {ProdutoService} from 'src/app/services/produto.service';
import {Produto} from 'src/app/models/produto.models';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-editar-produtos',
    templateUrl: './editar-produtos.component.html',
    styleUrls: ['./editar-produtos.component.scss']
})
export class EditarProdutosComponent implements OnInit {

    modalRef: BsModalRef;
    produto: Produto;
    produtoForm: FormGroup;

    constructor(
        private _modalService: BsModalService,
        private _apiService: ApiService,
        private _bsModalRef: BsModalRef,
        private _produtoService: ProdutoService) {
    }

    ngOnInit() {
        this.criarProdutoFormulario();

        this.popularDadosProduto();
    }

    criarProdutoFormulario() {
        this.produtoForm = new FormGroup({
            nome: new FormControl(null, Validators.required),
            quantidade: new FormControl(null, Validators.required),
            valor_compra: new FormControl(null, Validators.required),
            valor_venda: new FormControl(null, Validators.required)
        });
    }

    async popularDadosProduto() {
        const produto = await this._apiService.get(`api/produtos/${this._produtoService.id_produto}/`).toPromise();
        this.produtoForm.get('nome').setValue(produto.nome);
        this.produtoForm.get('quantidade').setValue(produto.quantidade);
        this.produtoForm.get('valor_compra').setValue(produto.valor_compra);
        this.produtoForm.get('valor_venda').setValue(produto.valor_venda);
    }

    async atualizarProduto() {
        const data = {
            nome: this.produtoForm.get('nome').value,
            quantidade: this.produtoForm.get('quantidade').value,
            valor_compra: this.produtoForm.get('valor_compra').value,
            valor_venda: this.produtoForm.get('valor_venda').value,
        };
        const produto = await this._apiService.patch(`api/produtos/${this._produtoService.id_produto}/`, data).toPromise();
        this._produtoService.todosProdutos();
        this.fecharModal();
    }

    fecharModal() {
        this._bsModalRef.hide();
    }

    async deletarProduto() {
        try {
            const produto = await this._apiService.delete(`api/produtos/${this._produtoService.id_produto}/`).toPromise();
        } catch (error) {
          console.log('Error', error);
        }
    }

}
