import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routePrefix = 'https://api.github.com';
const routes = {
  users: '/users',
  locationQuery: '?location=',
};

@Injectable()
export class UsersApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(username: string): Observable<any> {
    return this.httpClient.get(routePrefix + routes.users + `/${username}`);
  }

  getUsersByLocation(location: string): Observable<any> {
    return this.httpClient.get(
      routePrefix + routes.users + routes.locationQuery + location
    );
  }
}