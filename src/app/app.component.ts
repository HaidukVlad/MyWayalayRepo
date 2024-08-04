import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationPartComponent } from './registration-part/registration-part.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegistrationPartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'registrationWindow';
}
