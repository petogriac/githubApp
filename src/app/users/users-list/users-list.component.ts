import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UsersApiService } from '../users.api.service';
import { Router } from '@angular/router';
import { zip } from 'rxjs';
import IUser from '../interfaces/IUser';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
    location: string;
    users = new Array<IUser>();
    usersDetailedData = new Array<any>();
    displayedColumns: string[] = ['avatar_url', 'login', 'repos', 'followers'];
    isLoading: boolean;
    firstLoading = true;
    userTotalCount: string;
    sortType = 'repositories';

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private usersApiService: UsersApiService, private router: Router, private _snackBar: MatSnackBar) {}

    ngOnInit(): void {}

    searchUsers(pageNumber: number, perPage: number, firstSearch?: boolean): void {
        if (firstSearch) {
            this.firstLoading = true;
        }
        const apisPerUser = [];
        this.usersDetailedData = [];
        this.isLoading = true;
        this.usersApiService.getUsersByLocation(this.location, this.sortType, pageNumber, perPage).subscribe(
            response => {
                this.firstLoading = false;
                this.users = response.items;
                this.userTotalCount = response.total_count;
                if (this.users.length > 0) {
                    this.users.forEach(user => {
                        apisPerUser.push(this.usersApiService.getUserByUsername(user.login));
                    });
                } else {
                    this.isLoading = false;
                }

                zip(...apisPerUser).subscribe(
                    usersDetailedData => {
                        this.usersDetailedData = usersDetailedData;
                        this.isLoading = false;
                    },
                    error => {
                        this.openErrorMsg('Something went wrong');
                    }
                );
            },
            error => {
                this.isLoading = false;
                this.firstLoading = false;
                this.openErrorMsg('Something went wrong');
            }
        );
    }

    onSortChange(sortType: string): void {
        this.sortType = sortType;
        this.searchUsers(1, 10, true);
    }

    onUserClick(user: IUser): void {
        this.router.navigate([`/user/${user.login}`]);
    }

    onPageChange(event): void {
        this.searchUsers(event.pageIndex + 1, event.pageSize);
    }

    openErrorMsg(message: string): void {
        this._snackBar.open(message);
    }
}
