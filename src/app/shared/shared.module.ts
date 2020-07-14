import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule, MatNavList} from '@angular/material/list';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {AuthFBService} from '../services/auth-fb.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTreeModule} from '@angular/material/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {LayoutModule} from '@angular/cdk/layout';






@NgModule({
  declarations: [],
  imports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatExpansionModule,
    MatRadioModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatAutocompleteModule,
    LayoutModule
  ],
  exports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatExpansionModule,
    MatRadioModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatAutocompleteModule,
    LayoutModule
  ],
  providers: [AuthFBService]
})
export class SharedModule {
  constructor(private library: FaIconLibrary) {
    library.addIconPacks(fas,far,fab)
  }
}
