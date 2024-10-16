import { NextFunction } from "grammy";
import { BotContext } from "../../utils";



async function middlewareDebugger(
    ctx: BotContext,
    next: NextFunction){
        
        const formattedDate_1 = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');

        console.log(`----- START OF DEBUGGING ${formattedDate_1} -----`);

        console.log(ctx);
        console.log(ctx?.message?.text);
        

        const formattedDate_2 = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
        
        console.log(`----- END OF DEBUGGING ${formattedDate_2} -----`);

        await next();
        
    }

export default middlewareDebugger