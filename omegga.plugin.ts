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
    let textGame = new TextGame();

    let loadedGameState = await this.store.get("phrase");
    loadedGameState ? textGame.setPhrase(loadedGameState) : textGame.setPhrase("A");

    this.omegga.on("cmd:aaa", async (name: string, ...args: string[]) => {
      // Default case: If no arguments are provided, whisper the current phrase to the user
      if (args.length === 0) {
        this.omegga.whisper(name, `The current phrase is ${textGame.getPhrase()}.`);
        return;
      }

      // Validate the user's answer
      if (textGame.checkAnswer(args.join(" "))) {
        this.omegga.broadcast( `${name} got the correct answer! The current phrase is ${textGame.getPhrase()}.`);
        textGame.incrementPhrase();
        this.store.set("phrase", textGame.getPhrase());
      } else {
        this.omegga.whisper(name, `Incorrect! The current phrase is ${textGame.getPhrase()}.`);
      }
    });

    return {registeredCommands: ["aaa"]};
  }

  async stop() {
    // Anything that needs to be cleaned up...
  }
}
