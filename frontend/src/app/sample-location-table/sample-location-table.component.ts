import {Component, OnInit} from '@angular/core';
import {ApiLocationService} from '../locations/api.location.service';
import {ApiWaterschapService} from '../waterschap/api.waterschap.service';
import {Router} from "@angular/router";
import {ApiSpeciesService} from "../species/api.species.service";

@Component({
    selector: 'app-sample-Location-table',
    providers: [ApiLocationService, ApiWaterschapService, ApiSpeciesService],
    templateUrl: './sample-Location-table.component.html',
    styleUrls: ['./sample-Location-table.component.css']
})

export class SampleLocationTableComponent implements OnInit {

    private apiLocationService: ApiLocationService;
    private apiWaterschap: ApiWaterschapService;
    private router: Router;

    private apiSpecies: ApiSpeciesService;

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
    speciesRows = [];
    speciesColumns = [
        {name: 'Naam', prop: 'name'}];

    selected = [];

    constructor(apiLocationService: ApiLocationService, apiWaterschap: ApiWaterschapService,
                apiSpecies: ApiSpeciesService, router:Router) {
        this.apiLocationService = apiLocationService;
        this.apiWaterschap = apiWaterschap;
        this.apiSpecies = apiSpecies;
        this.router = router;

    }

    ngOnInit() {
        this.apiLocationService.getAllLocations().subscribe(locations => {
            this.locationRows = locations;
        });
        this.apiWaterschap.getAll().subscribe(waterschappen => {
            this.waterschapRows = waterschappen;
        });
        this.apiSpecies.getAll().subscribe(species => {
            this.speciesRows = species;
        })
    }

    onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);
        this.router.navigate(['WatersComponent', selected[0].id])
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }
}
