import { Component, OnInit,OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Role } from 'src/app/shared/enum/role';
import { Nav } from 'src/app/shared/models/navigation.model';
import { User } from 'src/app/shared/models/user.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';

enum RoleLinks {
  provider = 'ОРГАНІЗАЦІЮ',
  parent = 'ДИТИНУ'
}

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss']
})

export class PersonalCabinetComponent implements OnInit,OnDestroy {

  roles = RoleLinks;
  userRole: string;

  constructor(private store: Store) { }

  /**
    * This method create new Navigation button
    */
  creatNavPath(name:string, isActive:boolean, disable:boolean): Nav[] {
    return [
      {name:'Головна', path:'/', isActive:true, disable:false},
      {name:name, isActive:isActive, disable:disable}
    ]
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.userRole = this.store.selectSnapshot<User>(RegistrationState.user).role;
    this.store.dispatch(new AddNavPath(this.creatNavPath("Кабінет користувача",false,true)))
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
