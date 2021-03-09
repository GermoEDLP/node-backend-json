import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
var serviceAccount = require("./keys/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prueba-angular-16ac8.firebaseio.com",
});

// Rferencia a la base de datos con credenciales admin
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));




app.post("/", async (request, response) => {
    
    const resp = request.body;
    const ref = db.collection("JSONs");
    const id = new Date().getTime();
    ref.doc(id.toString()).set({id, ...resp}).then(()=>{
      response.status(201).json({id, ...resp});

    }).catch(e=>{
      response.status(500).json({
        error: e
      })
    })
  });

  app.get("/", async (request, response) => {
    const ref = db.collection("JSONs");
    const data = await ref.get();
    const JSONs = data.docs.map((doc) => doc.data());
  
    response.status(200).json(JSONs);
  });

export const api = functions.https.onRequest(app) 
