const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const cors = require("cors")({ origin: true });

exports.createUserDocument = functions.auth.user().onCreate((user) => {
  db.collection("users").doc(user.uid).set({
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    theme: "dark",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

exports.deleteCollection = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const data = {
      collection: req.body.req.collection,
      userId: req.body.req.userId,
      timestamp: Date.now(),
      msg: "this was deleted successfully",
    };
    try {
      const firestore = admin.firestore();
      const userDocRef = firestore.collection("users").doc(data.userId);
      const userDoc = await userDocRef.get();
      const recentCollection = userDoc.get("recentCollection");
      const index = recentCollection.indexOf(data.collection);
      if (index !== -1) {
        recentCollection.splice(index, 1);
        await userDocRef.update({ recentCollection });
      }

      const batch = admin.firestore().batch();
      const snapshot = await admin
        .firestore()
        .collection("users")
        .doc(data.userId)
        .collection(data.collection)
        .get();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  });
});

exports.getNestedUserCollections = functions.https.onRequest(
  async (req, res) => {
    cors(req, res, async () => {
      const data = {
        userId: req.body.req.userId,
      };
      try {
        // Retrieve the document
        const docRef = admin.firestore().collection("users").doc(data.userId);
        const doc = await docRef.get();
        const subcollections = await docRef.listCollections();
        const subcollectionNames = subcollections.map(
          (subcollection) => subcollection.id
        );

        res.status(200).json(subcollectionNames);
      } catch (error) {
        console.error(error);
        throw new functions.https.HttpsError(
          "internal",
          "An error occurred while getting the nested collections."
        );
      }
    });
  }
);

exports.getNestedUserCollectionsAndDocs = functions.https.onRequest(
  async (req, res) => {
    cors(req, res, async () => {
      const data = {
        userId: req.body.req.userId,
      };
      try {
        // Retrieve the document
        const docRef = admin.firestore().collection("users").doc(data.userId);
        const doc = await docRef.get();
        const subcollections = await docRef.listCollections();

        const collectionData = [];

        // Loop through each subcollection
        for (const subcollection of subcollections) {
          const subcollectionName = subcollection.id;

          let query = subcollection.limit(4);
          const querySnapshot = await query.get();

          let metadataQuery = subcollection
            .where("type", "==", "metadata")
            .limit(1);
          const metadataSnapshot = await metadataQuery.get();

          const documents = [];
          querySnapshot.forEach((doc) => {
            const documentData = doc.data();
            if (
              !documentData.hasOwnProperty("type") ||
              documentData.type !== "metadata"
            ) {
              documents.push(documentData);
            }
          });

          let metadata;
          metadataSnapshot.forEach((metadataDoc) => {
            metadata = {
              ...metadataDoc.data(),
              collectionLength: querySnapshot.size - 1,
            };
          });

          collectionData.push({
            name: subcollectionName,
            documents: documents.slice(0, 4),
            metadata: metadata,
          });
        }

        res.status(200).json(collectionData);
      } catch (error) {
        console.error(error);
        throw new functions.https.HttpsError(
          "internal",
          "An error occurred while getting the nested collections."
        );
      }
    });
  }
);
