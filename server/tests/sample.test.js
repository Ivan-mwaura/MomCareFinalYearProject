const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());
app.get('/api/test', (req, res) => res.json({ message: 'Test route working' }));

describe('GET /api/test', () => {
  it('should return a test message', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Test route working');
  });
});
