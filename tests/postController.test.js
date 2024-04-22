const request = require('supertest');
const app = require('../index'); 

describe('POST /api/posts', () => {
  it('should create a new post', async () => {
    const postData = {
      title: 'Test Post',
      description: 'This is a test post',
      tags: ['test', 'example'],
      body: 'Lorem ipsum dolor sit amet...',
      state: 'draft'
    };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(201);

    expect(response.body).toHaveProperty('post');
    expect(response.body.post.title).toBe(postData.title);
  });
});

