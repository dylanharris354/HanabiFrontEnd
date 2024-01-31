import { Injectable, inject } from '@angular/core';
import { Game } from './Interfaces/game';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from './Interfaces/card';
import { Hint } from './Interfaces/hint';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private client: HttpClient
  ) { }

  baseURL: string = "https://localhost:44375/hanabi/";

  getGameById(id: number): Observable<Game> {
    return this.client.get<Game>(this.baseURL + `game/${id}`);
  }

  getPlayerHand(gameId: number, playerId: number): Observable<Card[]> {
    return this.client.get<Card[]>(this.baseURL + `hand/${playerId}/${gameId}`);
  }

  playCard(gameId: number, cardId: number): Observable<Card> {
    let requestBody = {id: cardId, gameId: gameId}
    return this.client.put<Card>(this.baseURL + `play`, requestBody);
  }

  discardCard(gameId: number, cardId: number): Observable<Card> {
    let requestBody = {id: cardId, gameId: gameId}
    return this.client.put<Card>(this.baseURL + "discard", requestBody);
  }

  getPlayedCards(): Observable<Card[]> {
    return this.client.get<Card[]>(this.baseURL + `played/1`);
  }

  giveHint(hintToGive: Hint): Observable<Hint> {
    return this.client.post<Hint>(this.baseURL + 'hint', hintToGive);
  }
}
