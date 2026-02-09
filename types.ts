
export interface TileData {
  id: string;
  value: number;
}

export type GridState = (TileData | null)[][];

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING'
}
