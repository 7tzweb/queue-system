// tests/queueRoutes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config({ path: '.env' });

let clientId;
let deferredClientId;
let agentId = '123456789'; // סוכן פיקטיבי

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Queue API tests - טסטים 1 עד 6', () => {
  test('1. לקוחות יכולים להרשם לתור - POST /queue', async () => {
    const res = await request(app).post('/queue').send({
      name: 'יוסי בדיקה',
      phone: '0500000000',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('יוסי בדיקה');
    clientId = res.body._id;
  });

  test('2. ניתן לשלוף את הלקוח הבא בתור - GET /queue/next/queue', async () => {
    const res = await request(app).get('/queue/next/queue');
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(clientId);
  });

  test('3. ניתן לדחות לקוח לסוף התור - POST /queue/defer/:id', async () => {
    const res = await request(app).post(`/queue/defer/${clientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Entry deferred to end of queue');
    deferredClientId = clientId;
  });
 test('4. ניתן לשייך לקוח לסוכן - עם נתונים אמיתיים והדפסה', async () => {
  // צור לקוח חדש
  const clientRes = await request(app).post('/queue').send({
    name: 'לקוח לבדיקה',
    phone: '0501234567',
  });
  const clientId = clientRes.body._id;

  // צור סוכן חדש
  const agentRes = await request(app).post('/queue').send({
    name: 'סוכן לבדיקה',
    phone: '0507654321',
  });
  const agentId = agentRes.body._id;

  // בצע את קריאת השיוך
  const res = await request(app).post(`/queue/agentId/${agentId}/assign/id/${clientId}`);

  // הדפס את התגובה כדי שתוכל להעתיק אותה לבדיקות הבאות
  console.log('🔎 תשובת השרת:', JSON.stringify(res.body, null, 2));

  expect(res.statusCode).toBe(200);
});


test('5. ניתן לשלוף תורים לפי סטטוס - GET /queue/by-status?status=pending', async () => {
  const res = await request(app).get('/queue/by-status?status=pending');

  console.log('🔎 תוצאה סעיף 5:', JSON.stringify(res.body, null, 2));

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

    test('6. ניתן לשייך מחדש לקוח לסוכן - עם נתונים אמיתיים והדפסה', async () => {
  // צור לקוח חדש
  const clientRes = await request(app).post('/queue').send({
    name: 'לקוח לשיוך מחדש',
    phone: '0501234567',
  });
  const clientId = clientRes.body._id;

  // צור סוכן חדש
  const agentRes = await request(app).post('/queue').send({
    name: 'סוכן לשיוך מחדש',
    phone: '0507654321',
  });
  const agentId = agentRes.body._id;

  // בצע את קריאת השיוך מחדש
  const res = await request(app).post(`/queue/${clientId}/assign/${agentId}`);

  // הדפס את התגובה כדי שתוכל להעתיק אותה לבדיקה מלאה
  console.log('🔎 תשובת השרת סעיף 6:', JSON.stringify(res.body, null, 2));

  expect(res.statusCode).toBe(200);
});



 
});
