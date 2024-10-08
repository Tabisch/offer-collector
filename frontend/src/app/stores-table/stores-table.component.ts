import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

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
    MatCheckboxModule,
    MatButtonModule,
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
    this.filterData()
  }

  title = 'stores-table';
  dataTable: any[];
  dataFetched: any;
  _namefilter: string = "";
  _zip = "";
  latitude = 0;
  longitude = 0;
  radius = 5000;

  displayedColumns: string[] = ['name', 'group', 'zipCode', 'city', 'street', 'website', 'selected'];

  url = "/api/stores"

  ngOnInit(): void {
    this.getPosition().subscribe(pos => {
      console.log(pos);
      this.latitude = pos.coords.latitude
      this.longitude = pos.coords.longitude
    });
  }

  constructor() {
    this.dataFetched = [];
    this.dataTable = [];
  }

  async fetchData() {
    this.dataFetched = await (await fetch(`${this.url}?latitude=${this.latitude}&longitude=${this.longitude}&radius=${this.radius}`)).json()
    this.dataTable = this.dataFetched
  }

  async filterData() {
    let filter = this._namefilter.toLocaleLowerCase()

    this.dataTable = this.dataFetched.filter((offer: any) => ((offer.name.toLowerCase().includes(filter)) && (offer.zipCode.includes(this._zip))))
  }

  onChange(event: any) {
    console.log('onChange:' + JSON.stringify(event));
  }

  update(checked: boolean, element: any) {
    console.log(`${checked} - ${element.name}`)

    fetch("/api/setStoreSelectedState", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        group: element.group,
        targetApiIdentifier: element.targetApiIdentifier,
        selected: checked
      })
    })
  }

  getPosition(): Observable<any> {
    return Observable.create((observer: any) => {
      window.navigator.geolocation.getCurrentPosition(position => {
        observer.next(position);
        observer.complete();
      },
        error => observer.error(error));
    });
  }
}
