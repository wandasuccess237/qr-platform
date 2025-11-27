// server.js - Backend API avec stockage JSON
// Wanda Success

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Fichier de stockage JSON
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// Initialiser le fichier contacts.json s'il n'existe pas
async function initContactsFile() {
    try {
        await fs.access(CONTACTS_FILE);
    } catch {
        await fs.writeFile(CONTACTS_FILE, JSON.stringify([], null, 2));
        console.log('✅ Fichier contacts.json créé');
    }
}

initContactsFile();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(__dirname, {
    extensions: ['html'],
    index: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// ============================================
// API CONTACTS
// ============================================

// GET /api/contacts - Récupérer tous les contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const data = await fs.readFile(CONTACTS_FILE, 'utf8');
        const contacts = JSON.parse(data);
        res.json(contacts);
    } catch (error) {
        console.error('Erreur lecture contacts:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /api/contacts - Ajouter un nouveau contact
app.post('/api/contacts', [
    body('firstname').trim().notEmpty(),
    body('lastname').trim().notEmpty(),
    body('email').isEmail(),
    body('phone').trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Lire les contacts existants
        const data = await fs.readFile(CONTACTS_FILE, 'utf8');
        const contacts = JSON.parse(data);

        // Créer le nouveau contact
        const newContact = {
            id: Date.now().toString(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            company: req.body.company || '',
            position: req.body.position || '',
            sector: req.body.sector || '',
            companySize: req.body.companySize || '',
            needs: req.body.needs || '',
            loummelInterest: req.body.loummelInterest || 'Non précisé',
            leadStatus: req.body.leadStatus || 'Warm',
            source: req.body.source || 'Formulaire web',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Ajouter le nouveau contact
        contacts.push(newContact);

        // Sauvegarder
        await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));

        console.log('✅ Nouveau contact enregistré:', newContact.email);
        res.status(201).json({ 
            success: true, 
            message: 'Contact enregistré avec succès',
            contact: newContact 
        });
    } catch (error) {
        console.error('Erreur enregistrement contact:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE /api/contacts/:id - Supprimer un contact
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const data = await fs.readFile(CONTACTS_FILE, 'utf8');
        let contacts = JSON.parse(data);
        
        const initialLength = contacts.length;
        contacts = contacts.filter(c => c.id !== req.params.id);
        
        if (contacts.length === initialLength) {
            return res.status(404).json({ error: 'Contact non trouvé' });
        }

        await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
        
        console.log('✅ Contact supprimé:', req.params.id);
        res.json({ success: true, message: 'Contact supprimé' });
    } catch (error) {
        console.error('Erreur suppression contact:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ============================================
// PAGE D'ACCUEIL
// ============================================

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plateforme QR Codes - Wanda Success</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #C59763 0%, #785A3C 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 50px auto;
            background: white;
            border-radius: 20px;
            padding: 50px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #C59763;
            text-align: center;
            margin-bottom: 10px;
            font-size: 2.8em;
            font-weight: 700;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 40px;
            font-size: 1.2em;
        }
        .status {
            background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
            color: #065F46;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 40px;
            font-weight: 600;
            font-size: 1.1em;
            border: 2px solid #10B981;
        }
        .links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        .link-card {
            background: linear-gradient(135deg, #C59763 0%, #9B7653 100%);
            padding: 30px 20px;
            border-radius: 15px;
            text-decoration: none;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .link-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(197, 151, 99, 0.4);
        }
        .link-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        .link-card:hover::before {
            left: 100%;
        }
        .link-icon {
            font-size: 3em;
            margin-bottom: 15px;
        }
        .link-title {
            font-size: 1.4em;
            font-weight: 600;
            margin-bottom: 10px;
            text-align: center;
        }
        .link-description {
            font-size: 0.9em;
            opacity: 0.95;
            text-align: center;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
            color: #666;
            padding-top: 30px;
            border-top: 2px solid #eee;
        }
        .footer-contacts {
            margin-top: 15px;
            font-size: 0.95em;
            color: #C59763;
            font-weight: 500;
        }
        @media (max-width: 768px) {
            .container { padding: 30px 20px; }
            h1 { font-size: 2em; }
            .links { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Plateforme QR Codes</h1>
        <p class="subtitle">Wanda Success - Marketplace & Solutions Digitales</p>
        
        <div class="status">
            ✅ Serveur actif et opérationnel • Toutes les applications fonctionnent
        </div>

        <div class="links">
            <a href="/qr-platform-dashboard.html" class="link-card">
                <div class="link-icon">📊</div>
                <div class="link-title">Dashboard Admin</div>
                <div class="link-description">Gérez vos QR codes, consultez les statistiques et exportez vos contacts</div>
            </a>

            <a href="/contact-form.html" class="link-card">
                <div class="link-icon">📝</div>
                <div class="link-title">Formulaire Contact</div>
                <div class="link-description">Collectez les informations de vos visiteurs en 30 secondes</div>
            </a>

            <a href="/loummel-landing.html" class="link-card">
                <div class="link-icon">🚀</div>
                <div class="link-title">Landing Loummel</div>
                <div class="link-description">Page d'inscription à la marketplace avec code promo automatique</div>
            </a>

            <a href="/vcard-wanda.html" class="link-card">
                <div class="link-icon">📇</div>
                <div class="link-title">Carte de Visite</div>
                <div class="link-description">Enregistrement automatique du contact Wanda Success</div>
            </a>

            <a href="/appointment-booking.html" class="link-card">
                <div class="link-icon">📅</div>
                <div class="link-title">Prise de RDV</div>
                <div class="link-description">Réservation de rendez-vous en ligne en 3 étapes</div>
            </a>

            <a href="/social-media.html" class="link-card">
                <div class="link-icon">🌐</div>
                <div class="link-title">Réseaux Sociaux</div>
                <div class="link-description">Hub centralisé de tous nos réseaux sociaux</div>
            </a>

            <a href="/mobile-scanner.html" class="link-card">
                <div class="link-icon">📱</div>
                <div class="link-title">Scanner Mobile</div>
                <div class="link-description">Scanner de QR codes optimisé pour mobile</div>
            </a>

            <a href="/wheel-game.html" class="link-card">
                <div class="link-icon">🎰</div>
                <div class="link-title">Jeu-Concours</div>
                <div class="link-description">Roue de la fortune interactive pour engager vos visiteurs</div>
            </a>

            <a href="/api/contacts" class="link-card">
                <div class="link-icon">🔌</div>
                <div class="link-title">API Backend</div>
                <div class="link-description">Accès direct aux données JSON (format API REST)</div>
            </a>
        </div>

        <div class="footer">
            <p><strong>Wanda Success</strong> - Marketplace & Solutions Digitales</p>
            <p class="footer-contacts">
                📱 +237 688 847 491 | 📧 wandasuccess237@gmail.com
            </p>
        </div>
    </div>
</body>
</html>`);
});

// ============================================
// DÉMARRAGE SERVEUR
// ============================================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  🚀 Serveur Wanda Success démarré !                      ║
║                                                           ║
║  📍 Port: ${PORT}                                    ║
║  📊 Stockage: contacts.json (fichier local)              ║
║  🌐 URL: http://localhost:${PORT}                    ║
║                                                           ║
║  ✅ API Contacts: /api/contacts                          ║
║  ✅ Dashboard: /qr-platform-dashboard.html               ║
║  ✅ Formulaire: /contact-form.html                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur non gérée:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Promise rejetée:', error);
});
