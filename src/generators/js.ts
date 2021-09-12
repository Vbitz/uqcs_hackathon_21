import {getRandomId} from '../common';
import {GameState, WinState} from '../game';
import {CodeFunction, CodeGenerator} from '../generator';

export class JSCodeFunction extends CodeFunction {
  private statements: string[] = [];

  addStatement(s: string): void {
    this.statements.push(s);
  }

  printGameState(state: GameState): string {
    return `console.log(${JSON.stringify(GameState.printState(state))});`;
  }

  callFunction(codeFunction: CodeFunction, ...args: string[]): string {
    return `${codeFunction.name}(${args.join(', ')});`;
  }

  getCharacterToVariable(): string {
    const varName = `i${getRandomId()}`;
    this.statements.push(`const ${varName} = moves[0];`);
    return varName;
  }

  ifChar(variableName: string, value: string, ...statements: string[]) {
    this.statements.push(
      `if (${variableName} == ${value}) {
          ${statements.join('\n')}
        }`
    );
  }

  nextMove(): string {
    return 'moves.slice(1)';
  }

  emitBody(): string {
    return `function ${this.name}(moves) {
        ${this.statements.join('\n')}
      }`;
  }
}

export class JSCodeGenerator extends CodeGenerator {
  private funcs: JSCodeFunction[] = [];
  private entryPointName: string | undefined = undefined;

  createFunction(): CodeFunction {
    const newFunc = new JSCodeFunction();

    this.funcs.push(newFunc);

    return newFunc;
  }

  setEntryPoint(codeFunction: CodeFunction): void {
    this.entryPointName = codeFunction.name;
  }

  emit(): string {
    if (this.entryPointName === undefined) {
      throw new Error('Not Implemented');
    }

    const functionBodies = this.funcs.map(func => func.emitBody());

    return `// generated by i_dont_know_a_good_name.
  
      function cross_win() {
        console.log("Crosses Win");
        process.exit(0);
      }
      
      function naught_win() {
        console.log("Naughts Win");
        process.exit(1);
      }
  
      function tie() {
        console.log("It's a tie");
        process.exit(2);
      }
  
      ${functionBodies.join('\n')}
  
    ${this.entryPointName}(process.argv[2]);
      `;
  }

  getFilename(name: string): string {
    return `${name}.js`;
  }

  getFunctionForWinState(state: WinState): CodeFunction | undefined {
    switch (state) {
      case WinState.None:
        return undefined;
      case WinState.Cross:
        return new JSCodeFunction('cross_win');
      case WinState.Naught:
        return new JSCodeFunction('naught_win');
      case WinState.Tie:
        return new JSCodeFunction('tie');
    }
  }
}
