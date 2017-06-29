import {ViewChild,Component,HostListener,OnInit} from "@angular/core";
import { Location } from "@angular/common";
import {Router} from "@angular/router";
import { MdSidenav } from "@angular/material";
import {AuthenticationService} from "./services/auth.service";

@Component({
	selector: 'app-root',
	providers: [AuthenticationService],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	@ViewChild('sidenav') sidenav: MdSidenav;
	title = 'Waterscan';
	loggedIn;

	constructor(public router: Router, private location: Location, private authenticationService: AuthenticationService) {
		this.router.events.subscribe(() => {
			this.loggedIn = !(localStorage.getItem('currentUser') === null);
		});
	}

	toLogin() {
		this.router.navigate(['/login']);
	}

	toLogout() {
		this.authenticationService.logout()
			.subscribe(() => {
				this.router.navigate(['/login']);
			});
	}

	ngOnInit() {
		if (window.innerWidth < 768) {
			this.sidenav.close();
		} else {
			this.sidenav.open();
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (event.target.innerWidth < 768) {
			this.sidenav.close();
		} else {
			this.sidenav.open();
		}
	}

	goBack() {
		this.location.back()
	}
}

