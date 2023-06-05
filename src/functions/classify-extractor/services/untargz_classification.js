const path = require('path');

// const decompress = require('decompress');
const decompressTargz = require('decompress-targz');

const get_targz_outfile_json = async (file_path) => {
    const s3_files = await decompressTargz()(file_path);
    // console.log("s3_files", s3_files);
    const classification_files = s3_files.filter(file => path.extname(file.path) === '.out');
    // console.log("classification_files", classification_files);
    const classification_data = classification_files.map(file => {
        let split_data = file.data.toString().split('\n');
        split_data = split_data.filter(data => data != '');
        return split_data.map(data => JSON.parse(data));
    });
    // console.log("classification_data", classification_data);
    return classification_data;
};

module.exports = get_targz_outfile_json;