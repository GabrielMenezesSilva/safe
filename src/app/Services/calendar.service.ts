import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  private formacoesSubject = new BehaviorSubject<any[]>([]);
  formacoes$ = this.formacoesSubject.asObservable();

  private datesSubject = new BehaviorSubject<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  dates$ = this.datesSubject.asObservable();

  private aulasSubject = new BehaviorSubject<{ [formacaoId: string]: any[] }>({});
  aulas$ = this.aulasSubject.asObservable();

  constructor() {
    // Inicializar com dados de exemplo
    this.formacoesSubject.next([
      { id: 1, nome: "Web Designer (WD)", enregistrements: [] },
      { id: 2, nome: "Web Programmer (WPr)", enregistrements: [] },
      {
        id: 3,
        nome: "Mobile Web Application Developer (MWAD)",
        enregistrements: [],
      },
      { id: 4, nome: "Python Software Engineer(PSE)", enregistrements: [] },
      { id: 5, nome: "Data Analysis (PDA)", enregistrements: [] },
      {
        id: 6,
        nome: "Data Science pour la Finance (DAF)",
        enregistrements: [],
      },
      { id: 7, nome: "Digital Marketing (DMM)", enregistrements: [] },
    ]);

    this.datesSubject.next({
      start: "",
      end: "",
    });
  }

  getFormacoes() {
    return this.formacoes$;
  }

  setFormacoes(formacoes: any[]) {
    this.formacoesSubject.next(formacoes);
  }

  getDates() {
    return this.dates$;
  }

  setDates(start: string, end: string) {
    this.datesSubject.next({ start, end });
  }

  addAulaToFormacao(formacaoId: string, aula: any) {
    const currentAulas = this.aulasSubject.value;
    if (!currentAulas[formacaoId]) {
      currentAulas[formacaoId] = [];
    }
    currentAulas[formacaoId].push(aula);
    this.aulasSubject.next(currentAulas);
  }

  getAulasByFormacao(formacaoId: string) {
    return this.aulasSubject.asObservable().pipe(
      map(aulas => aulas[formacaoId] || [])
    );
  }
}