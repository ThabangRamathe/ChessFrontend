import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Board } from '../model';
import { startingBoard } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080/api/board/';

  getStartingBoard(): Observable<Board>{
    return this.http.get<Board>(`${this.baseUrl}`);
    // const board = of(startingBoard);
    // return board;
  }

  gameState(fen: string): Observable<number>{
    return this.http.post<number>(`${this.baseUrl}state`, fen);
  }
}
