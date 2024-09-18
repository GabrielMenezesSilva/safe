import { Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  doc,
  setDoc,
  collectionData,
  CollectionReference,
  getDoc,
  docData,
  where,
  query,
} from "@angular/fire/firestore";
import { Observable, from, map } from "rxjs";
import { Formation } from "../../interfaces/formation";
// import { Calendar } from "@fullcalendar/core/index.js";

@Injectable({
  providedIn: "root",
})
export class FireCalendarService {
  private formationCollection: CollectionReference;
    calendarCollection: CollectionReference<import("@angular/fire/firestore").DocumentData, import("@angular/fire/firestore").DocumentData>;

  constructor(private firestore: Firestore) {
    // Inicialização das referências para as coleções do Firestore
    this.formationCollection = collection(this.firestore, "formation");
    this.calendarCollection = collection(this.firestore, "calendar");
  }

  getFormation(): Observable<Formation[]> {
    // Utilização de collectionData para obter os dados da coleção
    return collectionData(this.formationCollection, {
      idField: "id",
    }) as Observable<Formation[]>;
  }
  // Método para adicionar a const "data" (events, config e idFormation: this.aulaForm.value.formacao) à coleção 'calendar' ligada ao ID da formação

  addCalendar(id: string, data: any): Observable<void> {
    // Cria um documento com o ID da formação na coleção 'calendar', com o nome da formação
    const calendarDoc = doc(this.calendarCollection, id);
    // Adiciona os dados da formação ao documento criado
    return from(setDoc(calendarDoc, data));
  }


    }
