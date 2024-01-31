import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { Observable, map, of, tap } from 'rxjs';
import { Game } from '../Interfaces/game';
import { HandComponent } from "../hand/hand.component";
import { Card } from '../Interfaces/card';
import { Hint } from '../Interfaces/hint';

@Component({
    selector: 'app-game',
    standalone: true,
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss',
    imports: [CommonModule, HandComponent]
})
export class GameComponent {

  gameService: GameService = inject(GameService);
  game: Game | undefined;
  playedCards: Card[] | undefined;
  lastBluePlayed: number = 0;
  lastYellowPlayed: number = 0;
  lastGreenPlayed: number = 0;
  lastRedPlayed: number = 0;
  lastWhitePlayed: number = 0;
  numbers: string[] = [ '1', '2', '3', '4', '5'];
  cardIds: number[] | undefined;

  hintMap = {
    "White": 0,
    "Blue": 1,
    "Yellow": 2,
    "Red": 3,
    "Green": 4
  }

  constructor() {
    this.gameService.getGameById(1).subscribe(game => this.game = game);
    this.getPlayedCards();
  }

  updateGameInfo(): void {
    this.gameService.getGameById(1).subscribe(game => {
      if (this.game) {
        this.game.currentTurn = game.currentTurn;
        this.game.fuses = game.fuses;
        this.game.hints = game.hints;
      }
    });
  }

  giveHint(hint: string) : void {
    if (this.game) {
      let recievingPlayerId: number = 0;
      this.game.players.forEach(player => {
        if (player.id !== this.game?.currentTurn.id)
        {
          recievingPlayerId = player.id;
        }
      });
      let hintToGive: Hint = {
        givingPlayerId: this.game?.currentTurn.id, 
        recievingPlayerId: recievingPlayerId,
        id: 0,
        colorHint: undefined,
        numberhint: undefined,
        cardIds: undefined,
        gameId: 1
      }
      if (this.numbers.indexOf(hint) !== -1)
      {
        hintToGive.numberhint = hint;
      } else {
        hintToGive.colorHint = hint;
      }

      this.gameService.giveHint(hintToGive).subscribe(
        x => this.cardIds = x.cardIds,
        err => {},
        () => this.updateGameInfo()
        );
    }
  }

  getPlayedCards(): void {
    this.gameService.getPlayedCards().pipe(
      tap(arr => {
        arr.forEach(card => {
          if (card.color.toLocaleLowerCase() === "blue") {
            this.lastBluePlayed = card.number;
          }
          if (card.color.toLocaleLowerCase() === "white") {
            this.lastWhitePlayed = card.number;
          }
          if (card.color.toLocaleLowerCase() === "yellow") {
            this.lastYellowPlayed = card.number;
          }
          if (card.color.toLocaleLowerCase() === "green") {
            this.lastGreenPlayed = card.number;
          }
          if (card.color.toLocaleLowerCase() === "red") {
            this.lastRedPlayed = card.number;
          }
        });
      })
    ).subscribe(res => this.playedCards = res);

  }
}
