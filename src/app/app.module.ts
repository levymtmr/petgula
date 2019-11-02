import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {VendasComponent} from './vendas/vendas.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SidebarComponent} from './sidebar/sidebar.component';
import {ProdutosComponent} from './produtos/produtos.component';
import {AlertModule} from "ngx-bootstrap";
import {AberturaCaixaComponent} from './modals/abertura-caixa/abertura-caixa.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ClientesComponent} from './clientes/clientes.component';
import {TokenService} from "./services/token.service";
import {AuthService} from "./services/auth.service";
import {AuthGuardService} from "./services/auth-guard.service";
import {InterceptorService} from "./services/interceptor.service";
import {LoginComponent} from "./login/login.component";
import { HomeComponent } from './home/home.component';
import { ResumoComponent } from './resumo/resumo.component';


@NgModule({
    declarations: [
        AppComponent,
        VendasComponent,
        SidebarComponent,
        ProdutosComponent,
        AberturaCaixaComponent,
        ClientesComponent,
        LoginComponent,
        HomeComponent,
        ResumoComponent
    ],
    entryComponents: [AberturaCaixaComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        AlertModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        FontAwesomeModule,
        FormsModule,
    ],
    providers: [TokenService, AuthService, AuthGuardService, InterceptorService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
