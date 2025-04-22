/**
 * Netlify Cache Clearing Script
 * 
 * How to use:
 * 1. Install the Netlify CLI: npm install netlify-cli -g
 * 2. Login to Netlify: netlify login
 * 3. Run this script: node clear-netlify-cache.js
 */

const { execSync } = require('child_process');

try {
    console.log('Clearing Netlify cache for YashStore...');
    
    // Get site ID (you need to replace YOUR_SITE_NAME with your actual Netlify site name)
    const siteId = process.env.NETLIFY_SITE_ID || 'YOUR_SITE_NAME';
    
    // Execute Netlify CLI command to clear cache
    execSync(`netlify deploy --prod --site=${siteId} --message="Force deploy with cache clear"`);
    
    console.log('Cache cleared successfully! Your changes should now be visible.');
    console.log('If changes are still not visible, try visiting the site in an incognito window.');
} catch (error) {
    console.error('Error clearing cache:', error.message);
    console.log('Manual steps:');
    console.log('1. Go to https://app.netlify.com/');
    console.log('2. Select your site');
    console.log('3. Go to Deploys > Trigger deploy > Clear cache and deploy site');
}
