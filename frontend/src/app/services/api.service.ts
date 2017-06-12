import {Inject} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

//Offers generic methods for communication with the API
//Parts of the application should create their own api service that extends this class
export abstract class ApiService {
	private http:Http;
	private static authHeaders = {};
	//TODO read from config
	public apiUri = 'http://127.0.0.1:8080/api';
	
	constructor(http:Http){
		this.http = http;
	}
	
	//Turns the json string that came from the API into an object
	private transformResult(res:Response,observer){
		observer.next(res.json());
	}
	
	//Turns any errors that come from the server into an object
	private transformError(res:Response,observer){
		if(res.json)
			observer.error(res.json());
		else
			observer.error(res);
	}
	
	//Add authorization header to every api call
	protected static addToAuthHeaders(headerType: string, value: string){
        ApiService.authHeaders[headerType] = value;
    }
	
	//Returns a Header object to be used in an http request
	private getHeaderObject():Headers{
		let headers = new Headers();
		for(let key in ApiService.authHeaders){
		    headers.append(key,ApiService.authHeaders[key]);
        }
		return headers;
	}
	
	//Do a GET request to the given path
	protected get(path:string):Observable<any>{
		path = this.apiUri+path;
		var headers = this.getHeaderObject();
		return Observable.create(observer => {
			this.http.get(path,{headers:headers})
				.subscribe(res=>this.transformResult(res,observer), err=>this.transformError(err,observer), ()=>observer.complete());
		});
	}
	
	//Do a POST request to the given path
	//Data is converted to JSON and sent along
	protected post(path:string,data):Observable<any>{
		path = this.apiUri+path;
		var headers = this.getHeaderObject();
		headers.append('Content-Type','application/json');
		return Observable.create(observer => {
			this.http.post(path,JSON.stringify(data),{headers:headers})
				.subscribe(res=>this.transformResult(res,observer), err=>this.transformError(err,observer), ()=>observer.complete());
		});
	}
	
	//Retrieve the value of a cookie
	protected getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	}
}
