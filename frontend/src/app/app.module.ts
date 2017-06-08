import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';
import {
	MaterialModule,
	MdCardModule,
	MdMenuModule,
	MdSnackBarModule,
	MdToolbarModule,
	MdSidenavModule,
	MdListModule,
	MdInputModule,
	MdButtonModule,
	MdSelectModule,
	MdProgressBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ResultsComponent} from './locations/google-map/results-gmap.component';
import {CreateAccountComponent} from './user/create-account/create-account.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {NguiMapModule} from '@ngui/map';
import { SampleUploadComponent } from './sample/sample-upload/sample-upload.component';
import { SampleViewComponent } from './sample/sample-view/sample-view.component';
import { SampleEditComponent } from './sample/sample-edit/sample-edit.component';
import {SampleLocationTableComponent} from "./sample-location-table/sample-location-table.component";
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./auth/auth.guard";
import { AngularEchartsModule } from 'ngx-echarts';
import { ChangePasswordComponent } from './user/change-password/change-password.component';

const routes:Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'account', component: CreateAccountComponent, canActivate: [AuthGuard]},
  {path: 'locations', component: SampleLocationTableComponent, canActivate: [AuthGuard]},
  {path: 'results', component: ResultsComponent, canActivate: [AuthGuard]},
  {path: 'sample/upload', component: SampleUploadComponent, canActivate: [AuthGuard]},
  {path: 'sample/view/:id', component: SampleViewComponent, canActivate: [AuthGuard]},
  {path: 'sample/edit/:id', component: SampleEditComponent, canActivate: [AuthGuard]},
    /* Admin Routes */
  {path: 'admin/create-account', component: CreateAccountComponent, canActivate: [AuthGuard]},
  {path: '**', component: HomeComponent, canActivate: [AuthGuard]}
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CreateAccountComponent,
        ResultsComponent,
        SampleLocationTableComponent,
        SidenavComponent,
        SampleUploadComponent,
        SampleViewComponent,
        SampleEditComponent,
        LoginComponent,
        ChangePasswordComponent,
    ],
    imports: [
        MdInputModule,
        AngularEchartsModule,
        MdSidenavModule,
		MdCardModule,
		MdMenuModule,
		MdSnackBarModule,
		MdToolbarModule,
		MdSidenavModule,
		MdListModule,
		MdInputModule,
		MdButtonModule,
		MdSelectModule,
		MdProgressBarModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        NgxDatatableModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes, {useHash: false}),
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyA8acwCuestYr1vo1mJK-QdkZ-3AwW1blM'}),
    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
