import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Provider } from 'src/app/shared/models/provider.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetWorkshops } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';

//TEMPORARY
const workshopMock = {
  id: 1,
  title: "Бальні танці",
  phone: "+3809000292",
  email: "workshop@gmail.com",
  minAge: 13,
  maxAge: 15,
  price: 50,
  head: "Іван Васильович",
  daysPerWeek: 3,
  description: "Клуб танців",
  rate: '4.9',
  teachers: [{
    id: 1,
    firstName: 'Марія',
    middleName: 'Іванівна',
    lastName: 'Левсько',
    description: "Тренер бальної хореографії, східних танців (belly dance),керівник напряму сучасних танців. Танцюристка міжнародного класу “S”, майстер спорту України, багаторазова Чемпіонка України та Львівщини.",
    img: "assets/images/groupimages/teacher3.png"
  }],
  address: {
    city: 'Київ',
    street: 'Хрещатик',
    buildingNumber: '1',
    id: 1
  }
}
@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit {

  @Select(AppState.allWorkshops) workshops$: Observable<Workshop[]>;
  workshop: Workshop;

  constructor(private store: Store) {
    this.store.dispatch(new GetWorkshops())
    // this.workshops$.subscribe(workshops => {
    //   this.workshop = workshops[0];
    // })
    this.workshop = workshopMock;
    // this.provider = workshopMock;
  }

  ngOnInit(): void {
  }

}
