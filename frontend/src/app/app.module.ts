import 'hammerjs';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {Routes, RouterModule} from '@angular/router';
import {
	MaterialModule,
	MdCardModule,
	MdMenuModule,
	MdSnackBarModule,
	MdToolbarModule,
	MdSidenavModule,
	MdListModule,
	MdGridListModule,
	MdInputModule,
	MdButtonModule,
	MdSelectModule,
	MdProgressBarModule,
	MdProgressSpinnerModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {GMapsComponent} from './locations/google-map/results-gmap.component';
import {CreateAccountComponent} from './user/create-account/create-account.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {NguiMapModule} from '@ngui/map';
import {SampleUploadComponent} from './sample/sample-upload/sample-upload.component';
import {SampleViewComponent} from './sample/sample-view/sample-view.component';
import {SampleEditComponent} from './sample/sample-edit/sample-edit.component';
import {SampleLocationTableComponent} from "./sample-location-table/sample-location-table.component";
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./auth/auth.guard";
import { WewUploadComponent } from './wew/wew-upload/wew-upload.component';
import { AngularEchartsModule } from 'ngx-echarts';
import { EditAccountComponent } from './user/edit-account/edit-account.component';
import { TaxonImportStructureComponent } from './taxon/taxon-import-structure/taxon-import-structure.component';
import { TaxonTreeComponent } from './taxon/taxon-tree/taxon-tree.component';
import { TaxonViewComponent } from './taxon/taxon-view/taxon-view.component';
import {SampleFactorBarGraphComponent} from "./sample/sample-factor-bar-graph/sample-factor-bar-graph.component";
import { WatersComponent } from "./results/water/waters.component";
import { TaxonManageGroupsComponent,TaxonManageGroupsEditComponent } from './taxon/taxon-manage-groups/taxon-manage-groups.component';
import { CompareComponent } from './compare/compare.component';

const routes:Routes = [
	{path: '', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'home', component: HomeComponent},
	{path: 'map', component: GMapsComponent, canActivate: [AuthGuard]},
	{path: 'account', component: EditAccountComponent, canActivate: [AuthGuard]},
	{path: 'results/water/:id', component: WatersComponent, canActivate: [AuthGuard]},
	{path: 'data', component: SampleLocationTableComponent, canActivate: [AuthGuard]},
	{path: 'sample/upload', component: SampleUploadComponent, canActivate: [AuthGuard]},
	{path: 'sample/view/:id', component: SampleViewComponent, canActivate: [AuthGuard]},
	{path: 'sample/edit/:id', component: SampleEditComponent, canActivate: [AuthGuard]},
    {path: 'taxon/view/:id', component: TaxonViewComponent, canActivate: [AuthGuard]},
    {path: 'compare', component: CompareComponent, canActivate: [AuthGuard]},
	/* Admin Routes */
	{path: 'taxon/import', component: TaxonImportStructureComponent, canActivate: [AuthGuard]},
	{path: 'taxon/group', component: TaxonManageGroupsComponent, canActivate: [AuthGuard]},
	{path: 'wew/upload', component: WewUploadComponent, canActivate: [AuthGuard]},
	{path: 'admin/create-account', component: CreateAccountComponent, canActivate: [AuthGuard]},
	/* Directs back to home if route is unknown */
	{path: '**', component: HomeComponent, canActivate: [AuthGuard]}
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CreateAccountComponent,
        GMapsComponent,
        SampleLocationTableComponent,
        SidenavComponent,
        SampleUploadComponent,
        SampleViewComponent,
        SampleEditComponent,
		SampleFactorBarGraphComponent,
        WatersComponent,
        LoginComponent,
        EditAccountComponent,
        WewUploadComponent,
        TaxonImportStructureComponent,
        TaxonTreeComponent,
        TaxonViewComponent,
        WatersComponent,
        TaxonManageGroupsComponent,
		TaxonManageGroupsEditComponent,
		CompareComponent
    ],
	entryComponents: [
		TaxonManageGroupsEditComponent
	],
    imports: [
		MaterialModule,
        AngularEchartsModule,
		MdCardModule,
		MdMenuModule,
		MdSnackBarModule,
		MdToolbarModule,
		MdSidenavModule,
		MdListModule,
		MdGridListModule,
		MdInputModule,
		MdButtonModule,
		MdSelectModule,
		MdProgressBarModule,
		MdProgressSpinnerModule,
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
