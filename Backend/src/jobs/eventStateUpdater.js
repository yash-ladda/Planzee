import cron from "node-cron";
import Event from "../models/Event.js";

const updateStates = async () => {

    //find and update events with state = "REG_OPEN"
    await Event.updateMany(
        {
            state: "REG_OPEN", 
            startTime:{ $lte: new Date()} 
        },
        {
            $set: {state: "LIVE"}
        }
    );

    //find and update events with state = "LIVE"
    await Event.updateMany(
        {
            state: "LIVE",
            endTime: { $lte: new Date()}
        },
        {
            $set: {state: "COMPLETED"}
        }
    ); 
}

cron.schedule("*/5 * * * *", updateStates);