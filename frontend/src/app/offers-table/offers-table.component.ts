import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
  ],
  selector: 'app-root',
  templateUrl: './offers-table.component.html',
  styleUrl: './offers-table.component.css',
})
export class OffersTableComponent implements OnInit {
  @Input() set filter(val: string) {
    this._filter = val
    this.filterData()
  }

  title = 'offer-table';
  dataTable: any[] = ["product"];
  dataFetched: any;
  _filter: string = "";

  displayedColumns: string[] = ['product', 'seller', 'price', 'startDateTime', 'endDateTime','website'];

  url = "/api/rows"

  ngOnInit(): void {
    this.fetchData()
  }

  constructor() {
    this.dataTable = [];
  }

  async fetchData() {
    this.dataFetched = await (await fetch(this.url)).json()
    this.dataTable = this.dataFetched
  }

  async filterData() {
    let filter = this._filter.toLocaleLowerCase()

    this.dataTable = this.dataFetched.filter((offer: any) => (offer.seller.toLowerCase().includes(filter) || offer.product.toLowerCase().includes(filter)))
  }

  onChange(event:any) {
    console.log('onChange:' + JSON.stringify(event));
  }
}