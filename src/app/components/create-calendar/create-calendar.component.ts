import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import {
  FullCalendarComponent,
  FullCalendarModule,
} from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2"; // Adicione esta linha
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
  ],
  templateUrl: "./create-calendar.component.html",
  styleUrls: ["./create-calendar.component.css"],
})
export class CreateCalendarComponent implements OnInit {
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;
  aulaForm: FormGroup;
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
    locale: "fr",
    timeZone: "UTC",
    eventResizableFromStart: true,
    editable: true, // Permitir que outros eventos sejam editáveis
    eventDurationEditable: true,
    droppable: true,

    // Adicionando eventos de feriados
    events: [], // Inicialmente vazio, será preenchido no ngOnInit

    // Função para criação de eventos
    select: this.onSelect.bind(this),

    // Função para deletar eventos
    eventClick: this.onEventClick.bind(this),
  };

  formacoes: any[] = [];

  // Lista de feriados na Suíça para 2024
  feriados = [
    { title: 'Ano Novo', date: '2024-01-01' },
    { title: 'Sexta-feira Santa', date: '2024-03-29' },
    { title: 'Páscoa', date: '2024-03-31' },
    { title: 'Segunda-feira de Páscoa', date: '2024-04-01' },
    { title: 'Dia do Trabalho', date: '2024-05-01' },
    { title: 'Dia da Ascensão', date: '2024-05-09' },
    { title: 'Pentecostes', date: '2024-05-19' },
    { title: 'Segunda-feira de Pentecostes', date: '2024-05-20' },
    { title: 'Feriado Nacional da Suíça', date: '2024-08-01' },
    { title: 'Assunção de Maria', date: '2024-08-15' },
    { title: 'Dia da Reforma', date: '2024-10-31' },
    { title: 'Dia de Todos os Santos', date: '2024-11-01' },
    { title: 'Natal', date: '2024-12-25' },
    { title: 'Boxing Day', date: '2024-12-26' }
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
      ...this.feriados.map(feriado => ({
        title: feriado.title,
        date: feriado.date,
        editable: false, // Define os feriados como não editáveis
        allDay: true // Assume que todos os feriados são eventos de dia inteiro
      }))
    ]; // Adiciona os feriados à lista de eventos
  }

  // Método de criação de eventos
  onSelect(info: any) {
    Swal.fire({
      title: "Create new event?",
      html: `
        <div style="margin-bottom: 10px;">Event Name:</div>
        <input type="text" id="event_name" class="form-control" />
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      heightAuto: false,
      cancelButtonText: "No, return",
      width: "400px", // Ajuste o tamanho da largura conforme necessário
      padding: "1em", // Ajuste o padding para evitar áreas em branco
      customClass: {
        popup: "my-swal-popup", // Classe CSS para estilizar o popup, se necessário
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

  // Método de exclusão de eventos
  onEventClick(info: any) {
    // Verifica se o evento é um feriado
    if (this.feriados.some(feriado => feriado.date === info.event.startStr)) {
      Swal.fire({
        text: "Este é um feriado e não pode ser deletado.",
        icon: "warning",
        heightAuto: false,
      });
      return; // Não permite a exclusão
    }

    Swal.fire({
      text: "Are you sure you want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      heightAuto: false,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, return",
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

    // Adicionar o evento ao calendário
    this.calendarService.addAulaToFormacao(novaAula.formacao, event);
    this.loadAulas(novaAula.formacao);

    // Atualizar o validRange do FullCalendar com base nos valores do formulário
    const calendarApi = this.calendarComponent.getApi();
    this.calendarOptions.validRange = {
      start: novaAula.horaInicio,
      end: novaAula.horaFim,
    };

    // Atualizar o calendário para aplicar as mudanças
    calendarApi.setOption('validRange', this.calendarOptions.validRange);
    calendarApi.render();
  }

  loadAulas(formacaoId: string) {
    this.calendarService.getAulasByFormacao(formacaoId).subscribe((aulas) => {
      this.calendarOptions.events = aulas;
    });
  }

  // Método para enviar todas as aulas para o localStorage e redirecionar para a página de visualização
  send() {
    const calendarApi = this.calendarComponent.getApi();
    const events = calendarApi.getEvents();
    localStorage.setItem("events", JSON.stringify(events));
  }
}
