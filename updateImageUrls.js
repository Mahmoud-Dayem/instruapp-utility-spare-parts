const admin = require('firebase-admin');
const fs = require('fs');

// ✅ Path to your downloaded Firebase service account JSON file
const serviceAccount = require('./instruapp-6baab-firebase-adminsdk-fbsvc-b6199a90d9.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateImageUrls() {
  let updated = 0;

  for (const item of imageData) {
    if (!item.code || !item.imageUrl) continue;

    const docRef = db.collection('spares').doc(item.code.toString());

    await docRef.update({
      imageUrl: item.imageUrl
    }).then(() => {
      console.log(`✅ Updated ${item.code}`);
      updated++;
    }).catch(err => {
      console.warn(`❌ Failed to update ${item.code}: ${err.message}`);
    });
  }

  console.log(`\n✅ Finished updating ${updated} documents.`);
}

updateImageUrls();