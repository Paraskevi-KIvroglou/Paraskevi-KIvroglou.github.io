const https = require('https');

console.log('🔍 Verifying Live Schema on paraskevikivroglou.com');
console.log('='.repeat(50));

// Function to fetch and validate the live page
function verifyLiveSchema() {
    const options = {
        hostname: 'paraskevikivroglou.com',
        port: 443,
        path: '/services.html',
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`📡 Fetched live page (${data.length} bytes)`);
            
            // Extract JSON-LD
            const match = data.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
            
            if (!match) {
                console.log('❌ No JSON-LD found on live page');
                return;
            }
            
            try {
                const jsonLd = JSON.parse(match[1]);
                console.log('✅ Live JSON-LD is valid JSON');
                console.log(`📋 Schema Type: ${jsonLd['@type']}`);
                
                // Check for Review schema
                if (jsonLd.review && !jsonLd.reviews) {
                    console.log('❌ CRITICAL: Live page still has "review" (singular) instead of "reviews" (plural)');
                    console.log('   This means the changes haven\'t been deployed yet');
                } else if (jsonLd.reviews && Array.isArray(jsonLd.reviews)) {
                    console.log(`✅ Live page has correct "reviews" array: ${jsonLd.reviews.length} review(s)`);
                    console.log('   The validation tool might be using cached data');
                } else {
                    console.log('⚠️  No reviews found in live schema');
                }
                
            } catch (error) {
                console.log(`❌ Error parsing live JSON-LD: ${error.message}`);
            }
        });
    });
    
    req.on('error', (error) => {
        console.log(`❌ Error fetching live page: ${error.message}`);
        console.log('   This might be a network issue or the site is down');
    });
    
    req.end();
}

verifyLiveSchema();
