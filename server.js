// server.js - Backend API pour la plateforme QR Codes
// Wanda Success

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Désactiver CSP pour permettre les CDN
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques AVANT les routes
app.use(express.static(__dirname, {
    extensions: ['html'],
    index: false // Ne pas servir index.html automatiquement
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Page d'accueil
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plateforme QR Codes - NOOAXIS & Wanda Success</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
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
            font-weight: 300;
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
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            box-shadow: 0 4px 15px rgba(197, 151, 99, 0.3);
            position: relative;
            overflow: hidden;
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
        .link-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(197, 151, 99, 0.5);
        }
        .link-card .icon {
            font-size: 3em;
            margin-bottom: 15px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        .link-card .title {
            font-size: 1.3em;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .link-card .desc {
            font-size: 0.95em;
            opacity: 0.95;
            line-height: 1.4;
        }
        .footer {
            text-align: center;
            color: #666;
            padding-top: 30px;
            border-top: 2px solid #E5E7EB;
            font-size: 0.95em;
            line-height: 1.8;
        }
        .footer strong {
            color: #C59763;
            font-weight: 600;
        }
        .footer-contact {
            margin-top: 15px;
            color: #888;
            font-size: 0.9em;
        }
        @media (max-width: 768px) {
            .container {
                padding: 30px 20px;
            }
            h1 {
                font-size: 2em;
            }
            .links {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Plateforme QR Codes</h1>
        <div class="subtitle">Wanda Success</div>
        
        <div class="status">
            ✅ Serveur actif et opérationnel • Toutes les applications fonctionnent
        </div>
        
        <div class="links">
            <a href="/qr-platform-dashboard.html" class="link-card">
                <div class="icon">📊</div>
                <div class="title">Dashboard Admin</div>
                <div class="desc">Gérez vos QR codes et consultez les statistiques en temps réel</div>
            </a>
            
            <a href="/contact-form.html" class="link-card">
                <div class="icon">📝</div>
                <div class="title">Formulaire Contact</div>
                <div class="desc">Collecte rapide des informations visiteurs (30 secondes)</div>
            </a>
            
            <a href="/loummel-landing.html" class="link-card">
                <div class="icon">🚀</div>
                <div class="title">Landing Loummel</div>
                <div class="desc">Inscriptions marketplace avec code promo automatique</div>
            </a>
            
            <a href="/mobile-scanner.html" class="link-card">
                <div class="icon">📱</div>
                <div class="title">Scanner Mobile</div>
                <div class="desc">Scanner QR codes avec caméra smartphone/tablette</div>
            </a>
            
            <a href="/wheel-game.html" class="link-card">
                <div class="icon">🎰</div>
                <div class="title">Jeu-Concours</div>
                <div class="desc">Roue de la fortune interactive avec 8 lots à gagner</div>
            </a>
            
            <a href="/api/analytics/dashboard" class="link-card">
                <div class="icon">⚙️</div>
                <div class="title">API Backend</div>
                <div class="desc">Documentation et endpoints de l'API REST</div>
            </a>
        </div>
        
        <div class="footer">
            <p>Plateforme créée avec ❤️ par <strong>Wanda Success</strong></p>
            <div class="footer-contact">
                📱 WhatsApp: +237 688 847 491 | 📧 wandasuccess237@gmail.com
            </div>
        </div>
    </div>
</body>
</html>`);
});

// In-memory storage (replace with PostgreSQL in production)
let contacts = [];
let qrCodes = [];
let scans = [];
let loummelSignups = [];
let wheelResults = [];

// ============================================
// CONTACTS ENDPOINTS
// ============================================

// Create new contact
app.post('/api/contacts', [
    body('email').isEmail().normalizeEmail(),
    body('firstname').trim().notEmpty(),
    body('lastname').trim().notEmpty(),
    body('phone').trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const contact = {
        id: Date.now().toString(),
        ...req.body,
        status: determineStatus(req.body.callback_preference),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    contacts.push(contact);

    // Send welcome email (async)
    sendWelcomeEmail(contact).catch(console.error);

    // Sync to CRM (async)
    syncToCRM(contact).catch(console.error);

    res.status(201).json({
        success: true,
        message: 'Contact créé avec succès',
        data: contact
    });
});

// Get all contacts with filters
app.get('/api/contacts', (req, res) => {
    const { status, search, limit = 50, offset = 0 } = req.query;
    
    let filtered = [...contacts];

    // Filter by status
    if (status && status !== 'all') {
        filtered = filtered.filter(c => c.status === status);
    }

    // Search
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(c =>
            c.firstname?.toLowerCase().includes(searchLower) ||
            c.lastname?.toLowerCase().includes(searchLower) ||
            c.email?.toLowerCase().includes(searchLower) ||
            c.company?.toLowerCase().includes(searchLower)
        );
    }

    // Pagination
    const paginated = filtered.slice(offset, offset + parseInt(limit));

    res.json({
        success: true,
        data: paginated,
        total: filtered.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
    });
});

// Get single contact
app.get('/api/contacts/:id', (req, res) => {
    const contact = contacts.find(c => c.id === req.params.id);
    
    if (!contact) {
        return res.status(404).json({
            success: false,
            message: 'Contact non trouvé'
        });
    }

    res.json({
        success: true,
        data: contact
    });
});

// Update contact
app.put('/api/contacts/:id', (req, res) => {
    const index = contacts.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Contact non trouvé'
        });
    }

    contacts[index] = {
        ...contacts[index],
        ...req.body,
        updated_at: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'Contact mis à jour',
        data: contacts[index]
    });
});

// Delete contact (RGPD)
app.delete('/api/contacts/:id', (req, res) => {
    const index = contacts.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Contact non trouvé'
        });
    }

    contacts.splice(index, 1);

    res.json({
        success: true,
        message: 'Contact supprimé'
    });
});

// Export contacts to CSV
app.get('/api/contacts/export', (req, res) => {
    const csv = generateCSV(contacts);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
});

// ============================================
// QR CODES ENDPOINTS
// ============================================

// Create QR code
app.post('/api/qrcodes', [
    body('name').trim().notEmpty(),
    body('type').isIn(['contact', 'loummel', 'resources', 'vcard', 'appointment', 'social', 'game']),
    body('url').isURL()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const qrCode = {
        id: Date.now().toString(),
        ...req.body,
        scan_count: 0,
        active: true,
        created_at: new Date().toISOString()
    };

    qrCodes.push(qrCode);

    res.status(201).json({
        success: true,
        message: 'QR Code créé',
        data: qrCode
    });
});

// Get all QR codes
app.get('/api/qrcodes', (req, res) => {
    res.json({
        success: true,
        data: qrCodes
    });
});

// Get QR code stats
app.get('/api/qrcodes/:id/stats', (req, res) => {
    const qrCode = qrCodes.find(q => q.id === req.params.id);
    
    if (!qrCode) {
        return res.status(404).json({
            success: false,
            message: 'QR Code non trouvé'
        });
    }

    const qrScans = scans.filter(s => s.qr_code_id === req.params.id);
    const conversions = qrScans.filter(s => s.converted).length;

    res.json({
        success: true,
        data: {
            ...qrCode,
            scans: qrScans,
            total_scans: qrScans.length,
            conversions: conversions,
            conversion_rate: qrScans.length > 0 ? (conversions / qrScans.length * 100).toFixed(2) : 0
        }
    });
});

// Record a scan
app.post('/api/qrcodes/:id/scan', (req, res) => {
    const qrCode = qrCodes.find(q => q.id === req.params.id);
    
    if (!qrCode) {
        return res.status(404).json({
            success: false,
            message: 'QR Code non trouvé'
        });
    }

    const scan = {
        id: Date.now().toString(),
        qr_code_id: req.params.id,
        user_agent: req.headers['user-agent'],
        ip_address: req.ip,
        scanned_at: new Date().toISOString(),
        converted: false
    };

    scans.push(scan);
    qrCode.scan_count++;

    res.json({
        success: true,
        message: 'Scan enregistré',
        data: scan
    });
});

// ============================================
// LOUMMEL ENDPOINTS
// ============================================

// Loummel signup
app.post('/api/loummel/signup', [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().notEmpty(),
    body('phone').trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if already registered
    const existing = loummelSignups.find(s => s.email === req.body.email);
    if (existing) {
        return res.status(400).json({
            success: false,
            message: 'Cet email est déjà inscrit'
        });
    }

    const signup = {
        id: Date.now().toString(),
        ...req.body,
        promo_code: generatePromoCode(),
        created_at: new Date().toISOString()
    };

    loummelSignups.push(signup);

    // Send welcome email with promo code
    sendLoummelWelcomeEmail(signup).catch(console.error);

    res.status(201).json({
        success: true,
        message: 'Inscription réussie à Loummel',
        data: signup
    });
});

// Get Loummel signups
app.get('/api/loummel/signups', (req, res) => {
    res.json({
        success: true,
        data: loummelSignups,
        total: loummelSignups.length
    });
});

// ============================================
// WHEEL GAME ENDPOINTS
// ============================================

// Save wheel result
app.post('/api/wheel/result', [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().notEmpty(),
    body('prize').trim().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const result = {
        id: Date.now().toString(),
        ...req.body,
        created_at: new Date().toISOString()
    };

    wheelResults.push(result);

    // Send prize confirmation email
    sendPrizeConfirmationEmail(result).catch(console.error);

    res.status(201).json({
        success: true,
        message: 'Résultat enregistré',
        data: result
    });
});

// Get wheel stats
app.get('/api/wheel/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            total_plays: wheelResults.length,
            total_winners: wheelResults.length, // All players win something
            prizes_distributed: wheelResults.reduce((acc, r) => {
                acc[r.prize] = (acc[r.prize] || 0) + 1;
                return acc;
            }, {})
        }
    });
});

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

// Dashboard KPIs
app.get('/api/analytics/dashboard', (req, res) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todayContacts = contacts.filter(c => new Date(c.created_at) >= today);
    const todayScans = scans.filter(s => new Date(s.scanned_at) >= today);
    const todayLoummel = loummelSignups.filter(s => new Date(s.created_at) >= today);

    res.json({
        success: true,
        data: {
            total_contacts: contacts.length,
            today_contacts: todayContacts.length,
            total_scans: scans.length,
            today_scans: todayScans.length,
            loummel_signups: loummelSignups.length,
            today_loummel: todayLoummel.length,
            hot_leads: contacts.filter(c => c.status === 'hot').length,
            warm_leads: contacts.filter(c => c.status === 'warm').length,
            cold_leads: contacts.filter(c => c.status === 'cold').length,
            qr_codes_active: qrCodes.filter(q => q.active).length
        }
    });
});

// Generate report
app.get('/api/analytics/reports/:type', (req, res) => {
    const { type } = req.params;
    
    let report;
    
    switch(type) {
        case 'daily':
            report = generateDailyReport();
            break;
        case 'event':
            report = generateEventReport();
            break;
        case 'roi':
            report = generateROIReport();
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Type de rapport invalide'
            });
    }

    res.json({
        success: true,
        data: report
    });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function determineStatus(callbackPreference) {
    if (callbackPreference === 'urgent') return 'hot';
    if (callbackPreference === '48h') return 'warm';
    return 'cold';
}

function generateCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
        Object.values(obj).map(val => 
            typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(',')
    );
    
    return [headers, ...rows].join('\n');
}

function generatePromoCode() {
    return 'FOIRE' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

async function sendWelcomeEmail(contact) {
    // Implement with SendGrid or similar
    console.log(`Sending welcome email to ${contact.email}`);
    // const sgMail = require('@sendgrid/mail');
    // await sgMail.send({ ... });
}

async function syncToCRM(contact) {
    // Implement HubSpot/Salesforce sync
    console.log(`Syncing contact to CRM: ${contact.email}`);
    // await axios.post('https://api.hubapi.com/...', contact);
}

async function sendLoummelWelcomeEmail(signup) {
    console.log(`Sending Loummel welcome to ${signup.email} with code ${signup.promo_code}`);
}

async function sendPrizeConfirmationEmail(result) {
    console.log(`Sending prize confirmation to ${result.email}: ${result.prize}`);
}

function generateDailyReport() {
    return {
        report_type: 'daily',
        date: new Date().toISOString().split('T')[0],
        contacts_collected: contacts.length,
        scans_recorded: scans.length,
        loummel_signups: loummelSignups.length,
        conversion_rate: contacts.length > 0 ? (loummelSignups.length / contacts.length * 100).toFixed(2) : 0
    };
}

function generateEventReport() {
    return {
        report_type: 'event',
        total_contacts: contacts.length,
        total_scans: scans.length,
        total_loummel: loummelSignups.length,
        lead_distribution: {
            hot: contacts.filter(c => c.status === 'hot').length,
            warm: contacts.filter(c => c.status === 'warm').length,
            cold: contacts.filter(c => c.status === 'cold').length
        },
        top_qr_codes: qrCodes
            .sort((a, b) => b.scan_count - a.scan_count)
            .slice(0, 5)
            .map(q => ({ name: q.name, scans: q.scan_count }))
    };
}

function generateROIReport() {
    const avgCustomerValue = 3000; // EUR
    const conversionRate = 0.05; // 5%
    const estimatedRevenue = contacts.length * conversionRate * avgCustomerValue;
    
    return {
        report_type: 'roi',
        total_contacts: contacts.length,
        estimated_customers: Math.round(contacts.length * conversionRate),
        avg_customer_value: avgCustomerValue,
        estimated_revenue: estimatedRevenue,
        cost_per_lead: 12.50, // Example
        roi: ((estimatedRevenue / (contacts.length * 12.50)) * 100).toFixed(2)
    };
}

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/analytics/dashboard`);
    console.log(`🔗 API docs: http://localhost:${PORT}/api/docs`);
});

module.exports = app;