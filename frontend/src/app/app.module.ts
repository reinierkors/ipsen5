import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';
import {MdCardModule} from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {MdSnackBarModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdSidenavModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdInputModule} from '@angular/material';
import {MdSelectModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ResultsComponent} from './results/results-gmap/results-gmap.component';
import {CreateAccountComponent} from './user/create-account/create-account.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {NguiMapModule} from '@ngui/map';
import { SampleUploadComponent } from './sample/sample-upload/sample-upload.component';
import { SampleViewComponent } from './sample/sample-view/sample-view.component';
import { SampleEditComponent } from './sample/sample-edit/sample-edit.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
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
    ],
    imports: [
        MdInputModule,
        MdSidenavModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        MdCardModule,
        MdMenuModule,
        MdButtonModule,
        MdListModule,
        MdSelectModule,
        MdToolbarModule,
        MdSnackBarModule,
        NgxDatatableModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes, {useHash: false}),
        ReactiveFormsModule,
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyA8acwCuestYr1vo1mJK-QdkZ-3AwW1blM'}),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
