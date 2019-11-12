import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {ApiService} from '../services/api.service';
import {Venda} from '../models/venda.models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Produto} from '../models/produto.models';


@Component({
    selector: 'app-resumo',
    templateUrl: './resumo.component.html',
    styleUrls: ['./resumo.component.scss']
})
export class ResumoComponent implements OnInit {

    vendas: Venda;

    produtos: Produto;

    formData: FormGroup;

    constructor(private _apiService: ApiService) {
    }

    ngOnInit() {
        this.createFormData();
        this.grafico();
        this.getProdutosVendidos();
    }

    createFormData() {
        this.formData = new FormGroup({
            data: new FormControl(null, Validators.required)
        });
    }


    async getProdutosVendidos() {
        this.formData.get('data').valueChanges.subscribe(async data => {
            this.produtos = null;
            const produtos: Produto = await this._apiService.get(`api/ordem-produtos/?data=${data}`).toPromise();
            this.produtos = produtos;
        });
    }

    async grafico() {
        const ctx = document.getElementById('myChart');
        const totais = await this._apiService.get('api/vendas/periodo').toPromise();
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
                datasets: [{
                    label: '# Faturamento',

                    data: totais['results'],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

}
