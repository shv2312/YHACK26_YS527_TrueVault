const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: body ? JSON.parse(body) : null }));
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Health Endpoint ---');
  const health = await request('GET', '/api/health');
  console.log('Health:', health.statusCode, health.body);

  console.log('\n--- Login Tests ---');
  const missingCreds = await request('POST', '/api/auth/login', {});
  console.log('Missing Creds:', missingCreds.statusCode, missingCreds.body);

  const unknownUser = await request('POST', '/api/auth/login', { username: 'unknown', password: 'demo_password_123' });
  console.log('Unknown User:', unknownUser.statusCode, unknownUser.body);

  const wrongPassword = await request('POST', '/api/auth/login', { username: 'demo_owner', password: 'wrongpassword' });
  console.log('Wrong Password:', wrongPassword.statusCode, wrongPassword.body);

  const validLogin = await request('POST', '/api/auth/login', { username: 'demo_owner', password: 'demo_password_123' });
  console.log('Valid Login:', validLogin.statusCode, Object.keys(validLogin.body));
  const token = validLogin.body.token;

  console.log('\n--- Asset Tests (assuming /api/assets exists based on docs) ---');
  if (token) {
    const assetsList = await request('GET', '/api/assets', null, token);
    console.log('Assets List (owner):', assetsList.statusCode, assetsList.body);
  } else {
    console.log('Skipping asset tests due to no token.');
  }
}

runTests().catch(console.error);
