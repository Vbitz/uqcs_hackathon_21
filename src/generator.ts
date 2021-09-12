import {getRandomId} from './common';
import {GameState, WinState} from './game';

export abstract class CodeFunction {
  constructor(readonly name = `f${getRandomId()}`) {}

  abstract printGameState(state: GameState): string;
  abstract callFunction(codeFunction: CodeFunction, ...args: string[]): string;
  abstract addStatement(s: string): void;
  abstract getCharacterToVariable(): string;
  abstract ifChar(
    variableName: string,
    value: string,
    ...statements: string[]
  ): void;
  abstract nextMove(): string;
}

export abstract class CodeGenerator {
  abstract createFunction(): CodeFunction;
  abstract setEntryPoint(codeFunction: CodeFunction): void;
  abstract emit(): string;
  abstract getFilename(name: string): string;
  abstract getFunctionForWinState(state: WinState): CodeFunction | undefined;
}
