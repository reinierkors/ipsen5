import {Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Waterscan';

  constructor(public router: Router) {}

  toLogin() {
      this.router.navigate(['/login'])
    }
}

