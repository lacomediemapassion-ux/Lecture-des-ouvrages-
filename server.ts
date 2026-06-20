import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Safely lazy-initialize Google GenAI
let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// API endpoint to analyze/explain highlighted text from a book
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { text, bookTitle, author, contextOption } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text specified for explanation." });
    }

    const ai = getAI();
    if (!ai) {
      // Fallback local response for robust preview mode when API key is missing
      return res.json({
        text: `[Mode Démo FioBib sans clé d'API] \n\nVous avez surligné ce passage dans "${bookTitle || "Inconnu"}" de ${author || "Inconnu"} : \n*"${text}"*\n\nVoici l'explication littéraire pour ce passage :\nCe segment est emblématique du style de l'auteur. S'il s'agit de Saint-Exupéry, il appelle à raviver la pureté de l'âme d'enfant face au pragmatisme parfois triste des adultes. S'il s'agit de Molière, c'est une dénonciation savoureuse et satirique de l'avarice maladive, dépeignant comment les passions matérielles aliènent l'homme de sa dignité.\n\n*Configurez une clé GEMINI_API_KEY dans les Secrets d'AI Studio pour activer l'analyse personnalisée en direct.*`
      });
    }

    let prompt = "";
    if (contextOption === "explain") {
      prompt = `En tant que critique littéraire et bibliothécaire chaleureux de la bibliothèque "FioBib", explique ce passage tiré du livre "${bookTitle}" écrit par ${author}. \n\nPassage :\n"${text}"\n\nDonne une analyse claire, captivante, accessible et rédigée en français soigné. Explique les thèmes implicites, le ton et s'il y a des subtilités que le lecteur moyen pourrait manquer.`;
    } else if (contextOption === "context") {
      prompt = `Fournis le contexte historique, social ou philosophique de l'œuvre "${bookTitle}" de ${author}, en particulier en relation avec ce passage :\n"${text}"\n\nRédige une réponse enrichissante et vivante en français, digne d'un guide culturel de bibliothèque.`;
    } else if (contextOption === "translate") {
      prompt = `Traduis et commente la qualité littéraire ou le sens profond du passage suivant issu de "${bookTitle}" (${author}) :\n"${text}"\n\nDonne une traduction fluide en anglais, espagnol ou français (selon la langue originelle du passage, si c'est du vieux français, modernise-le) et explique brièvement les choix de tournures poétiques.`;
    } else {
      prompt = `Analyse ce passage de "${bookTitle}" (${author}) :\n"${text}"\n\nRaconte-moi ce qu'il cache comme double sens ou figure de style de manière pédagogique.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es le compagnon de lecture officiel de la bibliothèque FioBib. Tu es passionné, érudit mais extrêmement pédagogue et bienveillant, d'un niveau digne d'un professeur de lettres françaises agrégé. Tu t'exprimes avec élégance sans jargon inutile.",
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error explaining text with Gemini:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini." });
  }
});

// API endpoint for interactive book chat assistant
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, bookTitle, author } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

    const ai = getAI();
    if (!ai) {
      return res.json({
        text: `[Mode Démo FioBib sans clé d'API]\n\nJe suis le Compagnon de Lecture FioBib. J'adore analyser "${bookTitle || "Harry Potter"}" avec vous ! \n\nSans clé d'API configurée, je peux tout de même vous conseiller de prêter attention aux motifs cachés de l'auteur : par exemple, la symbolique de l'amitié véritable qui dépasse les barrières de la pureté du sang ou de la richesse matérielle. \n\nConfigurez votre clé d'API Gemini dans les Secrets d'AI Studio pour libérer l'incroyable érudition en temps réel !`
      });
    }

    // Prepare history inputs or system instruction
    const systemInstruction = `Tu es le Guide Littéraire de la bibliothèque numérique FioBib. Tu accompagnes le lecteur qui est actuellement en train de lire "${bookTitle}" par ${author}. 
Réponds chaleureusement en français à ses questions. Encourage-le, propose des parallèles avec d'autres grands classiques (comme Candide de Voltaire, les Fables de La Fontaine ou la littérature contemporaine).
Sois réactif, amusant et érudit. Parle de l'œuvre originale avec précision historique.`;

    // Extract the latest query
    const latestMessage = messages[messages.length - 1]?.content;

    // We can use the simple generateContent command with chat-like context
    // because it handles single turns or built history formatted by us.
    let chatPromptContent = "Voici l'historique de notre échange :\n";
    messages.forEach((msg: any) => {
      chatPromptContent += `${msg.role === "user" ? "Lecteur" : "Guide FioBib"}: ${msg.content}\n`;
    });
    chatPromptContent += `\nGuide FioBib, formule ta prochaine réponse littéraire, chaleureuse et vivante en français :`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatPromptContent,
      config: {
        systemInstruction,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error communicating with Gemini chat:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini." });
  }
});

// Setup Vite development server or production assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Middlewares Vite chargés en mode développement.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Fichiers statiques servis en mode production.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FioBib Back] Serveur démarré avec succès sur http://localhost:${PORT}`);
  });
}

startServer();
