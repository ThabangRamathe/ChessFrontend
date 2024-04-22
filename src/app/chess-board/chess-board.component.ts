import { Component, OnInit } from '@angular/core';
import { Board, Move } from '../model';
import { BoardService } from '../services/board.service';
import { MoveService } from '../services/move.service';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {

  chessBoard?: Board = undefined;
  numOfRows = 8;
  selectedSquare?: number;
  possibleMoves: number[] = [];
  state: number = -1;

  constructor(private boardService: BoardService, private moveService: MoveService) { }

  ngOnInit(): void {
    this.getStartingBoard();
  }

  getStartingBoard(): void{
    this.boardService.getStartingBoard().subscribe(board => this.chessBoard = board);
  }

  getSquareColor(rank: number, file: number): string {
    const isEvenColumn = file % 2 === 0;
    const isEvenRow = rank % 2 === 0;

    return (isEvenColumn && isEvenRow) || (!isEvenColumn && !isEvenRow) ? this.hasPossibleMovesClass('white-square', rank, file) : this.hasPossibleMovesClass('black-square', rank, file);
  }

  getPiece(rank: number, file: number){
    const sq = (rank * 8) + file;
    return this.chessBoard!.squares[sq].piece.type;
  }

  hasPiece(rank: number, file: number): boolean{
    const sq = (rank * 8) + file;
    return this.chessBoard!.squares[sq].piece.type == 0? false : true;
  }

  getImgSrc(rank: number, file: number): string{
    const sq = (rank * 8) + file;
    let src = "assets/pieces/";
    let img = ""
    const piece = this.chessBoard!.squares[sq].piece;
    if(piece.color === 8) {
      src = src + "w-";
    }
    else src = src + "b-";

    if(piece.type == 2) src += "king";
    else if (piece.type == 1) src += "pawn";
    else if (piece.type == 3) src += "knight";
    else if (piece.type == 4) src += "bishop";
    else if (piece.type == 5) src += "rook";
    else if (piece.type == 9) src += "queen";

    return src + ".png";
  }

  handleSquareClick(rank: number, file: number){
    const sq = (rank * 8) + file;
    if(this.inPossibleMoves(sq)){
      const move: Move = {
        start: this.selectedSquare!,
        dest: sq
      }
      console.log(move);
      // this.moveService.makeMove(move).pipe(switchMap((board) => {
      //   this.chessBoard = board;
      //   this.boardService.gameState(this.chessBoard!.fen).subscribe(state => this.state = state);
      //   return of(board);
      // }));
      this.moveService.makeMove(move).subscribe(board => {
        this.chessBoard = board;

        this.boardService.gameState(board.fen).subscribe(state => {
          this.state = state;

          this.makeBotMove();
        });
      });
      this.possibleMoves = [];
      this.selectedSquare = undefined;
      // console.log(this.chessBoard)
      // this.makeBotMove();
      return;
    }
    if(this.hasPiece(rank, file)){
      this.moveService.getPossibleMoves(this.chessBoard!.fen, sq).subscribe(moves => this.possibleMoves = moves);
      this.selectedSquare = sq;
    }
    else{
      this.possibleMoves = [];
      this.selectedSquare = undefined;
    }
  }

  inPossibleMoves(index: number): boolean{
    return this.possibleMoves.includes(index);    
  }

  hasPossibleMovesClass(clazz: string, rank: number, file: number): string{
    const sq = (rank * 8) + file;
    return this.inPossibleMoves(sq)? clazz.concat(" possible-move"): clazz;
  }

  undoMove(){
    this.moveService.undoMove().subscribe(board => this.chessBoard = board);
    this.possibleMoves = [];
    this.selectedSquare = undefined;
  }

  makeBotMove(){
    // console.log(this.chessBoard);
    this.moveService.botMove(this.chessBoard!.fen).subscribe(board => {
      this.chessBoard = board;
      console.log("New: ", board.fen);
      this.boardService.gameState(board.fen).subscribe(state => this.state = state);
    });
  }

  // stalemate(): boolean{
  //   return this.state == 0;
  // }

  // blackWins(): boolean{
  //   return this.state == 1;
  // }

  // whiteWins(): boolean{
  //   return this.state == 2;
  // }
}
