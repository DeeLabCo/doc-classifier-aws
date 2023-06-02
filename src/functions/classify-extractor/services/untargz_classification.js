const path = require('path');

const decompress = require('decompress');
const decompressTargz = require('decompress-targz');

const get_targz_outfile_json = async (file_path) => {
    // const classification_files = await decompress(file_path, {
    //     plugins: [
    //         decompressTargz()
    //     ],
    //     filter: file => path.extname(file.path) === '.out',
    //     map: file => JSON.parse(file.data.toString())
    // });
    const s3_files = decompressTargz()(file_path);
    const classification_files = s3_files
        .filter(file => path.extname(file.path) === '.out')
        .map(file => JSON.parse(file.data.toString()));
    return classification_files;
};

module.exports = get_targz_outfile_json;