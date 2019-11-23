import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VendasComponent} from './vendas/vendas.component';
import {ProdutosComponent} from './produtos/produtos.component';
import {ClientesComponent} from './clientes/clientes.component';
import {LoginComponent} from './login/login.component';
import {ResumoComponent} from './resumo/resumo.component';
import { AuthGuardService } from './services/auth-guard.service';

// @ts-ignore
const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'vendas', component: VendasComponent, canActivate: [AuthGuardService]},
    {path: 'produtos', component: ProdutosComponent, canActivate: [AuthGuardService]},
    {path: 'clientes', component: ClientesComponent, canActivate: [AuthGuardService]},
    {path: 'resumos', component: ResumoComponent, canActivate: [AuthGuardService]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}