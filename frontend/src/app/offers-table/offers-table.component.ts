import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
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

  displayedColumns: string[] = ['product', 'seller', 'price', 'startDateTime', 'endDateTime'];

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
    this.dataTable = this.dataFetched.filter((offer: any) => (offer.seller.includes(this._filter) || offer.product.includes(this._filter)))
  }

  onChange(event:any) {
    console.log('onChange:' + JSON.stringify(event));
  }
}