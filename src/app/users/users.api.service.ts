import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const routePrefix = 'https://api.github.com';
const routes = {
    users: '/users',
    user: '/user',
    repos: '/repos',
    followers: '/followers',
    issues: '/issues',
    search: '/search'
};

const httpOpptionsForHigherRate = {
    headers: new HttpHeaders({
        Authorization: `Basic ${btoa('6cf1f2386fbb4db47e08:524e60c7f3e9e296ac228ef0b93d55ba6ca3be1e')}`
    })
};

@Injectable()
export class UsersApiService {
    constructor(private httpClient: HttpClient, private authService: AuthService) {}

    getAuthUser(): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.authService.token}`
            })
        };
        return this.httpClient.get(routePrefix + routes.user, httpOptions);
    }

    getUserByUsername(username: string): Observable<any> {
        return this.httpClient.get(routePrefix + routes.users + `/${username}`, httpOpptionsForHigherRate);
    }

    getUserPublicRepos(username: string, pageNumber: number, perPage: number): Observable<any> {
        return this.httpClient.get(
            routePrefix + routes.users + `/${username}` + routes.repos + `?page=${pageNumber}&per_page=${perPage}`,
            httpOpptionsForHigherRate
        );
    }

    getUserFollowers(username: string, pageNumber: number, perPage: number): Observable<any> {
        return this.httpClient.get(
            routePrefix + routes.users + `/${username}` + routes.followers + `?page=${pageNumber}&per_page=${perPage}`,
            httpOpptionsForHigherRate
        );
    }

    getUserIssues(username: string, pageNumber: number, perPage: number): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.authService.token}`
            })
        };
        const query = `?q=user:${username}&type:issue?page=${pageNumber}&per_page=${perPage}`;

        return this.httpClient.get(routePrefix + routes.search + routes.issues + query, httpOptions);
    }

    getUsersByLocation(location: string, sortType: string, pageNumber: number, perPage: number): Observable<any> {
        const query = `?q=location:${
            location ? location : undefined
        }&sort=${sortType}&page=${pageNumber}&per_page=${perPage}`;

        return this.httpClient.get(routePrefix + routes.search + routes.users + query, httpOpptionsForHigherRate);
    }
}
