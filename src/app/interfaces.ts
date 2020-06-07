export interface Roles {
  guest?: boolean;
  admin?: boolean;
}

export interface mUser {
  uid: string;
  email: string;
  roles: Roles;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}
