import repl from 'repl';
import yargs from 'yargs';
import { commandHandlers } from './warehouse/commands';
import { Cell } from './warehouse';
// import { hideBin } from 'yargs/helpers';

const r = repl.start({prompt: "swhs => ", eval: async (cmd_: string, __, _, cb) => {
  const cmd = cmd_.trim();
  const y = yargs(/*hideBin(process.argv)TODO*/cmd.split(' '))
    .command('help', 'Shows this help message', async () => {
      const h = await y.getHelp();
      cb(null, h);
    })
    .command('exit', 'Exits the application.', () => {
      r.close();
    }).alias({'exit': 'quit'})
    .command('init W H', '(Re)Initialises the application as an empty W x H warehouse.', async ({argv: {_}}: any) => {
      await commandHandlers.init({w: _[1], h: _[2]});
      cb(null, "initialized");
    })
    .command('store X Y W H P', 'Stores a crate of product code P and of size W x H at position (X,Y).', async ({argv: {_}}: any) => {
      await commandHandlers.store({x: _[1], y: _[2], w: _[3], h: _[4], p: _[5]});
      cb(null, "stored");
    })
    .command('locate P', 'Show a list of all locations occupied by product code P.', (argv) => {
      cb(null, argv);
    })
    .command('remove X Y', 'Remove the entire crate occupying the location (X,Y).', (argv) => {
      cb(null, argv);
    })
    .command('view', 'Output a visual representation of the current state of the grid.', async () => {
      const view = await commandHandlers.view();
      cb(null, formatField(view));
    })
    .command('$0', '', () => {
      cb(null, `Unknown command "${cmd}". Use 'help' to see help.`);
    });

  await y.parse();

}, writer: modifyOutput});

const NONE_PLACEHOLDER = " " as const;
const bracketIt = (s: string) => `[${s}]`;
const bracketedNonePlaceholder = bracketIt(NONE_PLACEHOLDER);

function formatField(f: Cell[][]): string {
  const maxLengthPerColumn: number[] = [];
  for (let r = 0; r < f.length; r++) {
    const row = f[r];
    for (let c = 0; c < row.length; c++) {
      maxLengthPerColumn[c] = Math.max(maxLengthPerColumn[c] || 0, bracketIt(row[c] || NONE_PLACEHOLDER).length);
    }
  }
  return f.reduce((acc, row) => {
    return acc + row.reduce((acc, cell, c) => {
      return acc + (cell ? bracketIt(cell) : bracketedNonePlaceholder).padEnd(maxLengthPerColumn[c], " ");
    }, '') + '\n';
  }, '');
}

function modifyOutput(output: any) {
  return output; // removes quotes, somehow
}