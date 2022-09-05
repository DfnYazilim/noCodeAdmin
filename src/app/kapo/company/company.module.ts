import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import {DxDataGridModule} from "devextreme-angular";
import {TranslateModule} from "@ngx-translate/core";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";


@NgModule({
  declarations: [
    CompanyComponent
  ],
    imports: [
        CommonModule,
        CompanyRoutingModule,
        DxDataGridModule,
        TranslateModule,
        ContentHeaderModule
    ]
})
export class CompanyModule { }
