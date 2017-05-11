import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from "@angular/router";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

const routes:Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
