import { Component, OnInit } from '@angular/core';
import { ApiLocationService } from '../results/api.location.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sample-Location-table',
  providers: [ApiLocationService],
  templateUrl: './sample-Location-table.component.html',
  styleUrls: ['./sample-Location-table.component.css']
})

export class SampleLocationTableComponent implements OnInit {

  private apiLocationService: ApiLocationService;
  location : Location;
  router : Router;

  rows = [];

  columns = [
    { name: 'code' },
    { prop: 'latitude' },
    { prop: 'longitude'},
    { name: 'description'}
  ];

  selected = [];

  constructor(apiLocationService: ApiLocationService, router:Router) {
    this.apiLocationService = apiLocationService;
    this.router = router;
  }

  ngOnInit() {
    this.apiLocationService.getAllLocations().subscribe(locations => {
      console.log(locations);
      this.rows = locations;
    })
  }

    onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);
        this.router.navigate(['results/results-graphs/', selected[0].id])
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }

}
