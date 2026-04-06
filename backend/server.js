import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbAll, dbGet, dbRun } from './db.js';
import Groq from "groq-sdk";
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

// Initialize Firebase Admin
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.resolve(__dirname, '../unittrack01-firebase-adminsdk-fbsvc-c7b3c401b7.json');

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin Initialized Successfully");
} catch(err) {
  console.error("Firebase Admin Initialization Failed. Ensure service account JSON is at the root directory.", err);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Firebase Auth Middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// API: Get all bills
app.get('/api/bills', verifyToken, async (req, res) => {
  try {
    const bills = await dbAll('SELECT * FROM bills WHERE firebase_uid = ? ORDER BY id ASC', [req.user.uid]);
    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Add new bill
app.post('/api/bills', verifyToken, async (req, res) => {
  try {
    const { units, peak_demand, billing_month, provider } = req.body;
    const result = await dbRun(
      'INSERT INTO bills (units, peak_demand, billing_month, provider, firebase_uid) VALUES (?, ?, ?, ?, ?)',
      [units, peak_demand || 0, billing_month, provider, req.user.uid]
    );
    res.json({ success: true, id: result.lastID });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Dashboard aggregated stats
app.get('/api/dashboard', verifyToken, async (req, res) => {
  try {
    const bills = await dbAll('SELECT * FROM bills WHERE firebase_uid = ? ORDER BY id ASC', [req.user.uid]);
    
    if (bills.length === 0) {
      return res.json({ 
        success: true, 
        data: { 
          latestUnits: 0, 
          predictedUnits: 0, 
          growth: 0, 
          history: [] 
        }
      });
    }

    const latestBill = bills[bills.length - 1];
    const prevBill = bills.length > 1 ? bills[bills.length - 2] : null;
    
    let growth = 0;
    if (prevBill && prevBill.units > 0) {
      growth = ((latestBill.units - prevBill.units) / prevBill.units) * 100;
    }

    // A simple prediction model: Add 5% to latest
    const predictedUnits = (latestBill.units * 1.05).toFixed(1);

    const history = bills.map(b => {
      // Calculate individual growth for the table
      const idx = bills.indexOf(b);
      let localGrowth = 0;
      if (idx > 0 && bills[idx - 1].units > 0) {
        localGrowth = ((b.units - bills[idx - 1].units) / bills[idx - 1].units) * 100;
      }

      return {
        id: b.id,
        month: b.billing_month.split(' ')[0].substring(0, 3) + " '" + b.billing_month.split(' ')[1].substring(2),
        units: b.units,
        cost: localGrowth > 0 ? `+${localGrowth.toFixed(1)}` : localGrowth.toFixed(1), // Repurposing 'cost' field as growth %
        status: idx === bills.length - 1 ? 'Current' : 'Recorded'
      };
    });

    res.json({ 
      success: true, 
      data: {
        latestUnits: latestBill.units,
        predictedUnits: predictedUnits,
        growth: growth.toFixed(1),
        history: history.slice(-6) // Return max last 6
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Dynamic AI Insights Generation (Groq)
app.get('/api/insights', verifyToken, async (req, res) => {
  try {
    const bills = await dbAll('SELECT * FROM bills WHERE firebase_uid = ? ORDER BY id ASC', [req.user.uid]);
    
    if (bills.length === 0) {
      return res.json({ success: true, data: [
        { id: '1', title: 'Welcome to UnitTrack!', description: 'Start adding your electricity bills to receive personalized AI analysis based on your real usage.', type: 'primary', tag: 'Getting Started', savings: 'N/A' },
        { id: '2', title: 'Schedule an Energy Audit', description: 'Even without historical data, scheduling a local energy audit can reveal immediate savings opportunities.', type: 'emerald', tag: 'Saving Tip', savings: 'Est. 10%' },
        { id: '3', title: 'Vampire Drain Alert', description: 'Did you know devices plugged in but turned off still drain power? Try unplugging unused electronics.', type: 'orange', tag: 'Alert', savings: 'Est. 5%' }
      ]});
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `
You are an expert AI Energy Advisor. Here is a user's recent electricity billing history:
${JSON.stringify(bills.slice(-6))}

Analyze the data and generate 4 highly personalized and actionable energy-saving insights or alerts based on these specific usage trends.
Respond ONLY with a valid JSON format structured exactly like this array of objects. Do not include markdown formatting or explanation text. Just the array.
[
  {
    "id": 1,
    "title": "Short catchy title",
    "description": "1-2 sentence actionable advice.",
    "tag": "Saving Tip",
    "savings": "Estimated savings (e.g., '15 kWh/mo', 'High Risk', 'Top 10%')",
    "type": "amber" 
  }
]
Note for type field: Choose from "amber", "rose", "orange", "emerald", "primary", "secondary". Use rose/orange for alerts, emerald/primary for savings.
Note for tag field: Choose from "Saving Tip", "Alert", "Achievement", "Opportunity", "Warning", "Efficiency".
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    try {
      const resultText = chatCompletion.choices[0].message.content.trim();
      const cleanedText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const dynamicInsights = JSON.parse(cleanedText);
      res.json({ success: true, data: dynamicInsights });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, "\\nRaw Content:", chatCompletion.choices[0].message.content);
      // Fallback to basic if parse fails
      res.json({ success: true, data: [{ id: 1, title: 'AI Offline', description: 'Failed to generate tailored insights.', type: 'rose', tag: 'Alert', savings: 'N/A' }] });
    }
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
