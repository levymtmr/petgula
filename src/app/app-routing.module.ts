import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VendasComponent} from './vendas/vendas.component';
import {ProdutosComponent} from './produtos/produtos.component';
import {ClientesComponent} from './clientes/clientes.component';
import {LoginComponent} from './login/login.component';
import {ResumoComponent} from './resumo/resumo.component';

// @ts-ignore
const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'vendas', component: VendasComponent},
    {path: 'produtos', component: ProdutosComponent},
    {path: 'clientes', component: ClientesComponent},
    {path: 'resumos', component: ResumoComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
