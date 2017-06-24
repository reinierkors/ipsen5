import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiLocationService} from '../locations/api.location.service';
import {ApiWaterschapService} from '../waterschap/api.waterschap.service';
import {ApiTaxonService} from "../taxon/api.taxon.service";
import {DatatableComponent} from "@swimlane/ngx-datatable";

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
    private selected = 0;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    locations = [];
    locationRows = [];
    locationColumns = [
        {name: 'Mp', prop: 'code'},
        {name: 'Naam', prop: 'description'}];

    waterschappen = [];
    waterschapRows = [];
    waterschapColumns = [
        {name: 'Naam', prop: 'name'},
        {name: 'Adres', prop: 'address'},
        {name: 'Huisnummer', prop: 'houseNumber'},
        {name: 'Postcode', prop: 'zipCode'},
        {name: 'Locatie', prop: 'location'},
        {name: 'Telefoonnummer', prop: 'phoneNumber'}];

    taxa = [];
    taxonRows = [];
    taxonColumns = [
        {name: 'Naam', prop: 'name'}];

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
            this.taxonRows = taxa;
            this.taxa = taxa;
        })
    }

    onSelect(selected) {
        this.selected = selected.row.id;
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
        this.taxonRows = taxaFiltered;

        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }
}
