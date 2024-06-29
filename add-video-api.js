require('dotenv').config();

const express = require('express');
const app = express();

const { MongoClient } = require('mongodb');
const uri = require('./atlas_uri');

const { google } = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YT_API_KEY
})

const client = new MongoClient(uri);

const dbname = 'felineHoldings';
const mbsRecentVideos = client.db(dbname).collection('mbsRecentVideos');

async function addVideoToDatabase() {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database.`);
        async function findStoredVideoId() {
            try {
                let video = await mbsRecentVideos.find({}).sort({ date: -1 }).toArray();
                return video.videoId;
            } catch (error) {
                console.log(error);
            }
        }
        async function lookupAndAddVideo(existingId) {
            try {
                youtube.search.list({
                    part: 'snippet',
                    channelId: 'UCdqFWzZ2sTEM3svKajyk9Lg',
                    order: 'date',
                    maxResults: 1
                })
                .then(results => {
                    videoData = results.data.items[0];
                    let videoId = videoData.id.videoId;
                    if (videoId === existingId) {
                        return;
                    }
                    let titleRaw = videoData.snippet.title;
                    let division;
                    let wasLive = false;
                    let dateRaw;
                    if (titleRaw.includes('MBS News')) {
                        division = 'news';
                    } else if (titleRaw.includes('MBS Sports')) {
                        division = 'sports';
                    } else if (titleRaw.includes('MBS Events')) {
                        division = 'events';
                    } else if (titleRaw.includes('MBS Studios')) {
                        division = 'studios';
                    } else if (titleRaw.includes('MBS Releasing')) {
                        division = 'releasing';
                    } else {
                        division = null;
                    }
                    let title = titleRaw.split('] ')[1];
                    if (title.includes(' - LIVE on ')) {
                        wasLive = true;
                        dateRaw = title.split(' - LIVE on ')[1];
                        title = title.split(' - LIVE on ')[0];
                    } else if (title.includes(' - 1/')) {
                        dateRaw = `1/${title.split(' - 1/')[1]}`;
                        title = title.split(' - 1/')[0];
                    } else if (title.includes(' - 2/')) {
                        dateRaw = `2/${title.split(' - 2/')[1]}`;
                        title = title.split(' - 2/')[0];
                    } else if (title.includes(' - 3/')) {
                        dateRaw = `3/${title.split(' - 3/')[1]}`;
                        title = title.split(' - 3/')[0];
                    } else if (title.includes(' - 4/')) {
                        dateRaw = `4/${title.split(' - 4/')[1]}`;
                        title = title.split(' - 4/')[0];
                    } else if (title.includes(' - 5/')) {
                        dateRaw = `5/${title.split(' - 5/')[1]}`;
                        title = title.split(' - 5/')[0];
                    } else if (title.includes(' - 6/')) {
                        dateRaw = `6/${title.split(' - 6/')[1]}`;
                        title = title.split(' - 6/')[0];
                    } else if (title.includes(' - 7/')) {
                        dateRaw = `7/${title.split(' - 7/')[1]}`;
                        title = title.split(' - 7/')[0];
                    } else if (title.includes(' - 8/')) {
                        dateRaw = `8/${title.split(' - 8/')[1]}`;
                        title = title.split(' - 8/')[0];
                    } else if (title.includes(' - 9/')) {
                        dateRaw = `9/${title.split(' - 9/')[1]}`;
                        title = title.split(' - 9/')[0];
                    } else if (title.includes(' - 10/')) {
                        dateRaw = `10/${title.split(' - 10/')[1]}`;
                        title = title.split(' - 10/')[0];
                    } else if (title.includes(' - 11/')) {
                        dateRaw = `11/${title.split(' - 11/')[1]}`;
                        title = title.split(' - 11/')[0];
                    } else if (title.includes(' - 12/')) {
                        dateRaw = `12/${title.split(' - 12/')[1]}`;
                        title = title.split(' - 12/')[0];
                    }
                    let month = dateRaw.split('/')[0];
                    let day = dateRaw.split('/')[1];
                    let year = dateRaw.split('/')[2];
                    if (month.length === 1) {
                        month = `0${month}`;
                    }
                    let date = `${year}-${month}-${day}`;
    
                    let videoObj = {
                        videoId: videoId,
                        division: division,
                        title: title,
                        date: date,
                        wasLive: wasLive
                    }
                    async function addVideo() {
                        try {
                            const result = await mbsRecentVideos.insertOne(videoObj);
                            console.log(result);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    addVideo();
                })
            } catch (error) {
                console.log(error);
            }
        }
        async function findIdAndAddVideo() {
            try {
                let existingId = await findStoredVideoId();
                lookupAndAddVideo(existingId);
            } catch (error) {
                console.log(error);
            }
        }
        findIdAndAddVideo()

    } catch (error) {
        console.error(`Error connecting to the ${dbname} database.`);
        console.error(error);
    } finally {
        client.close();
    }
}

module.exports = addVideoToDatabase();