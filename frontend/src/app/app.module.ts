import 'hammerjs';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {Routes, RouterModule} from '@angular/router';
import {MdCardModule} from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdSidenavModule} from '@angular/material';
import {MdListModule} from '@angular/material';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ResultsComponent} from './results/results.component';
import {CreateAccountComponent} from './create-account/create-account.component';
import {NguiMapModule} from '@ngui/map';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'account', component: CreateAccountComponent},
    {path: 'results', component: ResultsComponent},
    {path: '**', component: HomeComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CreateAccountComponent,
        ResultsComponent,
    ],
    imports: [
        MdSidenavModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        MdCardModule,
        MdMenuModule,
        MdListModule,
        MdToolbarModule,
        RouterModule.forRoot(routes, {useHash: false}),
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyA8acwCuestYr1vo1mJK-QdkZ-3AwW1blM'})
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
