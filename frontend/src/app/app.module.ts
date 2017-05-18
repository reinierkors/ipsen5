import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from "@angular/router";
import {MdCardModule} from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdSidenavModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SampleLocationTableComponent } from './sample-location-table/sample-location-table.component';

const routes:Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'account', component: CreateAccountComponent},
  {path: 'results', component: ResultsComponent},
  {path: 'sampleLocation', component: SampleLocationTableComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateAccountComponent,
    ResultsComponent,
    SampleLocationTableComponent,
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
    NgxDatatableModule,
    RouterModule.forRoot(routes, {useHash: false}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
