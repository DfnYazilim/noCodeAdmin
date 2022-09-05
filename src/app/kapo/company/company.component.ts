import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../_services/api.service";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  contentHeader: any
  dataSource: any

  constructor(private api: ApiService) {
    this.dataSource = this.api.devx('_id', 'apps')
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'MENU.KAPO.COMPANY',
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
            name: 'MENU.KAPO.COMPANY',
            isLink: false
          }
        ]
      }
    };
  }

}
