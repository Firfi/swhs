import repl from "repl";
import yargs from "yargs";
import { commandHandlers } from "./warehouse/commands";
import { formatField } from "./print/field";
// import { hideBin } from 'yargs/helpers';

const r = repl.start({
  prompt: "swhs => ",
  eval: async (cmd_: string, __, _, cb) => {
    const cmd = cmd_.trim();

    const y = yargs(/*hideBin(process.argv)TODO*/ cmd.split(" "))
      .command("exit", "Exits the application.", () => {
        r.close();
      })
      .command(
        "init W H",
        "(Re)Initialises the application as an empty W x H warehouse.",
        async ({ argv: { _ } }: any) => {
          await commandHandlers.init({ w: _[1], h: _[2] });
          cb(null, "initialized");
        }
      )
      .command(
        "store X Y W H P",
        "Stores a crate of product code P and of size W x H at position (X,Y).",
        async ({ argv: { _ } }: any) => {
          await commandHandlers.store({
            x: _[1],
            y: _[2],
            w: _[3],
            h: _[4],
            p: _[5],
          });
          cb(null, "stored");
        }
      )
      .command(
        "locate P",
        "Show a list of all locations occupied by product code P.",
        (argv) => {
          cb(null, argv);
        }
      )
      .command(
        "remove X Y",
        "Remove the entire crate occupying the location (X,Y).",
        (argv) => {
          cb(null, argv);
        }
      )
      .command(
        "view",
        "Output a visual representation of the current state of the grid.",
        async () => {
          const view = await commandHandlers.view();
          cb(null, formatField(view));
        }
      )
      .help(false)
      .version(false)
      .command("$0", "", () => {
        cb(null, `Unknown command "${cmd}". Use 'help' to see help.`);
      })
      .strict(false)
      .strictCommands(false)
      .strictOptions(false);
    // .alias({'exit': 'quit'})
    if (cmd === "help") {
      cb(null, await y.getHelp());
      return;
    } else {
      y.parse();
    }
  },
  writer: modifyOutput,
});

function modifyOutput(output: any) {
  return output; // removes quotes, somehow
}
