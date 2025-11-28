export interface Board {
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  pieces: Piece[];
}

export interface Piece {
  createdAt: string;
}

export interface NotePiece extends Piece {
  type: "note";
  content: string;
}

export interface ImagePiece extends Piece {
  type: "image";
  url: string;
  caption?: string;
}

export interface LinkPiece extends Piece {
  type: "link";
  url: string;
}
