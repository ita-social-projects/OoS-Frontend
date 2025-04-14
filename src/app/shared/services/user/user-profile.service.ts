import { Injectable } from '@angular/core';
import { Role } from 'shared/enum/role';
import { Observable } from 'rxjs';
import { ParentService } from '../parent/parent.service';
import { ProviderService } from '../provider/provider.service';
import { EmployeeService } from '../employee/employee.service';
import { MinistryAdminService } from '../ministry-admin/ministry-admin.service';
import { RegionAdminService } from '../region-admin/region-admin.service';
import { AreaAdminService } from '../area-admin/area-admin.service';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(
    private parentService: ParentService,
    private providerService: ProviderService,
    private employeeService: EmployeeService,
    private ministryAdminService: MinistryAdminService,
    private regionAdminService: RegionAdminService,
    private areaAdminService: AreaAdminService
  ) {}

  /**
   * Returns the corresponding state key based on the user's role
   * @param role The user's role
   * @returns The state key
   */
  public getStateKeyByRole(role: Role): string {
    const roleStateMap: Record<Role, string> = {
      [Role.parent]: 'parent',
      [Role.provider]: 'provider',
      [Role.employee]: 'employee',
      [Role.ministryAdmin]: 'ministryAdmin',
      [Role.regionAdmin]: 'regionAdmin',
      [Role.areaAdmin]: 'areaAdmin',
      [Role.all]: 'all',
      [Role.unauthorized]: 'unauthorized',
      [Role.providerDeputy]: 'providerDeputy',
      [Role.techAdmin]: 'techAdmin'
    };

    return roleStateMap[role] || '';
  }

  /**
   * Returns the corresponding profile observable based on the user's role
   * @param role The user's role
   * @param userId The user's id
   * @returns The profile observable
   */
  public getProfileObservableByRole(role: Role, userId: string): Observable<any> | null {
    const roleServiceMap: Record<Role, Observable<any>> = {
      [Role.parent]: this.parentService.getProfile(),
      [Role.provider]: this.providerService.getProfile(),
      [Role.providerDeputy]: this.employeeService.getEmployeeById(userId),
      [Role.employee]: this.employeeService.getEmployeeById(userId),
      [Role.ministryAdmin]: this.ministryAdminService.getAdminProfile(),
      [Role.regionAdmin]: this.regionAdminService.getAdminProfile(),
      [Role.areaAdmin]: this.areaAdminService.getAdminProfile(),
      [Role.all]: new Observable<any>(),
      [Role.unauthorized]: new Observable<any>(),
      [Role.techAdmin]: new Observable<any>()
    };

    return roleServiceMap[role] || null;
  }
}
