export interface Board {
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  pieces: Piece[];
}

export interface BasePiece {
  createdAt: string;
}

export interface NotePiece extends BasePiece {
  type: "note";
  content: string;
}

export interface ImagePiece extends BasePiece {
  type: "image";
  url: string;
  caption?: string;
}

export interface LinkPiece extends BasePiece {
  type: "link";
  url: string;
}

export type Piece = NotePiece | ImagePiece | LinkPiece;
