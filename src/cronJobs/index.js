import cron from "node-cron"
import task1  from "./scheduler2.js"
import getAllUnpaidUsers  from "./scheduler1.js"

cron.schedule('*/2 *  * * * *',task1)
cron.schedule('*/2 *  * * * *',getAllUnpaidUsers)