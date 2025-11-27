export interface Board {
  slug: string;
  name: string;
  dateCreated: string;
  dateUpdated: string;
  description?: string;
  pieces?: Piece[];
}

export interface Piece {}
