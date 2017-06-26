import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiLocationService} from '../locations/api.location.service';
import {ApiWaterschapService} from '../waterschap/api.waterschap.service';
import {Taxon,TaxonGroup} from '../taxon/taxon.model';
import {ApiTaxonService} from "../taxon/api.taxon.service";
import {DatatableComponent} from "@swimlane/ngx-datatable";

type TaxonRow = {id:number,name:string,group?:TaxonGroup};

@Component({
    selector: 'app-sample-Location-table',
    providers: [ApiLocationService, ApiWaterschapService, ApiTaxonService],
    templateUrl: './sample-Location-table.component.html',
    styleUrls: ['./sample-Location-table.component.css']
})

export class SampleLocationTableComponent implements OnInit {
	private apiLocationService: ApiLocationService;
	private apiWaterschap: ApiWaterschapService;
	private apiTaxon: ApiTaxonService;

	@ViewChild(DatatableComponent) table: DatatableComponent;

	private locations = [];
	public locationRows = [];
	public locationColumns = [
		{name: 'Mp', prop: 'code', cellTemplate:null},
		{name: 'Naam', prop: 'description', cellTemplate:null},
		{name: 'details', prop: 'button', cellTemplate:null}
	];

	@ViewChild('waterCodeTemplate') waterCodeTemplate;
	@ViewChild('waterDescriptionTemplate') waterDescriptionTemplate;
	@ViewChild('waterDetailsTemplate') waterDetailsTemplate;

	waterschappen = [];
	waterschapRows = [];
	waterschapColumns = [
		{name: 'Naam', prop: 'name'},
		{name: 'Adres', prop: 'address'},
		{name: 'Huisnummer', prop: 'houseNumber'},
		{name: 'Postcode', prop: 'zipCode'},
		{name: 'Locatie', prop: 'location'},
		{name: 'Telefoonnummer', prop: 'phoneNumber'}
	];

	private taxa:Taxon[] = [];
	public taxonRows:TaxonRow[] = [];
	public taxonColumns = [
		{name:'Naam', prop:'name', cellTemplate:null}
	];
	private groupMap:Map<number/*group id*/,TaxonGroup>;

	@ViewChild('taxonNameTemplate') taxonNameTemplate;
	
	
    constructor(apiLocationService: ApiLocationService, apiWaterschap: ApiWaterschapService,
                apiTaxon: ApiTaxonService) {
        this.apiLocationService = apiLocationService;
        this.apiWaterschap = apiWaterschap;
        this.apiTaxon = apiTaxon;
    }

    ngOnInit() {
        this.apiLocationService.getAllLocations().subscribe(locations => {
            this.locationRows = locations;
            this.locations = locations;
        });
        this.apiWaterschap.getAll().subscribe(waterschappen => {
            this.waterschapRows = waterschappen;
            this.waterschappen = waterschappen;
        });
        this.apiTaxon.getAll().subscribe(taxa => {
            this.taxa = taxa;
			this.taxonRows = taxa.map(taxon => this.toTaxonRow(taxon));
        });
		this.apiTaxon.getGroups().subscribe(groups => {
			this.groupMap = new Map();
			groups.forEach(group => this.groupMap.set(group.id,group));
		});
    }
	
	//TemplateRefs are available
	ngAfterViewInit(){
		this.taxonColumns[0].cellTemplate = this.taxonNameTemplate;
		this.locationColumns[0].cellTemplate = this.waterCodeTemplate;
		this.locationColumns[1].cellTemplate = this.waterDescriptionTemplate;
		this.locationColumns[2].cellTemplate = this.waterDetailsTemplate;
	}

    updateFilter(event) {
        const val = event.target.value.toLowerCase();
        const waterschappenFiltered = this.waterschappen.filter(function(d) {
            return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        const locationFiltered = this.locations.filter(function(d) {
            return d.description.toLowerCase().indexOf(val) !== -1 || d.code.toLowerCase().indexOf(val) !== -1 || !val;
        });

        const taxaFiltered = this.taxa.filter(function(d) {
            return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.waterschapRows = waterschappenFiltered;
        this.locationRows = locationFiltered;
        this.taxonRows = taxaFiltered.map(taxon => this.toTaxonRow(taxon));

        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }
	
	private toTaxonRow(taxon:Taxon):TaxonRow{
		let row:TaxonRow = {id:taxon.id,name:taxon.name};
		let group = this.groupMap.get(taxon.groupId);
		if(group)
			row.group = group;
		return row;
	}
}
