import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';
import {MdButton, MdCardModule} from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdSidenavModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdInputModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdSelectModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SampleUploadComponent } from './sample/sample-upload/sample-upload.component';
import { SampleViewComponent } from './sample/sample-view/sample-view.component';
import { SampleEditComponent } from './sample/sample-edit/sample-edit.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./auth/auth.guard";

const routes:Routes = [
  {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'account', component: CreateAccountComponent, canActivate: [AuthGuard]},
  {path: 'results', component: ResultsComponent},
  {path: 'sample/upload', component: SampleUploadComponent},
  {path: 'sample/view/:id', component: SampleViewComponent},
  {path: 'sample/edit/:id', component: SampleEditComponent},
    /* Admin Routes */
  {path: 'admin/create-account', component: CreateAccountComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateAccountComponent,
    ResultsComponent,
    SidenavComponent,
    SampleUploadComponent,
    SampleViewComponent,
    SampleEditComponent,
    LoginComponent,
  ],
  imports: [
    MdSidenavModule,
    BrowserModule,
    FormsModule,
    HttpModule,
	JsonpModule,
    MdCardModule,
    MdMenuModule,
    MdListModule,
    MdInputModule,
      MdButtonModule,
      BrowserAnimationsModule,
      MdSelectModule,
    MdToolbarModule,
    NgxDatatableModule,
    RouterModule.forRoot(routes, {useHash: false}),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
