import { Router } from "@grammyjs/router";
import { BotContext } from "../utils/utils";
import { RootLogic } from "./root_logic";

const routerRoot = new Router<BotContext>((ctx: BotContext)  => {
    // Determine route to pick here.
    return ctx?.message?.text;
});
  

routerRoot.route("/start", RootLogic.start)
routerRoot.route("/help", RootLogic.help);

// router.route("key", async (ctx) => {/* ... */});
// router.route("other-key", async (ctx) => {/* ... */});

// router.otherwise((ctx) => {/* ... */}); // called if no route matches

export default routerRoot