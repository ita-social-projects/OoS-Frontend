import { Pipe, PipeTransform } from '@angular/core';
import { providerAdminRoleUkr, providerAdminRoleUkrReverse } from '../enum/enumUA/provider-admin';
import { ProviderAdminRole } from '../enum/provider-admin';
import { ProviderAdminTable } from '../models/providerAdmin.model';

@Pipe({
  name: 'providerAdminsFilter'
})
export class ProviderAdminsFilterPipe implements PipeTransform {
  transform(users: ProviderAdminTable[], role: string): ProviderAdminTable[] {
    return users.filter((user) => user.role === providerAdminRoleUkr[role]);
  }
}
