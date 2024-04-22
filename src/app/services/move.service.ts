import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Board, Move } from '../model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoveService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080/api/move/';

  makeMove(move: Move): Observable<Board> {
    return this.http.put<Board>(`${this.baseUrl}`, move);
  }

  undoMove(): Observable<Board>{
    return this.http.get<Board>(`${this.baseUrl}undo`);
  }

  getPossibleMoves(fen: string, square: number): Observable<number[]>{
    const json = {
      "fen": fen,
      "square": square
    };
    return this.http.post<number[]>(`${this.baseUrl}possible-moves`, json);
  }

  botMove(fen: string): Observable<Board>{
    return this.http.put<Board>(`${this.baseUrl}bot-move`, fen);
  }
}
