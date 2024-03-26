import { JwtPayload } from 'jwt-decode';
import { Role } from 'shared/enum/role';
import { Subrole } from './../enum/role';

export interface TokenPayload extends JwtPayload {
  subrole: Subrole;
  role: Role;
}
