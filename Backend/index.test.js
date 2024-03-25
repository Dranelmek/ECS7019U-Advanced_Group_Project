const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./index.js');

describe('Test endpoints', () => {
  // Testing does it connect to the Database correctly.
  it('Should get welcome message', async () => {
    // Make a GET request
    const res = await request(app).get('/');

    // Expected response
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Welcome to Pothole Detection App!');
  });
});

describe('Test upload and download files (image, videos) ', () => {

  // Testing the upload of a image file
  it('Should upload image file successfully', async () => {
    // Make a POST request with the image file
    const response = await request(app)
      .post('/api/upload')
      .attach('files', 'testfiles/test.jpg');

    // Expected response
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Files uploaded successfully');
    expect(response.body.files).toBeDefined();
  });

  // Testing the download of an existing image file
  it('Should download an existing image file successfully', async () => {
    // Make a GET request for the existing image file
    const response = await request(app).get('/api/file/1708285643584test.jpg');

    // Expected response
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBeDefined();
  });

  // Testing the download of an non-existing image file
  it('Should return 404 for non-existing image file', async () => {
    // Make a GET request for the non-existing image file
    const response = await request(app).get('/api/file/nonexistentfile.jpg');

    // Expected response
    expect(response.status).toBe(404);
  });

  // Testing the upload of a video file
  it('Should upload video file successfully', async () => {
    // Make a POST request for the video file
    const response = await request(app)
      .post('/api/upload')
      .attach('files', 'testfiles/testVideo.mp4'); 

    // Expected response
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Files uploaded successfully');
    expect(response.body.files).toBeDefined();
  });

  // Testing the download of an existing video file
  it('Should download an existing video file successfully', async () => {
    // Make a GET request for the video file
    const response = await request(app).get('/api/file/1708285643584testVideo.mp4'); 

    // Expected response
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBeDefined();
  });

  // Testing the download of an non-existing video file
  it('Should return 404 for non-existing video file', async () => {
    // Make a GET request for the non-existing video file
    const response = await request(app).get('/api/file/nonexistentfile.mp4');

    // Expected response
    expect(response.status).toBe(404);
  });
});

describe('Pothole Router Tests', () => {

    // Testing for creating a new pothole
    it('Should create a new pothole', async () => {
      const newPothole = {
        'location': 'Test Location',
        'video': 'Test Video',
        'image': 'Test Image',
        'severe_level': 'High',
        'repairment_needed': true,
      };
      // Make a POST request for creating a new pothole
      const response = await request(app).post('/pothole/addNewPothole').send(newPothole);

      // Expected response
      expect(response.statusCode).toBe(200);
      expect(response.body.location).toBe(newPothole.location);
    });
  
    // Testing for retrieving all potholes
    it('Should get all potholes', async () => {
      // Make a GET request for retrieving all potholes
      const response = await request(app).get('/pothole');

      // Expected response
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    // Testing for retrieving a pothole by ID
    it('Should get a pothole by ID', async () => {
      // Make a POST request for creating a new pothole
      const newPotholeResponse = await request(app).post('/pothole/addNewPothole').send({
        location: 'Test Location',
        video: 'Test Video',
        image: 'Test Image',
        severe_level: 'High',
        repairment_needed: true,
      });

      // Make a GET request for retrieving the the created new pothole details with its ID
      const response = await request(app).get(`/pothole/${newPotholeResponse.body._id}`);

      // Expected response
      expect(response.statusCode).toBe(200);
      expect(response.body.location).toBe('Test Location');
    });

  
    // Testing for deleting a pothole by ID
    it('Should delete a pothole by ID', async () => {
      // Make a POST request for creating a new pothole
      const newPothole = await request(app).post('/pothole/addNewPothole').send({
        location: 'Test Location',
        video: 'Test Video',
        image: 'Test Image',
        severe_level: 'High',
        repairment_needed: true,
      });
  
      // Make a DELETE request for deleting the created new pothole details with its ID
      const response = await request(app).delete(`/pothole/deletePothole/${newPothole.body._id}`);

      // Expected response
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('Deleted pothole!');
    });
  
    // Testing for deleting all potholes
    it('Should delete all potholes', async () => {
      // Make a DELETE request for deleting all potholes' details
      const response = await request(app).delete('/pothole/deleteAllPotholes');

      // Expected response
      expect(response.statusCode).toBe(200);
      expect(response.body.ok).toBe(1);
    });
});

describe('User Routers Tests', () => {

  // Testing for adding a new staff memeber
  it('Should add a new staff member', async () => {
    const newUser = {
      username: 'newstaff',
      password: 'newpassword',
      user_first_name: 'New',
      user_last_name: 'Staff',
      email: 'newstaff@example.com',
    };

    // Make a POST request for creating a new staff member
    const response = await request(app)
      .post('/user/addStaff')
      .send(newUser);

    // Expected response
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(newUser.username);
  });

  // Testing for retrieving all users
  it('Should get all users', async () => {
    // Make a GET request for retrieving all users
    const response = await request(app).get('/user/allUsers');

    // Expected response
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Testing for when there is a same staff username in the database, it will not be allowed.
  it("Should not allow adding duplicate staff", async () => {
    const newUser = {
      username: 'newstaff',
      password: 'newpassword',
      user_first_name: 'New',
      user_last_name: 'Staff',
      email: 'newstaff@example.com',
    };

    // Make a POST request with existing username
    const response = await request(app)
      .post('/user/addStaff')
      .send(newUser);

    // Expected response
    expect(response.status).toBe(400);
    expect(response.body).toEqual('Username already exists');
  });

  // Testing login with correct credentials
  it('Should login with correct credentials', async () => {
    const credentials = {
      username: 'newstaff',
      password: 'newpassword',
    };

    // Make a POST request for login with correct credentials
    const response = await request(app)
      .post('/user/login')
      .send(credentials);

    // Expected response
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(credentials.username);
  });

  // Testing logging in with incorrect username 
  it('Should not login with incorrect username', async () => {
    const credentials = {
      username: 'test',
      password: 'newpassword',
    };

    // Make a POST request for login with incorrect username
    const response = await request(app)
      .post('/user/login')
      .send(credentials);

    // Expected response
    expect(response.status).toBe(401);
    expect(response.body).toEqual('Username not found');
  });

  // Testing login with incorrect password 
  it('Should not login with incorrect password', async () => {
    const credentials = {
      username: 'newstaff',
      password: 'test3password',
    };

    // Make a POST request for login with incorrect password
    const response = await request(app)
      .post('/user/login')
      .send(credentials);

    // Expected response
    expect(response.status).toBe(401);
    expect(response.body).toEqual('Wrong Password');
  });

  // Testing for deleting a user by username
  it('Should delete a user', async () => {
    // Make a DELETE request for deleting an existed user's details 
    const response = await request(app).delete(`/user/deleteUser/newstaff`);

    // Expected response
    expect(response.status).toBe(200);
  });

  // Testing for deleting all users
  it('Should delete all users', async () => {
    // Make a DELETE request for deleting all users' details
    const response = await request(app).delete('/user/deleteAllUsers');

    // Expected response
    expect(response.status).toBe(200);
  });
});

afterAll(async () => {
  await app.close();
  await mongoose.connection.close(); 
});

