import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../_services/api.service";
import CustomStore from 'devextreme/data/custom_store';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    contentHeader: any
    dataSource: any

    constructor(private api: ApiService) {
        this.dataSource = this.api.devx('_id', 'user')
    }

    ngOnInit(): void {
        this.contentHeader = {
            headerTitle: 'MENU.KAPO.USERS',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'MENU.KAPO.SECTION',
                        isLink: false,
                        link: '/'
                    },
                    {
                        name: 'MENU.KAPO.USERS',
                        isLink: false
                    }
                ]
            }
        };
    }
}
