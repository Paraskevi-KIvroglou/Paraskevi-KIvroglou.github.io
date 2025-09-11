const fs = require('fs');

// Read the speaking.html file
const content = fs.readFileSync('speaking.html', 'utf8');

// Extract JSON-LD content
const match = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

if (match) {
    try {
        const jsonLd = JSON.parse(match[1]);
        console.log('✅ JSON-LD is valid JSON');
        
        // Check for Event schema requirements
        if (jsonLd.performerIn && Array.isArray(jsonLd.performerIn)) {
            console.log(`✅ Found ${jsonLd.performerIn.length} events in performerIn array`);
            
            jsonLd.performerIn.forEach((event, index) => {
                console.log(`\n--- Event ${index + 1}: ${event.name} ---`);
                
                // Check required fields
                const requiredFields = ['startDate', 'location'];
                const missingRequired = requiredFields.filter(field => !event[field]);
                
                if (missingRequired.length === 0) {
                    console.log('✅ All required fields present');
                } else {
                    console.log(`❌ Missing required fields: ${missingRequired.join(', ')}`);
                }
                
                // Check recommended fields
                const recommendedFields = ['endDate', 'offers', 'image', 'organizer', 'performer'];
                const presentRecommended = recommendedFields.filter(field => event[field]);
                console.log(`✅ Present recommended fields: ${presentRecommended.join(', ')}`);
                
                // Validate specific fields
                if (event.startDate) {
                    console.log(`✅ startDate: ${event.startDate}`);
                }
                if (event.location) {
                    console.log(`✅ location: ${event.location.name || 'Unnamed location'}`);
                }
                if (event.offers) {
                    console.log(`✅ offers: ${event.offers.price} ${event.offers.priceCurrency}`);
                }
            });
        } else {
            console.log('❌ No performerIn array found');
        }
        
    } catch (e) {
        console.log('❌ JSON-LD is invalid JSON:', e.message);
    }
} else {
    console.log('❌ No JSON-LD found in file');
}
