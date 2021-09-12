export enum PieceState {
  None = ' ',
  Naught = '0',
  Cross = 'X',
}

export enum WinState {
  None,
  Tie,
  Naught,
  Cross,
}

export class GameState {
  board: [
    [PieceState, PieceState, PieceState],
    [PieceState, PieceState, PieceState],
    [PieceState, PieceState, PieceState]
  ] = [
    [PieceState.None, PieceState.None, PieceState.None],
    [PieceState.None, PieceState.None, PieceState.None],
    [PieceState.None, PieceState.None, PieceState.None],
  ];

  clone(): GameState {
    const newState = new GameState();

    newState.board[0][0] = this.board[0][0];
    newState.board[0][1] = this.board[0][1];
    newState.board[0][2] = this.board[0][2];

    newState.board[1][0] = this.board[1][0];
    newState.board[1][1] = this.board[1][1];
    newState.board[1][2] = this.board[1][2];

    newState.board[2][0] = this.board[2][0];
    newState.board[2][1] = this.board[2][1];
    newState.board[2][2] = this.board[2][2];

    return newState;
  }

  static generateTurnsForPlayer(
    state: GameState,
    player: PieceState
  ): number[] {
    const ret: number[] = [];

    if (state.board[0][0] === PieceState.None) ret.push(0);
    if (state.board[0][1] === PieceState.None) ret.push(1);
    if (state.board[0][2] === PieceState.None) ret.push(2);

    if (state.board[1][0] === PieceState.None) ret.push(3);
    if (state.board[1][1] === PieceState.None) ret.push(4);
    if (state.board[1][2] === PieceState.None) ret.push(5);

    if (state.board[2][0] === PieceState.None) ret.push(6);
    if (state.board[2][1] === PieceState.None) ret.push(7);
    if (state.board[2][2] === PieceState.None) ret.push(8);

    return ret;
  }

  static executeTurnForPlayer(
    state: GameState,
    player: PieceState,
    position: number
  ): GameState {
    const newState = state.clone();

    if (position === 0) newState.board[0][0] = player;
    if (position === 1) newState.board[0][1] = player;
    if (position === 2) newState.board[0][2] = player;

    if (position === 3) newState.board[1][0] = player;
    if (position === 4) newState.board[1][1] = player;
    if (position === 5) newState.board[1][2] = player;

    if (position === 6) newState.board[2][0] = player;
    if (position === 7) newState.board[2][1] = player;
    if (position === 8) newState.board[2][2] = player;

    return newState;
  }

  static checkWin(state: GameState): WinState {
    if (this.generateTurnsForPlayer(state, PieceState.Naught).length === 0)
      return WinState.Tie;
    if (this.checkWinForPlayer(state, PieceState.Naught))
      return WinState.Naught;
    if (this.checkWinForPlayer(state, PieceState.Cross)) return WinState.Cross;
    return WinState.None;
  }

  static printState(state: GameState): string {
    return `----
  ${state.board[0].join('')}
  ${state.board[1].join('')}
  ${state.board[2].join('')}
  ----`;
  }

  static getNextPlayer(player: PieceState): PieceState {
    if (player === PieceState.Cross) {
      return PieceState.Naught;
    } else if (player === PieceState.Naught) {
      return PieceState.Cross;
    }

    throw new Error('Not Implemented');
  }

  private static checkWinForPlayer(
    state: GameState,
    player: PieceState
  ): boolean {
    // Horizontal Lines
    if (
      state.board[0][0] === player &&
      state.board[0][1] === player &&
      state.board[0][2] === player
    )
      return true;

    if (
      state.board[1][0] === player &&
      state.board[1][1] === player &&
      state.board[1][2] === player
    )
      return true;

    if (
      state.board[2][0] === player &&
      state.board[2][1] === player &&
      state.board[2][2] === player
    )
      return true;

    // Verical Lines
    if (
      state.board[0][0] === player &&
      state.board[1][0] === player &&
      state.board[2][0] === player
    )
      return true;

    if (
      state.board[0][1] === player &&
      state.board[1][1] === player &&
      state.board[2][1] === player
    )
      return true;

    if (
      state.board[0][2] === player &&
      state.board[1][2] === player &&
      state.board[2][2] === player
    )
      return true;

    // Diagionals
    if (
      state.board[0][0] === player &&
      state.board[1][1] === player &&
      state.board[2][2] === player
    )
      return true;

    if (
      state.board[0][2] === player &&
      state.board[1][1] === player &&
      state.board[2][0] === player
    )
      return true;

    return false;
  }
}
