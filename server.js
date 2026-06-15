const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON payloads
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory database to store leads during server runtime
const leads = [];

/**
 * API Endpoint to receive conversion leads from the frontend
 */
app.post('/api/lead', (req, res) => {
    const { source, timestamp, url } = req.body;

    if (!source) {
        return res.status(400).json({ 
            success: false, 
            message: 'El campo "source" es requerido para registrar el lead.' 
        });
    }

    const newLead = {
        id: leads.length + 1,
        source,
        timestamp: timestamp || new Date().toISOString(),
        url: url || 'N/A',
        userAgent: req.headers['user-agent']
    };

    leads.push(newLead);
    
    // Log the lead registration in the terminal
    console.log(`[Node.js Server] 🌟 Nuevo lead registrado! ID: ${newLead.id} | Origen: ${source} | Hora: ${newLead.timestamp}`);

    return res.status(201).json({
        success: true,
        message: 'Lead registrado exitosamente.',
        lead: newLead
    });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        platform: 'node.js',
        version: process.version,
        totalLeads: leads.length
    });
});

// Fallback to index.html for single page layout routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Servidor Node.js corriendo en http://localhost:${PORT}`);
    console.log(`📂 Sirviendo archivos estáticos desde la carpeta 'public'`);
    console.log(`==================================================\n`);
});
