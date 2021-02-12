// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { CityFilterComponent } from './city-filter.component';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatIconModule } from '@angular/material/icon';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { NgxsModule, Store } from '@ngxs/store';
// import { MetaDataState } from '../../../../shared/store/meta-data.state';
// import { FilterState } from '../../../../shared/store/filter.state';
// import { CityFilterService } from '../../../../shared/filters-services/city-filter.service';
// import { Injectable } from '@angular/core';
// import { CommonModule } from '@angular/common';

// describe('CityFilterComponent', () => {
//   let component: CityFilterComponent;
//   let fixture: ComponentFixture<CityFilterComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         MatFormFieldModule,
//         MatAutocompleteModule,
//         MatIconModule,
//         ReactiveFormsModule,
//         MatInputModule,
//         CommonModule
//         //NgxsModule.forRoot([MetaDataState, FilterState]),
        
//       ],
//       declarations: [ CityFilterComponent],
//       providers:[
//         {provide: CityFilterService, useClass: MockCityFilterService},
//         {provide: Store, useClass: MockStore}
//       ]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(CityFilterComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
// @Injectable({
//   providedIn: 'root'
// })
// class MockCityFilterService{} 
// @Injectable({
//   providedIn: 'root'
// })
// class MockStore{} 