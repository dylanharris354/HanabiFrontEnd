import { Player } from "./player";

export interface Game {
    id: number;
    hints: number;
    fuses: number;
    players: Player[];
    currentTurn: Player;
}