import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
    message = 'Message works!';

    constructor() {
    };

    printHello = function () {
        console.log("hello")
    };

    ngOnInit() {
        this.printHello()
    };
}
