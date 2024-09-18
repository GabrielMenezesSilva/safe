import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import {
  FullCalendarComponent,
  FullCalendarModule,
} from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2"; 
import { CalendarService } from "../../Services/calendar.service";
import {
  IonContent,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonDatetimeButton,
  IonModal,
} from "@ionic/angular/standalone";
import { CommonModule } from "@angular/common";
import { FirestoreModule } from "@angular/fire/firestore";

@Component({
  selector: "app-create-calendar",
  standalone: true,
  imports: [
    IonModal,
    IonDatetimeButton,
    IonDatetime,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonContent,
    FullCalendarModule,
    CommonModule,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    FirestoreModule,
  ],
  templateUrl: "./create-calendar.component.html",
  styleUrls: ["./create-calendar.component.css"],
})
export class CreateCalendarComponent implements OnInit {

  // IDs dinâmicos para os ion-datetime
  datetimeId1: string = this.generateUniqueId("datetime1");
  datetimeId2: string = this.generateUniqueId("datetime2");

  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;
  aulaForm: FormGroup;
  formacaoSelected: any;
  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    validRange: {
      start: "2024-10-01",
      end: "2024-10-20",
    },
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    unselectAuto: true,
    selectMirror: true,
    longPressDelay: 100,
    height: "auto",
    locale: "fr",
    timeZone: "UTC",
    eventResizableFromStart: true,
    editable: true, 
    eventDurationEditable: true,
    droppable: true,

    events: [], 

    select: this.onSelect.bind(this),

    eventClick: this.onEventClick.bind(this),
  };

  formacoes: any[] = [];

  feriados = [
    { title: "Nouvel An", date: "2024-01-01" },
    { title: "Vendredi Saint", date: "2024-03-29" },
    { title: "Pâques", date: "2024-03-31" },
    { title: "Lundi de Pâques", date: "2024-04-01" },
    { title: "Fête du Travail", date: "2024-05-01" },
    { title: "Ascension", date: "2024-05-09" },
    { title: "Pentecôte", date: "2024-05-19" },
    { title: "Lundi de Pentecôte", date: "2024-05-20" },
    { title: "Fête Nationale Suisse", date: "2024-08-01" },
    { title: "Assomption", date: "2024-08-15" },
    { title: "Journée de la Réforme", date: "2024-10-31" },
    { title: "Toussaint", date: "2024-11-01" },
    { title: "Noël", date: "2024-12-25" },
    { title: "Boxing Day", date: "2024-12-26" },
  ];

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService
  ) {
    this.aulaForm = this.fb.group({
      titulo: [""],
      descricao: [""],
      dataInicio: [],
      dataFim: [],
      horaInicio: [],
      horaFim: [],
      professor: [""],
      formacao: [""],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.calendarComponent.getApi().render();
    }, 250);

    this.calendarService
      .getFormacoes()
      .subscribe((formacoes) => (this.formacoes = formacoes));

    this.calendarService.getDates().subscribe((dates) => {
      this.calendarOptions.validRange = {
        start: dates.start,
        end: dates.end,
      };
    });

    const formacaoSelecionada = localStorage.getItem("formacaoSelecionada");
    if (formacaoSelecionada) {
      this.aulaForm.patchValue({ formacao: formacaoSelecionada });
      this.loadAulas(formacaoSelecionada);
    }

    // Adiciona os feriados ao calendário
    this.calendarOptions.events = [
      ...this.feriados.map((feriado) => ({
        title: feriado.title,
        date: feriado.date,
        editable: false, 
        allDay: true, 
      })),
    ];
  }

  // Função para gerar IDs únicos para os componentes ion-datetime
  generateUniqueId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 15)}`;
  }

  // Hook Ionic chamado quando está prestes a sair da página
  ionViewWillLeave() {
    // Limpa os IDs e os recria para garantir que sejam únicos ao retornar
    this.datetimeId1 = this.generateUniqueId("datetime1");
    this.datetimeId2 = this.generateUniqueId("datetime2");
  }

  onSelect(info: any) {
    Swal.fire({
      title: "Créer un nouvel événement?",
      html: `
        <div style="margin-bottom: 10px;">Nom de l'événement :</div>
        <input type="text" id="event_name" class="form-control" />
      `,
      showCancelButton: true,
      confirmButtonText: "Oui, créez-le!",
      heightAuto: false,
      cancelButtonText: "Non, retour",
      width: "400px",
      padding: "1em",
      customClass: {
        popup: "my-swal-popup",
      },
    }).then((result) => {
      if (result.value) {
        const title = (
          document.getElementById("event_name") as HTMLInputElement
        ).value;
        if (title) {
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.addEvent({
            title: title,
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay,
          });
        }
      }
    });
  }

  onEventClick(info: any) {
    if (this.feriados.some((feriado) => feriado.date === info.event.startStr)) {
      Swal.fire({
        text: "C'est un jour férié et il ne peut pas être supprimé.",
        icon: "warning",
        heightAuto: false,
      });
      return;
    }

    Swal.fire({
      text: "Êtes-vous sûr de vouloir supprimer cet événement?",
      icon: "warning",
      showCancelButton: true,
      heightAuto: false,
      confirmButtonText: "Oui, supprimez-le!",
      cancelButtonText: "Non, retour",
    }).then((result) => {
      if (result.value) {
        info.event.remove();
      }
    });
  }

  adicionarAula() {
    console.log(this.aulaForm.value);

    const novaAula = this.aulaForm.value;
    const event = {
      title: novaAula.titulo,
      start: `${novaAula.dataInicio}T${novaAula.horaInicio}`,
      end: `${novaAula.dataFim}T${novaAula.horaFim}`,
      description: novaAula.descricao,
      professor: novaAula.professor,
      formacao: novaAula.formacao,
    };

    this.calendarService.addAulaToFormacao(novaAula.formacao, event);
    this.loadAulas(novaAula.formacao);

    const calendarApi = this.calendarComponent.getApi();
    this.calendarOptions.validRange = {
      start: novaAula.horaInicio,
      end: novaAula.horaFim,
    };

    calendarApi.setOption("validRange", this.calendarOptions.validRange);
    calendarApi.render();
  }

  loadAulas(formacaoId: any) {
    this.formacaoSelected = formacaoId.id;
    this.calendarService.getAulasByFormacao(formacaoId).subscribe((aulas) => {
      this.calendarOptions.events = aulas;
    });
  }

  send() {
    const calendarApi = this.calendarComponent.getApi();
    const events = calendarApi.getEvents();

    const calendarEvents = JSON.parse(
      localStorage.getItem("events")?.toString() || "[]"
    );

    let evento = JSON.stringify(events);
    let evento2 = JSON.parse(evento);
    evento2.forEach((element: any) => {
      element.idFormation = this.formacaoSelected;
    });
    calendarEvents.push(...evento2);

    localStorage.setItem("events", JSON.stringify(calendarEvents));
    const { plugins, select, eventClick, editable, selectable, ...config } =
      this.calendarOptions;
    localStorage.setItem("calendarOptions", JSON.stringify(config));

    console.log("events", events);
    console.log("config", config);

    this.calendarOptions.events = [
      ...this.feriados.map((feriado) => ({
        title: feriado.title,
        date: feriado.date,
        editable: false, 
        allDay: true, 
      })),
    ];
  }
}
