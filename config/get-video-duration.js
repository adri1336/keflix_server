require("dotenv").config();
const execa = require("execa");
const ffprobePath = process.env.FFPROBE_PATH || require('@ffprobe-installer/ffprobe').path;

//by Sumolari (https://github.com/caffco/get-video-duration)
function getFFprobeWrappedExecution(input) {
    const params = ['-v', 'error', '-show_format', '-show_streams']
  
    if (typeof input === 'string') {
      return execa(ffprobePath, [...params, input])
    }
  
    if (isStream(input)) {
      return execa(ffprobePath, [...params, '-i', 'pipe:0'], {
        reject: false,
        input,
      })
    }
  
    throw new Error('Given input was neither a string nor a Stream')
  }

const getVideoDurationInSeconds = async (input) => {
    const { stdout } = await getFFprobeWrappedExecution(input)
    const matched = stdout.match(/duration="?(\d*\.\d*)"?/)
    if (matched && matched[1]) return parseFloat(matched[1])
    throw new Error('No duration found!')
};

module.exports = {
    getVideoDurationInSeconds
};