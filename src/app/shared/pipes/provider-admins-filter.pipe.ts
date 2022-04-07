import { Pipe, PipeTransform } from '@angular/core';
import { providerAdminRole } from '../enum/provider-admin';
import { ProviderAdminTable } from '../models/providerAdmin.model';

@Pipe({
  name: 'providerAdminsFilter'
})
export class ProviderAdminsFilterPipe implements PipeTransform {

  transform(users: ProviderAdminTable[], userType: string): ProviderAdminTable[] {
    const isDeputy = userType === providerAdminRole.deputy;
    return users.filter((user) => (user.isDeputy === isDeputy));
  }

}
