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

          // If querySnapshot only has one document, skip the orderBy method
          // if (querySnapshot.size > 1) {
          //   query = query.orderBy("order");
          // }

          const documents = [];

          // Loop through the first 4 documents in the subcollection
          querySnapshot.forEach((doc) => {
            const documentData = doc.data();
            documents.push(documentData);
          });

          // Add the subcollection name and the first 4 documents to the collectionData array
          collectionData.push({
            name: subcollectionName,
            documents: documents.slice(0, 4),
            // documents: documents,
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
