import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../users.api.service';
import { Router } from '@angular/router';
import { zip } from 'rxjs';

import IUser from '../interfaces/IUser';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  location: string;
  // TODO add interface IUser
  users = new Array<IUser>();
  usersDetailedData = new Array<any>();
  displayedColumns: string[] = ['avatar_url', 'login', 'repos', 'followers'];
  isLoading: boolean;

  constructor(
    private usersApiService: UsersApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  searchUsers(): void {
    this.isLoading = true;
    this.usersApiService.getUsersByLocation(this.location, '1').subscribe(
      (response) => {
        const apisPerUser = [];
        this.usersDetailedData = [];
        this.users = response.items;
        this.users.forEach((user) => {
          apisPerUser.push(this.usersApiService.getUserByUsername(user.login));
        });

        zip(...apisPerUser).subscribe(
          (usersDetailedData) => {
            console.log(usersDetailedData);
            this.usersDetailedData = usersDetailedData;
            this.isLoading = false;
          },
          (error) => {
            console.log(error);
            if (error.statusText === 'rate limit exceeded') {
              alert(`${error.statusText}: please sign in`);
            } else {
              alert('Something went wrong');
            }
          }
        );
      },
      (error) => {
        alert('Something went wrong');
      }
    );
  }

  onUserClick(user: IUser): void {
    this.router.navigate([`/user/${user.login}`]);
  }
}
