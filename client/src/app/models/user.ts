import { Role } from "../helpers/RoleEnum";

export interface User {
  aId: number,
  address: string,
  doB: Date,
  email: string,
  identityCard: string,
  name: string,
  password: string,
  phone: string,
  point: number,
  role: Role,
}
