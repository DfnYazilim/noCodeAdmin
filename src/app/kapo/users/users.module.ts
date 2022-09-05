import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import {DxDataGridModule} from "devextreme-angular";
import {TranslateModule} from "@ngx-translate/core";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";


@NgModule({
  declarations: [
    UsersComponent
  ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        DxDataGridModule,
        TranslateModule,
        ContentHeaderModule
    ]
})
export class UsersModule { }
