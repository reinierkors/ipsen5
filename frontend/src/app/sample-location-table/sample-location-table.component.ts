import {Component, OnInit} from '@angular/core';
import {ApiLocationService} from '../locations/api.location.service';
import {ApiWaterschapService} from '../waterschap/api.waterschap.service';
import {ApiTaxonService} from "../taxon/api.taxon.service";

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

    locationRows = [];
    locationColumns = [
        {name: 'Mp', prop: 'code'},
        {name: 'Naam', prop: 'description'}];

    waterschapRows = [];
    waterschapColumns = [
        {name: 'Naam', prop: 'name'},
        {name: 'Adres', prop: 'address'},
        {name: 'Huisnummer', prop: 'houseNumber'},
        {name: 'Postcode', prop: 'zipCode'},
        {name: 'Locatie', prop: 'location'},
        {name: 'Telefoonnummer', prop: 'phoneNumber'}];
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
        });
        this.apiWaterschap.getAll().subscribe(waterschappen => {
            this.waterschapRows = waterschappen;
        });
        this.apiTaxon.getAll().subscribe(taxa => {
            this.taxonRows = taxa;
        })
    }

    onSelect(selected) {
        console.log(selected)
        this.selected = selected.row.id;
    }
}
