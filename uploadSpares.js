const admin = require('firebase-admin');
const fs = require('fs');

// ✅ Path to your downloaded Firebase service account JSON file
const serviceAccount = require('./instruapp-6baab-firebase-adminsdk-fbsvc-b6199a90d9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ✅ Load JSON file (converted from your CSV)
const spares = require('./spares_cleaned.json'); // Make sure this file has [{ code: ..., title: ... }, ...]

async function uploadSpares() {
  const batch = db.batch();
  let count = 0;

  for (const item of spares) {
    if (!item.code || !item.title) continue;

    const docRef = db.collection('spares').doc(item.code.toString());
    batch.set(docRef, {
      code: item.code,
      title: item.title
    });

    count++;

    // Firestore batch limit = 500
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Uploaded ${count} items...`);
    }
  }

  // Commit remaining
  if (count % 500 !== 0) {
    await batch.commit();
    console.log(`Uploaded remaining ${count % 500} items.`);
  }

  console.log(`✅ All ${count} spares uploaded successfully!`);
}

uploadSpares().catch(console.error);
