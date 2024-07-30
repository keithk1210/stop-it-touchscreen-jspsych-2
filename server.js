const express = require('express');
const { S3Client, PutObjectCommand,ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const bodyParser = require('body-parser');
const stream = require('stream');
//const cors = require('cors');


const app = express();
const port = 3000;


// Initialize the S3 client
const s3 = new S3Client({
    region: 'us-east-2' // Specify your region
});

// Body parser middleware


app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '256gb' }));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle video upload
app.post('/upload/video', async (req, res) => {
    const bucketName = 'cheesebucketlehighu';
    const video_dir = 'webcam_videos/';
    const fileName = video_dir + `recorded-video-${Date.now()}.webm`; // Generate a unique file name

    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.body,
            ContentType: 'video/webm', // Change this if your video is in a different format
        };

        const data = await s3.send(new PutObjectCommand(params));
        res.json({ message: 'Video uploaded successfully', data });
    } catch (err) {
        console.error('Error uploading video:', err);
        res.status(500).json({ error: 'Error uploading video', details: err });
    }
});

// Handle data upload
app.post('/upload/data', async (req, res) => {
    const bucketName = 'cheesebucketlehighu';
    const data_dir = 'stop_signal_data/';
    const fileName = data_dir + `${req.body.userID}.csv`; // Generate a unique file name

    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.body.csvString,
            ContentType: 'text/csv', // Change this if your video is in a different format
        };

        const data = await s3.send(new PutObjectCommand(params));
        res.json({ message: 'Data uploaded successfully', data });
    } catch (err) {
        console.error('Error uploading video:', err);
        res.status(500).json({ error: 'Error uploading video', details: err });
    }
});

app.post('/upload/leaderboard', async (req, res) => {
    console.log("req.body: ", req.body);

    const bucketName = 'cheesebucketlehighu';
    const leaderboard_dir = 'leaderboard/';
    const fileName = leaderboard_dir + `${JSON.stringify(req.body.userID).replace(/"/g, " ")}.json`; // Generate a unique file name

    try {
        const params = {
            Bucket: bucketName,
            Key: fileName, // or any other key you prefer
            Body: JSON.stringify(req.body),
            ContentType: 'application/json',
        };
        
        const data = await s3.send(new PutObjectCommand(params));
        res.json({ message: 'Data uploaded successfully', data });

    } catch (err) {
        console.error('Error uploading data:', err);
        res.status(500).json({ error: 'Error uploading data', details: err });
    }
    
});

app.get('/s3/get-object/bucket/:bucket/key/:key', async (req, res) => {
    console.log("req.query",req.query)
    console.log("req.params",req.params)
    //const { bucket, key } = req.params; // Extract path parameters
  
    const input = {
      Bucket: req.params.bucket,
      Key: req.params.key,
    };
  
    const command = new GetObjectCommand(input);
  
    try {
      const response = await s3.send(command);
  
      // Get the stream from the response
      const responseStream = response.Body;
  
      // Check if the response is a readable stream
      if (responseStream instanceof stream.Readable) {
        // Collect stream data into a string
        let data = '';
  
        responseStream.on('data', (chunk) => {
          data += chunk;
        });
  
        responseStream.on('end', () => {
          try {
            const jsonData = JSON.parse(data); // Parse JSON data
            res.json(jsonData); // Send JSON data as response
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Failed to parse JSON', details: parseError.message });
          }
        });
  
      } else {
        throw new Error('Failed to retrieve the S3 object stream');
      }
    } catch (error) {
      console.error('Error retrieving object from S3:', error);
      res.status(500).json({ error: 'Failed to retrieve object from S3', details: error.message });
    }
});

app.get('/s3/list-objects', async (req, res) => {
    const input = {
      Bucket: 'cheesebucketlehighu',  // Replace with your actual bucket name
      MaxKeys: 100,               // Limit the number of objects returned
    };
  
    const command = new ListObjectsCommand(input);
  
    try {
      const response = await s3.send(command);
      res.json({
        message: 'Objects retrieved successfully',
        data: response.Contents,
      });
    } catch (error) {
      console.error('Error listing objects from S3:', error);
      res.status(500).json({ error: 'Failed to list objects from S3', details: error.message });
    }
});

app.get('/test', (req, res) => res.send('Server is running'));



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
