import {promises as fs} from 'fs';

function getRandomId() {
  return Math.random().toString(36).substr(2);
}

enum PieceState {
  None = ' ',
  Naught = '0',
  Cross = 'X',
}

enum WinState {
  None,
  Tie,
  Naught,
  Cross,
}

class GameState {
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
    return `${state.board[0].join('')}
${state.board[1].join('')}
${state.board[2].join('')}`;
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

interface CodeFunction {
  name: string;
  printGameState(state: GameState): void;
  getCharacterToVariable(): string;
  callFunctionIfChar(
    variableName: string,
    value: string,
    codeFunction: CodeFunction
  ): void;
  callFunction(codeFunction: CodeFunction): void;
}

interface CodeGenerator {
  createFunction(): CodeFunction;
  setEntryPoint(codeFunction: CodeFunction): void;
  emit(): string;
  getFilename(name: string): string;
  getFunctionForWinState(state: WinState): CodeFunction | undefined;
}

class CCodeFunction implements CodeFunction {
  private statements: string[] = [];

  constructor(readonly name = `f${getRandomId()}`) {}

  printGameState(state: GameState): void {
    this.statements.push(
      `puts(${JSON.stringify(GameState.printState(state))});`
    );
  }

  getCharacterToVariable(): string {
    const varName = `i${getRandomId()}`;
    this.statements.push(`char ${varName} = getchar();getchar();`);
    return varName;
  }

  callFunctionIfChar(
    variableName: string,
    value: string,
    codeFunction: CodeFunction
  ) {
    this.statements.push(
      `if (${variableName} == ${value}) ${codeFunction.name}();`
    );
  }

  callFunction(codeFunction: CodeFunction): void {
    this.statements.push(`${codeFunction.name}();`);
  }

  emitPrototype(): string {
    return `void ${this.name}();`;
  }

  emitBody(): string {
    return `void ${this.name}() {
      ${this.statements.join('\n')}
    }`;
  }
}

class CCodeGenerator implements CodeGenerator {
  private funcs: CCodeFunction[] = [];
  private entryPointName: string | undefined = undefined;

  createFunction(): CodeFunction {
    const newFunc = new CCodeFunction();

    this.funcs.push(newFunc);

    return newFunc;
  }

  setEntryPoint(codeFunction: CodeFunction): void {
    this.entryPointName = codeFunction.name;
  }

  getFilename(name: string): string {
    return `${name}.c`;
  }

  getFunctionForWinState(state: WinState): CodeFunction | undefined {
    switch (state) {
      case WinState.None:
        return undefined;
      case WinState.Cross:
        return new CCodeFunction('cross_win');
      case WinState.Naught:
        return new CCodeFunction('naught_win');
      case WinState.Tie:
        return new CCodeFunction('tie');
    }
  }

  emit(): string {
    if (this.entryPointName === undefined) {
      throw new Error('Not Implemented');
    }

    const prototypes = this.funcs.map(func => func.emitPrototype());
    const functionBodies = this.funcs.map(func => func.emitBody());

    return `#include <stdio.h>
    #include <stdlib.h>
    // generated by i_dont_know_a_good_name.

    void cross_win() {
      puts("Crosses Win");
      exit(0);
    }
    
    void naught_win() {
      puts("Naughts Win");
      exit(1);
    }

    void tie() {
      puts("It's a tie");
      exit(2);
    }

    ${prototypes.join('\n')}
    ${functionBodies.join('\n')}

    int main(int argc, const char *argv[]) {
      ${this.entryPointName}();

      return 0;
    }
    `;
  }
}

function playState(
  codeGenerator: CodeGenerator,
  currentState: GameState,
  currentPlayer: PieceState
): CodeFunction {
  const stateFunction = codeGenerator.createFunction();

  stateFunction.printGameState(currentState);

  const varName = stateFunction.getCharacterToVariable();

  for (const move of GameState.generateTurnsForPlayer(
    currentState,
    currentPlayer
  )) {
    const nextState = GameState.executeTurnForPlayer(
      currentState,
      currentPlayer,
      move
    );

    const winState = GameState.checkWin(nextState);

    const nextFunction = codeGenerator.getFunctionForWinState(winState);

    if (nextFunction === undefined) {
      const nextTurnFunction = playState(
        codeGenerator,
        nextState,
        GameState.getNextPlayer(currentPlayer)
      );

      stateFunction.callFunctionIfChar(varName, `'${move}'`, nextTurnFunction);
    } else {
      stateFunction.printGameState(nextState);
      stateFunction.callFunctionIfChar(varName, `'${move}'`, nextFunction);
    }
  }

  stateFunction.callFunction(stateFunction);

  return stateFunction;
}

async function main(args: string[]): Promise<number> {
  const codeGenerator = new CCodeGenerator();

  const entryPoint = playState(
    codeGenerator,
    new GameState(),
    PieceState.Cross
  );

  codeGenerator.setEntryPoint(entryPoint);

  const sourceCode = codeGenerator.emit();

  await fs.writeFile(codeGenerator.getFilename('out'), sourceCode, 'utf8');

  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then(exitCode => (process.exitCode = exitCode))
    .catch(err => {
      console.error('Fatal', err);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });
}
