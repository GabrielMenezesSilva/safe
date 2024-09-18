import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateChatComponent } from "./components/create-chat/create-chat.component";
import { CreateUserComponent } from "./components/create-user/create-user.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';  
import { NavbarComponent } from './navbar/navbar.component';
import { IonRouterOutlet, IonSplitPane, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonButtons, IonMenu, MenuController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonButtons, IonList, IonContent, IonTitle, IonToolbar, IonHeader, IonSplitPane, IonRouterOutlet, IonMenu, 
    CommonModule,  
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
    RouterOutlet,
    CreateChatComponent,
    CreateUserComponent,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SMSNomades';

  constructor(private menu: MenuController, public authService: AuthService) {}

  closeMenu() {
    this.menu.close();
  }
}
