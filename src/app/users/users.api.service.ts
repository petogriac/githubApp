import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routePrefix = 'https://api.github.com';
const routes = {
  users: '/users',
  repos: '/repos',
  followers: '/followers',
  locationQuery: '?location=',
};

@Injectable()
export class UsersApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(username: string): Observable<any> {
    return this.httpClient.get(routePrefix + routes.users + `/${username}`);
  }

  getUserPublicRepos(username: string): Observable<any> {
    return this.httpClient.get(
      routePrefix + routes.users + `/${username}` + routes.repos
    );
  }

  getUserFollowers(username: string): Observable<any> {
    return this.httpClient.get(
      routePrefix + routes.users + `/${username}` + routes.followers
    );
  }

  getUsersByLocation(location: string, pageNumber: string): Observable<any> {
    // return this.httpClient.get(
    //   routePrefix + routes.users + routes.locationQuery + location
    // );
    return this.httpClient.get(
      routePrefix +
        `/search/users?q=location:${
          location ? location : undefined
        }&page=${pageNumber}&per_page=10`
    );
  }
}
