async function runTests() {
  console.log('--- STARTING INTEGRATION TESTS ---');
  let token = '';

  try {
    // 1. Authentication
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo_owner', password: 'demo_password_123' })
    });
    const loginData = await loginRes.json();
    if (loginRes.status === 200 && loginData.token) {
      console.log('Valid Login PASSED');
      token = loginData.token;
    } else {
      console.error('Valid Login FAILED', loginData);
    }

    const invalidLoginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo_owner', password: 'wrong' })
    });
    if (invalidLoginRes.status === 401) console.log('Invalid Login PASSED');
    else console.error('Invalid Login FAILED');

    const noTokenRes = await fetch('http://localhost:3000/api/assets');
    if (noTokenRes.status === 401) console.log('Protected route without token PASSED');
    else console.error('Protected route without token FAILED');

    // 2. Assets
    const listRes = await fetch('http://localhost:3000/api/assets', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const listData = await listRes.json();
    if (listRes.status === 200 && Array.isArray(listData)) console.log('List Assets PASSED', listData.length);
    else console.error('List Assets FAILED', listData);

    const formDataValid = new FormData();
    formDataValid.append('name', 'Integration Test Asset');
    const fileContent = 'This is content for testing ' + Date.now();
    const fileBlob = new Blob([fileContent], { type: 'text/plain' });
    formDataValid.append('file', fileBlob, 'test.txt');

    const uploadRes = await fetch('http://localhost:3000/api/assets/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formDataValid
    });
    const uploadData = await uploadRes.json();
    let assetId = '';
    if (uploadRes.status === 200 && uploadData.asset && uploadData.asset.id) {
      console.log('Upload valid file PASSED', uploadData.asset.id);
      assetId = uploadData.asset.id;
    } else {
      console.error('Upload valid file FAILED', uploadData);
    }

    const formDataMissing = new FormData();
    formDataMissing.append('name', 'Missing File');
    const missingRes = await fetch('http://localhost:3000/api/assets/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formDataMissing
    });
    if (missingRes.status === 400) console.log('Missing file upload PASSED');
    else console.error('Missing file upload FAILED', missingRes.status);

    const duplicateUploadRes = await fetch('http://localhost:3000/api/assets/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formDataValid // send same exact content
    });
    if (duplicateUploadRes.status === 409) console.log('Duplicate hash upload PASSED');
    else console.error('Duplicate hash upload FAILED', duplicateUploadRes.status);

    const detailsRes = await fetch(`http://localhost:3000/api/assets/${assetId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const detailsData = await detailsRes.json();
    if (detailsRes.status === 200 && detailsData.id === assetId) console.log('Asset details PASSED');
    else console.error('Asset details FAILED', detailsData);

    // 3. Verification
    const verifyRes = await fetch(`http://localhost:3000/api/assets/verify/${detailsData.fileHash}`);
    const verifyData = await verifyRes.json();
    if (verifyRes.status === 200) console.log('Valid stored hash verification PASSED', verifyData);
    else console.error('Valid stored hash verification FAILED', verifyData);

    const unknownHashRes = await fetch(`http://localhost:3000/api/assets/verify/unknown_hash`);
    if (unknownHashRes.status === 404) console.log('Unknown hash verification PASSED');
    else console.error('Unknown hash verification FAILED');

    // 4. Audit
    const auditRes = await fetch('http://localhost:3000/api/audit', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const auditData = await auditRes.json();
    if (auditRes.status === 200 && Array.isArray(auditData)) console.log('Audit listing PASSED', auditData.length);
    else console.error('Audit listing FAILED', auditData);

    console.log('--- ALL INTEGRATION TESTS COMPLETED ---');
  } catch (e) {
    console.error('Test execution failed:', e);
  }
}

runTests();
