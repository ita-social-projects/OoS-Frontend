import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Address } from 'shared/models/address.model';
import { MaterialModule } from 'shared/modules/material.module';
import { ContactsCardComponent } from './contacts.component';

describe('ContactsComponent', () => {
  let component: ContactsCardComponent;
  let fixture: ComponentFixture<ContactsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule, TranslateModule.forRoot()],
      declarations: [ContactsCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsCardComponent);
    component = fixture.componentInstance;
    component.address = { codeficatorAddressDto: {} } as Address;
    component.contactsData = {} as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
