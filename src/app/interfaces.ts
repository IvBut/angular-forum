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

export interface Author {
  authorId: string;
  authorName: string;
  authorPhoto: string;
}

export interface Comment {
  uid: string,
  questionId: string,
  text: string,
  isSolution: boolean,
  author: Author
}

export interface Question {
  uid?: string,
  title: string,
  author: Author,
  date: Date,
  text: string,
  onModeration: boolean,
  isResolved: boolean,
  categories: Array<string>
}

export enum Categories {
  TypeScript = 'TypeScript',
  Java = 'Java',
  Angular = 'Angular',
  React = 'React',
  JavaScript = 'JavaScript',
  CSharp = 'C#',
}

export function cateGoryList() : Array<string> {
  return Object.keys(Categories).map(item =>{ return Categories[item]})
}
