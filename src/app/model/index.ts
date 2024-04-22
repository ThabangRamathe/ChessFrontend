export interface Square{
    piece:Piece;
}

export interface Piece{
    type: number;
    color: number;
}

export interface Board{
    fen: string;
    squares: Square[];
    posFen?: string;
}

export interface Move{
    dest: number;
    start: number;
}
