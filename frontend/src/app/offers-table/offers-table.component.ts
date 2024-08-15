import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
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
  dataTable: any;
  dataFetched: any;
  _filter: string = "";

  url = "http://localhost:3000/rows"

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