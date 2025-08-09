const { exec } = require('youtube-dl-exec');
const path = require('path');

const resultDir = path.join(__dirname, '..', 'audioResults');

async function downloadAndConvert(youtubeUrl, title){
    const { nanoid } = await import('nanoid');
    try{
        const videoId = nanoid(10);
        const audioFileName = `${videoId}-${title}-audio.wav`;
        const audioPath = path.join(resultDir, audioFileName);

        console.log(`Starting audio convert for: ${youtubeUrl}`);
    
        await exec(youtubeUrl, {
            extractAudio: true,
            audioFormat: 'wav',
            postprocessorArgs: ['-ac', '1', '-ar', '16000', '-y'],
            output: audioPath,
        });
        console.log('Successfully');
        return {videoId, audioPath, audioUrl: `/audioResults/${audioFileName}`};
    }
    catch(e){
        console.log("error: ", e);
    }
}

module.exports = downloadAndConvert;
