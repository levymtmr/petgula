import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ApiService } from '../../services/api.service';
import { CaixaService } from 'src/app/services/caixa.service';

@Component({
  selector: 'app-abertura-caixa',
  templateUrl: './abertura-caixa.component.html',
  styleUrls: ['./abertura-caixa.component.scss']
})
export class AberturaCaixaComponent implements OnInit {
  aberturaCaixaForm: FormGroup;

  constructor(
    private _apiService: ApiService,
    private _bsModalRef: BsModalRef,
    private _caixaService: CaixaService) {
  }

  ngOnInit() {
    this.createFormAberturaCaixa();
  }

  createFormAberturaCaixa() {
    this.aberturaCaixaForm = new FormGroup({
      valor_abertura: new FormControl(null, Validators.required)
    });
  }

  fecharModal() {
    this._bsModalRef.hide();
  }

  async abrirCaixa() {
    try {
      const data = {
        valor_abertura: this.aberturaCaixaForm.get('valor_abertura').value
      };
      const caixa = await this._apiService.post('api/caixa/', data).toPromise();
      this._caixaService.getValorEspecie();
      this.fecharModal();
    } catch (error) {
      console.log('error', error);
    }

  }

}
