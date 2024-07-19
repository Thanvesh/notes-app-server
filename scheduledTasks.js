const cron = require('node-cron');
const Note = require('./models/note');

// Schedule task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await Note.deleteMany({ trashed: true, deletedAt: { $lte: thirtyDaysAgo } });
    console.log('Old trash notes deleted.');
  } catch (err) {
    console.error('Error deleting old trash notes:', err);
  }
});
