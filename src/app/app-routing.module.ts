import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VendasComponent} from './vendas/vendas.component';
import {ProdutosComponent} from "./produtos/produtos.component";
import {ClientesComponent} from "./clientes/clientes.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {LoginComponent} from "./login/login.component";

// @ts-ignore
const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'vendas', component: VendasComponent},
    {path: 'produtos', component: ProdutosComponent},
    {path: 'clientes', component: ClientesComponent}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
