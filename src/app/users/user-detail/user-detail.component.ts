import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { zip, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UsersApiService } from '../users.api.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
    username: string;
    user: any;
    isLoading: boolean;
    isLoadingAdditional: boolean;
    isProfile: boolean;
    repos = new Array<any>();
    followers = new Array<any>();
    issues = new Array<any>();
    issuesCount: number;
    displayedReposColumns: string[] = ['name', 'description', 'created'];
    displayedFollowersColumns: string[] = ['avatar_url', 'login', 'type'];
    displayedIssuesColumns: string[] = ['title', 'link'];
    subscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private usersApiService: UsersApiService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.subscription = this.route.params.subscribe(params => {
            this.isLoading = true;
            if (params && params.username) {
                this.loadAnonymousUser(params.username);
            } else {
                this.loadSignedUser();
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onFollowerClick(user): void {
        this.router.navigate([`/user/${user.login}`]);
    }

    onReposPageChange(event): void {
        this.usersApiService.getUserPublicRepos(this.username, event.pageIndex + 1, event.pageSize).subscribe(
            response => {
                this.repos = response;
            },
            error => {
                this.openErrorMsg('Something went wrong');
            }
        );
    }

    onFollowersPageChange(event): void {
        this.usersApiService.getUserFollowers(this.username, event.pageIndex + 1, event.pageSize).subscribe(
            response => {
                this.followers = response;
            },
            error => {
                this.openErrorMsg('Something went wrong');
            }
        );
    }

    onIssuesPageChange(event): void {
        this.usersApiService.getUserIssues(this.username, event.pageIndex + 1, event.pageSize).subscribe(
            response => {
                this.issues = response.items;
            },
            error => {
                this.openErrorMsg('Something went wrong');
            }
        );
    }

    private openErrorMsg(message: string): void {
        this._snackBar.open(message);
    }

    private loadAnonymousUser(username: string): void {
        this.isProfile = false;
        this.username = username;
        this.usersApiService
            .getUserByUsername(this.username)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(
                response => {
                    this.user = response;
                    this.getAdditionalInfo();
                },
                error => {
                    this.openErrorMsg('Something went wrong');
                }
            );
    }

    private loadSignedUser(): void {
        this.isProfile = true;
        this.usersApiService
            .getAuthUser()
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(
                response => {
                    this.user = response;
                    this.username = response.login;
                    this.getAdditionalInfo();
                },
                error => {
                    this.router.navigate(['/users']);
                }
            );
    }

    private getAdditionalInfo(): void {
        this.isLoadingAdditional = true;
        const zippedApis = [
            this.usersApiService.getUserPublicRepos(this.username, 1, 10),
            this.usersApiService.getUserFollowers(this.username, 1, 10)
        ];
        if (this.isProfile) {
            zippedApis.push(this.usersApiService.getUserIssues(this.username, 1, 10));
        }
        zip(...zippedApis).subscribe(
            ([repos, followers, issues]) => {
                this.repos = repos;
                this.followers = followers;
                if (issues) {
                    this.issuesCount = issues.total_count;
                    this.issues = issues.items;
                }
                this.isLoadingAdditional = false;
            },
            error => {
                this.openErrorMsg('Something went wrong');
            }
        );
    }
}
