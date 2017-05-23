import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample-location-table',
  templateUrl: './sample-location-table.component.html',
  styleUrls: ['./sample-location-table.component.css']
})
export class SampleLocationTableComponent implements OnInit {

  rows = [];

  columns = [
    { name: 'code' },
    { name: 'waterschap' },
    { prop: 'long' },
    { prop: 'lat'}
  ];

  constructor() {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/sampleLocations.json`);

    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };

    req.send();
  }

  ngOnInit() {
  }

}
