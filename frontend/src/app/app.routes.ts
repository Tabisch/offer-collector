import { Routes } from '@angular/router';
import { OffersTableComponent } from './offers-table/offers-table.component';
import { StoresTableComponent } from './stores-table/stores-table.component';

export const routes: Routes = [
    { path: 'offer-table', component: OffersTableComponent},
    { path: 'stores-table', component: StoresTableComponent }
];
