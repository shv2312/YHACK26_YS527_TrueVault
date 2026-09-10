async function runTests() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'demo_owner', password: 'demo_password_123' })
  });
  const { token } = await loginRes.json();
  if (!token) throw new Error('Login failed');
  
  console.log('Login PASSED');

  const formDataValid = new FormData();
  formDataValid.append('name', 'My Secret Asset');
  const fileContent = 'This is the sensitive file content to encrypt';
  const fileBlob = new Blob([fileContent], { type: 'text/plain' });
  formDataValid.append('file', fileBlob, 'secret.txt');

  const uploadRes = await fetch('http://localhost:3000/api/assets/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formDataValid
  });
  
  const uploadData = await uploadRes.json();
  if (uploadRes.status === 200 && uploadData.asset && uploadData.asset.status === 'DEMO') {
    console.log('Valid Upload PASSED (Asset ID:', uploadData.asset.id, ')');
  } else {
    console.error('Valid Upload FAILED:', uploadData);
  }

  // Missing file test
  const formDataMissing = new FormData();
  formDataMissing.append('name', 'Missing File');
  const missingRes = await fetch('http://localhost:3000/api/assets/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formDataMissing
  });
  if (missingRes.status === 400) console.log('Missing File Rejection PASSED');
  else console.error('Missing File Rejection FAILED:', await missingRes.text());

  // Download test
  const downloadRes = await fetch(`http://localhost:3000/api/assets/${uploadData.asset.id}/download`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (downloadRes.status === 200) {
    const downloadedText = await downloadRes.text();
    if (downloadedText === fileContent) {
      console.log('Authorized Download and Decryption PASSED');
    } else {
      console.error('Authorized Download FAILED: Content mismatch', downloadedText);
    }
  } else {
    console.error('Authorized Download FAILED: Status', downloadRes.status, await downloadRes.text());
  }

  // Health test
  const healthRes = await fetch('http://localhost:3000/api/health');
  const healthData = await healthRes.json();
  if (healthData.blockchain === 'MOCK') console.log('Health Endpoint MOCK reporting PASSED');
  else console.error('Health Endpoint FAILED:', healthData);
  
  console.log('All multipart and download tests completed.');
}

runTests().catch(console.error);
