import { Component, OnInit } from '@angular/core';
import { ApiLocationService } from '../locations/api.location.service';

@Component({
  selector: 'app-sample-Location-table',
  providers: [ApiLocationService],
  templateUrl: './sample-Location-table.component.html',
  styleUrls: ['./sample-Location-table.component.css']
})

export class SampleLocationTableComponent implements OnInit {

  private apiLocationService: ApiLocationService;

  rows = [];

  columns = [
    { name: 'code' },
    { name: 'description' },
    { prop: 'latitude' },
    { prop: 'longitude'}
  ];

  constructor(apiLocationService: ApiLocationService) {
    this.apiLocationService = apiLocationService;
  }

  ngOnInit() {
    this.apiLocationService.getAllLocations().subscribe(locations => {
      this.rows = locations;
    })
  }

}
