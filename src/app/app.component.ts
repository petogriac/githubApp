import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { _MatTabGroupBase } from '@angular/material/tabs';

export interface IAuthUser {
    authenticated: boolean;
    name: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'githubApp';
    authUser: IAuthUser = {
        name: null,
        authenticated: false
    };
    subscription: Subscription;
    isLoading = true;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.authService.authUser.subscribe(response => {
            this.authUser = response;
            this.isLoading = false;
        });
    }

    login() {
        this.authService.signIn();
    }

    logout() {
        this.authService.signOut();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
