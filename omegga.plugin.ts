import OmeggaPlugin, { OL, PS, PC } from "omegga";
import TextGame from "./game_logic";

type Config = { foo: string };
type Storage = { bar: string };

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: PC<Config>;
  store: PS<Storage>;

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
    // Load the game logic
    let textGame = new TextGame();

    let prevPhrase = "";

    // Create a command to play the game
    this.omegga.on("cmd:aaa", async (name: string, ...args: string[]) => {
      // Check if the user"s answer is correct
      if (textGame.checkAnswer(args.join(" "))) {
        this.omegga.broadcast( `${name} got the correct answer! The current phrase is ${textGame.current_phrase}.`);
        prevPhrase = textGame.current_phrase;
        textGame.incrementPhrase();
      } else {
        this.omegga.whisper(name, `Incorrect! The current phrase is ${prevPhrase}.`);
      }
    });

    return {registeredCommands: ["aaa"]};
  }

  async stop() {
    // Anything that needs to be cleaned up...
  }
}
