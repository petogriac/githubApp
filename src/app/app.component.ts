import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { UsersApiService } from './users/users.api.service';

export interface IAuthUser {
    authenticated: boolean;
    name: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'githubApp';
    authUser: IAuthUser = {
        name: null,
        authenticated: false
    };
    subscription: Subscription;
    isLoading = true;

    constructor(private authService: AuthService, private usersApiService: UsersApiService) {}

    ngOnInit(): void {
        this.subscription = this.authService.authUser.subscribe(response => {
            this.authUser = response;
            this.isLoading = false;
        });
        this.usersApiService.getAuthUser().subscribe(
            response => {},
            error => {
                this.authService.signOut();
            }
        );
    }

    login(): void {
        this.authService.signIn();
    }

    logout(): void {
        this.authService.signOut();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
