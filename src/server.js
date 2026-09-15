import fs from 'fs';
import dotenv from 'dotenv';
import app from './app.js';

// Prefer .env.local (developer-specific) if present, otherwise fall back to .env
const envPath = fs.existsSync('.env.local') ? '.env.local' : fs.existsSync('.env') ? '.env' : null;
if (envPath) {
	dotenv.config({ path: envPath });
	console.log(`Loaded environment from ${envPath}`);
} else {
	console.warn('No .env file found; relying on system environment variables');
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`CampusFix API running on port ${PORT}`));
