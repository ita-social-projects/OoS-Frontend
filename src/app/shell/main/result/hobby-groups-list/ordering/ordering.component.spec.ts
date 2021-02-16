// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { NgxsModule, Store } from '@ngxs/store';

// import { OrderingComponent } from './ordering.component';
// import { Injectable } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FilterState } from 'src/app/shared/store/filter.state';

// describe('OrderingComponent', () => {
//   let component: OrderingComponent;
//   let fixture: ComponentFixture<OrderingComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ 
//         OrderingComponent 
//       ],
//       imports: [
//         MatButtonModule,
//         MatIconModule,
//         CommonModule,
//         NgxsModule.forRoot([FilterState])
//       ],
//       providers: [
//         {provide: Store, useClass: MockStore}
//       ]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(OrderingComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
// @Injectable({
//     providedIn: 'root'
//   })
//   class MockStore{} 