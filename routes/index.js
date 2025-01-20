var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const { json } = require('stream/consumers');

/* GET home page - list all jobs. */
router.get('/', function (req, res, next) {
  const filePath = path.join(__dirname, '../data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send('Server Error');
    }

    try {
      let jobdata = JSON.parse(data); // Parse the entire content of the file
      let jobs = jobdata[0]; // Assuming jobdata is an array of arrays

      res.render('index', { title: 'Job Listings', jobs }); // Pass jobs to view
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).send('Invalid JSON in data file');
    }
  });
});

/* GET add job page. */
router.get('/add-job', function (req, res, next) {
  res.render('add-job', { title: 'Add Job' });
});

/* POST add job. */
router.post('/add-job', function (req, res, next) {
  const {
    companyLogo,
    location,
    timePosted,
    jobTitle,
    endDate,
    detailsLink,
    employeeType,
    jobType,
    experience,
    qualifications,
    duration,
    datePosted,
    jobDescription,
    responsibilitiesAndDuties,
    actionLink,
  } = req.body;

  const newJob = {
    id: Date.now(), // Use current timestamp as unique ID
    companyLogo,
    location,
    timePosted,
    jobTitle,
    endDate,
    detailsLink,
    details: [
      {
        employeeType,
        location,
        jobType,
        experience,
        qualifications,
        duration,
        datePosted,
        jobDescription,
        responsibilitiesAndDuties,
        actionLink,
      },
    ],
  };

  const filePath = path.join(__dirname, '../data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send('Server Error');
    }

    try {
      let jobdata = JSON.parse(data); // Parse the entire content of the file
      let jobs = jobdata[0]; // Assuming jobdata is an array of arrays

      jobs.push(newJob); // Add new job to the list

      fs.writeFile(filePath, JSON.stringify(jobdata, null, 2), (err) => {
        if (err) {
          console.error('Error writing data file:', err);
          return res.status(500).send('Server Error');
        }

        res.redirect('/'); // Redirect to the home page after adding the job
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).send('Invalid JSON in data file');
    }
  });
});

/* POST delete job. */
/* POST delete job. */
router.post('/delete-job/:id', function (req, res, next) {
  const jobId = parseInt(req.params.id, 10); // Parse the job ID from the URL
  const filePath = path.join(__dirname, '../data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send('Server Error');
    }

    try {
      let jobdata = JSON.parse(data); // Parse the entire content of the file
      let jobs = jobdata[0]; // Assuming jobdata is an array of arrays

      // Check if jobId exists in the jobs array
      const jobToDelete = jobs.find((job) => job.id === jobId);
      if (!jobToDelete) {
        console.log('Job not found with id:', jobId);
        return res.status(404).send('Job Not Found');
      }

      // Filter out the job with the specified ID
      jobs = jobs.filter((job) => job.id !== jobId);

      // Write the updated jobs array back to the file
      jobdata[0] = jobs; // Ensure that the updated jobs array is saved back in the correct structure
      fs.writeFile(filePath, JSON.stringify(jobdata, null, 2), (err) => {
        if (err) {
          console.error('Error writing data file:', err);
          return res.status(500).send('Server Error');
        }

        res.redirect('/'); // Redirect to the home page after deleting the job
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).send('Invalid JSON in data file');
    }
  });
});

router.get('/data', (req, res) => {
  const filePath = path.join(__dirname, '../data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send('Server Error');
    }

    try {
      let jobdata = JSON.parse(data); // Parse the entire content of the file
      res.send(jobdata); // Send the parsed job data as response
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).send('Invalid JSON in data file');
    }
  });
});


module.exports = router;
