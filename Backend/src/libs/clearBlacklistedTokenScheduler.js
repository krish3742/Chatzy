import cron from "node-cron";
import BlacklistedToken from "../models/blacklistedToken.model";

const clearBlacklistedTokenScheduler = cron.schedule("0 0 * * *", async () => {
  const currentDate = Math.floor(Date.now() / 1000);
  await BlacklistedToken.deleteMany({
    expiryAt: { $lt: currentDate },
  }).exec();
});

export default clearBlacklistedTokenScheduler;
