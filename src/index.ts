import {promises as fs} from 'fs';
import {GameState, PieceState} from './game';
import {CodeFunction, CodeGenerator} from './generator';
import {makeGenerator} from './generators/factory';

function playState(
  codeGenerator: CodeGenerator,
  currentState: GameState,
  currentPlayer: PieceState
): CodeFunction {
  const stateFunction = codeGenerator.createFunction();

  stateFunction.addStatement(stateFunction.printGameState(currentState));

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

      stateFunction.ifChar(
        varName,
        `'${move}'`,
        stateFunction.callFunction(nextTurnFunction, stateFunction.nextMove())
      );
    } else {
      stateFunction.ifChar(
        varName,
        `'${move}'`,
        stateFunction.printGameState(nextState),
        stateFunction.callFunction(nextFunction)
      );
    }
  }

  stateFunction.addStatement(
    stateFunction.callFunction(stateFunction, stateFunction.nextMove())
  );

  return stateFunction;
}

async function main(args: string[]): Promise<number> {
  const codeGenerator = makeGenerator(args[0]);

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
