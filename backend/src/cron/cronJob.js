const cron = require("node-cron");
const { syncWordPressPosts } = require("../services/postService");

cron.schedule("0 0 * * *", async () => {
    console.log("Running WordPress Sync Cron Job...");
    await syncWordPressPosts();
});
