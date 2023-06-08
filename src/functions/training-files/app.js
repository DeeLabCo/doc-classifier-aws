const scheduleSyncCsvFiles = async (event, context) => {
  try {
    console.info(event);
    console.info('scheduleSyncCsvFiles');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.handler = scheduleSyncCsvFiles;