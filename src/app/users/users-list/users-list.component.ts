import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../users.api.service';
import { zip } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  location: string;
  // TODO add interface IUser
  users = new Array<any>();
  usersDetailedData = new Array<any>();
  displayedColumns: string[] = ['avatar_url', 'login', 'repos', 'followers'];

  constructor(private usersApiService: UsersApiService) {}

  ngOnInit(): void {}

  searchUsers(): void {
    this.usersApiService.getUsersByLocation(this.location, '1').subscribe(
      (response) => {
        const apisPerUser = [];

        this.users = response.items;
        this.users.forEach((user) => {
          apisPerUser.push(this.usersApiService.getUser(user.login));
        });

        apisPerUser.forEach((apiPerUser) => {
          apiPerUser.subscribe((response) => {
            this.usersDetailedData.push(response);
          });
        });
        // zip(...apisPerUser).subscribe(
        //   (usersDetailedData) => {
        //     console.log(usersDetailedData);
        //     this.usersDetailedData = usersDetailedData;
        //   },
        //   (error) => {
        //     alert('Something went wrong');
        //   }
        // );
      },
      (error) => {
        alert('Something went wrong');
      }
    );
  }
}
