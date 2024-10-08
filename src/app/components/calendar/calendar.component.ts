import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CalendarService } from "../../Services/calendar.service";
import { CommonModule, JsonPipe } from "@angular/common";
import {
  FullCalendarComponent,
  FullCalendarModule,
} from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  IonLabel,
  IonItem,
  IonSelectOption,
  IonContent,
  IonSelect,
} from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: "app-student-view",
  imports: [
    IonContent,
    IonItem,
    IonLabel,
    ReactiveFormsModule,
    CommonModule,
    FullCalendarModule,
    IonSelectOption,
    IonSelect,
  ],
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;
  formacaoForm: FormGroup;
  formacoes: any[] = [];
  aulas: any[] = [];
  calendarOptions: CalendarOptions | undefined;
  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService
  ) {
    this.formacaoForm = this.fb.group({
      formacao: [""],
    });
  }

  ngOnInit() {
    this.calendarService
      .getFormacoes()
      .subscribe((formacoes) => (this.formacoes = formacoes));
    // Recupera os eventos do localStorage
    const events = JSON.parse(localStorage.getItem("events") || "[]");

    this.formacaoForm.get("formacao")?.valueChanges.subscribe((formacaoId) => {
      this.loadAulas(formacaoId);
    });
  }

  loadAulas(formacaoId: string) {
    this.calendarService.getAulasByFormacao(formacaoId).subscribe((aulas) => {
      this.aulas = aulas;

      const calendarConfig = localStorage.getItem("calendarOptions");
      const calendarEvents = localStorage.getItem("events");
      console.log(calendarConfig);
      console.log(calendarEvents);

      // Atualizar as opções do calendário com os eventos carregados
      this.calendarOptions = {
        initialView: "dayGridMonth",
        plugins: [dayGridPlugin, interactionPlugin],
        ...JSON.parse(calendarConfig || "{}"),
        events: JSON.parse(calendarEvents || "[]"), // Carregar os eventos no calendário
      };
    });
  }
}
