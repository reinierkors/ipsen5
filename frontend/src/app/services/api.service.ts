import {Inject} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from './auth.service';

export abstract class ApiService {
	private http:Http;
	private authenticationService: AuthenticationService;
	//TODO read from config
	public apiUri = 'http://127.0.0.1:8080/api';
	
	constructor(http:Http, authenticationService: AuthenticationService){
		this.http = http;
		this.authenticationService = authenticationService;
	}
	
	private transformResult(res:Response,observer){
		observer.next(res.json());
	}
	
	private transformError(res:Response,observer){
		if(res.json)
			observer.error(res.json().error);
		else
			observer.error(res);
	}
	
	private getHeaderObject():Headers{
		let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
		//Mogelijkheid om auth headers hier te zetten zodat elke api call die gebruikt
		//headers.append('X-todo', ...);
		return headers;
	}
	
	protected get(path:string):Observable<any>{
		path = this.apiUri+path;
		var headers = this.getHeaderObject();
		return Observable.create(observer => {
			this.http.get(path,{headers:headers})
				.subscribe(res=>this.transformResult(res,observer), res=>this.transformError(res,observer), ()=>observer.complete());
		});
	}
	
	protected post(path:string,data):Observable<any>{
		path = this.apiUri+path;
		var headers = this.getHeaderObject();
		headers.append('Content-Type','application/json');
		return Observable.create(observer => {
			this.http.post(path,JSON.stringify(data),{headers:headers})
				.subscribe(res=>this.transformResult(res,observer), res=>this.transformError(res,observer), ()=>observer.complete());
		});
	}
}
