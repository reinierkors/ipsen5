import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-navigatie',
  templateUrl: './sidenav.component.html',
  providers: [AuthenticationService],
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

}
