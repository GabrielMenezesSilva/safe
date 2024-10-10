import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient } from "@angular/common/http";
import { provideFirebaseApp } from "@angular/fire/app";
import { provideDatabase } from "@angular/fire/database";
import { initializeApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getDatabase } from "@angular/fire/database";
import { environment } from "../environments/environment";
import { provideIonicAngular } from '@ionic/angular/standalone';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideAnimationsAsync(), provideIonicAngular({}),
  ],
};
