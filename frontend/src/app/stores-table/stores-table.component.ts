import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-stores-table',
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
  templateUrl: './stores-table.component.html',
  styleUrl: './stores-table.component.css'
})
export class StoresTableComponent {
  @Input() set nameFilter(val: string) {
    this._namefilter = val
    this.filterData()
  }

  @Input() set zipFilter(val: string) {
    this._zip = val
    console.log(val)
    this.filterData()
  }

  title = 'stores-table';
  dataTable: any[] = ["product"];
  dataFetched: any;
  _namefilter: string = "";
  _zip = ""

  displayedColumns: string[] = ['name', 'group', 'zipCode', 'city', 'street', 'website', 'selected'];

  url = "/api/stores"

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
    let filter = this._namefilter.toLocaleLowerCase()

    this.dataTable = this.dataFetched.filter((offer: any) => (offer.name.toLowerCase().includes(filter)) && (offer.zipCode.includes(this._zip)))
  }

  onChange(event: any) {
    console.log('onChange:' + JSON.stringify(event));
  }
}
