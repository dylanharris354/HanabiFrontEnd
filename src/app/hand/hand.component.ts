import { Component, Input, SimpleChange, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../Interfaces/player';
import { GameService } from '../game.service';
import { Card } from '../Interfaces/card';
import { Game } from '../Interfaces/game';

@Component({
  selector: 'app-hand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hand.component.html',
  styleUrl: './hand.component.scss'
})
export class HandComponent {

  @Input() player!: Player;
  @Input() currentTurn: Player | undefined;
  @Output() cardPlayed = new EventEmitter<void>();
  @Output() cardDiscarded = new EventEmitter<void>();
  @Output() giveHint = new EventEmitter<string>();
  gameService: GameService = inject(GameService);
  currentHand: Card[] | undefined;
  @Input() hintCardIds: number[] | undefined;

  playSelected: boolean = false;
  discardSelected: boolean = false;
  hintSelected: boolean = false;
  colorSelected: boolean = false;
  numberSelected: boolean = false;

  numbers = [ '1', '2', '3', '4', '5' ];
  colors = [ 'White', 'Green', 'Red', 'Blue', 'Yellow' ];

  constructor() {}

  ngOnInit() {
    this.getCurrentHand();
  }

  getCurrentHand(): void {
    this.gameService.getPlayerHand(1, this.player.id).subscribe(res => this.currentHand = res);
  }

  selectPlay(): void {
    this.discardSelected = false;
    this.hintSelected = false;
    this.playSelected = !this.playSelected;
  }

  selectDiscard(): void {
    this.playSelected = false;
    this.hintSelected = false;
    this.discardSelected = !this.discardSelected;
  }

  selectHint(): void {
    this.playSelected = false;
    this.discardSelected = false;
    this.hintSelected = !this.hintSelected;
  }

  selectColor(): void {
    this.colorSelected = !this.colorSelected;
  }

  selectNumber(): void {
    this.numberSelected = !this.numberSelected;
  }

  hintGiven(hint: string) {
    this.colorSelected = false;
    this.numberSelected = false;
    this.hintSelected = false;
    this.giveHint.emit(hint);
  }

  cardClicked(card: Card): void {
    console.log(this.hintCardIds?.indexOf(card.id) !== -1);
    console.log(this.hintCardIds?.indexOf(card.id));
    console.log(this.hintCardIds);
    if (this.playSelected) {
      if (this.currentTurn?.id !== this.player.id)
      {
        //throw error here later, for now just exit
        return;
      }
      this.gameService.playCard(1, card.id).subscribe(res => {
        let idx: number | undefined = this.currentHand?.indexOf(card);
        if (idx !== undefined)
        {
          this.currentHand?.splice(idx, 1, res);
        }
        this.cardPlayed.emit();
        this.playSelected = false;
      })
    }
    if (this.discardSelected) {
      if (this.currentTurn?.id !== this.player.id)
      {
        //throw error here later, for now just exit
        return;
      }
      this.gameService.discardCard(1, card.id).subscribe(res => {
        let idx: number | undefined = this.currentHand?.indexOf(card);
        if (idx !== undefined)
        {
          this.currentHand?.splice(idx, 1, res);
        }
        this.cardDiscarded.emit();
        this.discardSelected = false;
      })
    }
  }
}
