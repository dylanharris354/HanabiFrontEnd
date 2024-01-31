export interface Hint {
    id: number,
    colorHint: string | undefined,
    numberhint: string | undefined,
    cardIds: number[] | undefined,
    recievingPlayerId: number,
    givingPlayerId: number,
    gameId: number
}