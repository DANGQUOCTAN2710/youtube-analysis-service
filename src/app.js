require('dotenv').config();
const express = require('express');
const path = require('path');

//Import model
const analyzeYouTubeVideo  = require('./utils/puppeteerUtils');
const downloadAndConvert = require('./utils/audioUtils');

const app = express();
const PORT = process.env.PORT || 3000;
const screenShotDir = path.join(__dirname, '..', 'ScreenShots');
const audioDir = path.join(__dirname, '..', 'Audios');
//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ScreenShots', express.static(screenShotDir));
app.use('/Audios', express(audioDir))

app.post('/analyze', async(req, res) =>{
    const { youtubeUrl } = req.body;
    if (!youtubeUrl) {
        return res.status(400).json({error: 'YouTube URL is required'});
    }

    try{
        const screenShotResults = await analyzeYouTubeVideo(youtubeUrl);
        const audioResults =  await downloadAndConvert(youtubeUrl, screenShotResults.title);

        console.log('Screenshot result:', screenShotResults);
        console.log('Audio result:', audioResults);
        const results = [screenShotResults, audioResults];
        res.json(results);
    }
    catch(e){
        console.error('Error: ', e);
        res.status(500).json({error: 'Failed to analyze'});
    }
});

app.get('/results/:id', (req, res) => {
    const {id} = req.params;
    console.log('Received result request for id: ', id);
    res.json({status: 'pending', id});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});