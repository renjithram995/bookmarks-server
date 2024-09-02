const fs = require('fs');
const path = require('path');
var cron = require('node-cron');


const directory = 'uploads/';


const removeFiles = () => {
  fs.readdir(directory, (error, files) => {
    if (error) {
      console.error('Error reading directory:', error);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.unlink(filePath, (error) => {
        if (error) {
          console.error('Error deleting file:', filePath, error);
        } else {
          console.log('File deleted successfully:', filePath);
        }
      });
    });
  }); 
};


module.exports = () => {
  removeFiles();
  const job = cron.schedule('*/5 * * * *', removeFiles);
  job.start();
};