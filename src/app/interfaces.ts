import {MatSnackBar} from '@angular/material/snack-bar';

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
  uid?: string,
  questionId: string,
  text: string,
  isSolution: boolean,
  date: Date,
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
  'NodeJS' = 'Node JS',
  'PHP' = 'PHP',
  'VisualForce' = 'VisualForce',
  'Aura' = 'Aura Components',
  'Apex' = 'Apex',
  'LWC' = 'LWC',
  'Firebase' = 'Firebase',
  'MongoDB' = 'Mongo DB',
  'HTML5' = 'HTML 5',
  'CSS3' = 'CSS3',
  'Salesforce' = 'Salesforce'
}

export function cateGoryList() : Array<string> {
  return Object.keys(Categories).map(item =>{ return Categories[item]}).sort()
}

export class UserMessage {
  constructor( private _snackBar: MatSnackBar,) {
  }

  showMsg(msg: string, type: string = 'Success'){
    this._snackBar.open(msg, type, {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    })
  }
}
