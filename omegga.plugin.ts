import OmeggaPlugin, { OL, PS, PC } from "omegga";
import TextGame from "./game_logic";

type Storage = { phrase: string };

export default class Plugin implements OmeggaPlugin<any, Storage> {
  omegga: OL;
  config: PC<any>;
  store: PS<Storage>;

  constructor(omegga: OL, config: PC<any>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  public limitedUsers: { [playerName: string]: number } = {};

  public isAuthorized(playerName: string): boolean {
    const player = this.omegga.getPlayer(playerName);
    if (player.isHost()) return true;
    if (this.config["Limited Mode"] && !player.getRoles().includes(this.config["Cooldown Bypass Role"])) {
        this.omegga.whisper(playerName, `You are not allowed to use this command.`);
        return false;
    }
    if (player.getRoles().includes(this.config["Blacklist Role"])) {
        this.omegga.whisper(playerName, `You are not allowed to use this command.`);
        return false
    }
    if (player.getRoles().includes(this.config["Cooldown Bypass Role"])) return true;

    for (let user in this.limitedUsers) {
        if (user !== playerName) continue;
        if (this.limitedUsers[user] < Date.now()) {
            delete this.limitedUsers[user];
            continue;
        }
        this.omegga.whisper(
            playerName,
            `You're on cooldown, please try again in ${Math.trunc((this.limitedUsers[user] - Date.now()) / 1000)} seconds.`
        );
        return false;
    }
    return true;
  }

  public setAuthorizedTimeout(playerName: string): void {
    this.limitedUsers[playerName] = Date.now() + this.config["Command Cooldown"] * 1000;
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
        // Enforce cooldowns and permissions
        if (!this.isAuthorized(name)) return;
        this.setAuthorizedTimeout(name)

        textGame.incrementPhrase();
        this.store.set("phrase", textGame.getPhrase());
        this.omegga.broadcast( `${name} got the correct answer! The current phrase is ${textGame.getPhrase()}.`);
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
