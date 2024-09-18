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
import { consumerPollProducersForChange } from "@angular/core/primitives/signals";

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

      let calendarConfig = localStorage.getItem("calendarOptions");
      let calendarEvents = localStorage.getItem("events");
      console.log(calendarConfig);
      console.log(calendarEvents);

      if (calendarEvents) {
        let event = JSON.parse(calendarEvents);
        if(event.length > 0) {
          event = event.filter((event: any) => event.idFormation === formacaoId);
          calendarEvents = JSON.stringify(event);
        } 

        console.log(calendarEvents);
        // Atualizar as opções do calendário com os eventos carregados
        this.calendarOptions = {
          initialView: "dayGridMonth",
          plugins: [dayGridPlugin, interactionPlugin],
          ...JSON.parse(event?.length == 0 ? "{}" : calendarConfig || "{}"),
          events: JSON.parse(calendarEvents || "[]"), // Carregar os eventos no calendário
        };
      }
    });
  }
}
