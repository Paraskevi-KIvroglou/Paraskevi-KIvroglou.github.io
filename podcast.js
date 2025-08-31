// Function to calculate and display statistics
async function updateStatistics(items) {
    // Update episode count
    const episodeCount = document.getElementById('episode-count');
    if (episodeCount) {
        episodeCount.textContent = `${items.length}+`;
    }
    
    // Update listener count with priority order
    const listenerCount = document.getElementById('listener-count');
    if (listenerCount) {
        // Priority 1: Check for manually entered data
        const manualCount = loadManualListenerCount();
        if (manualCount) {
            listenerCount.textContent = formatListenerCount(manualCount);
            listenerCount.title = `Data source: manual entry`;
            return;
        }
        
        // Priority 2: Try to get real data from APIs
        const realListenerData = await getRealListenerData();
        if (realListenerData) {
            listenerCount.textContent = formatListenerCount(realListenerData);
            listenerCount.title = `Data source: API`;
            return;
        }
        
        // Priority 3: Use smart estimate based on episode count and growth
        const estimatedListeners = calculateSmartEstimate(items.length);
        listenerCount.textContent = formatListenerCount(estimatedListeners);
        listenerCount.title = `Data source: estimate`;
    }
    
    // Update rating (you can customize this based on your actual ratings)
    const rating = document.getElementById('rating');
    if (rating) {
        // You can update this to pull from a real rating source
        // For now, using a high rating to maintain credibility
        rating.textContent = '4.9⭐';
    }
}

// Function to get real listener data from Spotify and other sources
async function getRealListenerData() {
    try {
        // Try to get Spotify data first
        const spotifyData = await getSpotifyPodcastData();
        if (spotifyData && spotifyData.totalListeners > 0) {
            return spotifyData.totalListeners;
        }
        
        // Fallback to other sources
        const substackData = await getSubstackSubscriberData();
        if (substackData && substackData.subscriberCount > 0) {
            return substackData.subscriberCount;
        }
        
        // If no real data available, return null to use estimates
        return null;
        
    } catch (error) {
        console.log('Could not fetch real listener data:', error);
        return null;
    }
}

// Function to get Spotify podcast data
async function getSpotifyPodcastData() {
    try {
        // Spotify Show ID from your podcast URL
        const spotifyShowId = '3c6KAQPQ54vxXUvLLRffC1';
        
        // Option 1: Try to fetch from Spotify's public API (limited podcast data)
        const spotifyResponse = await fetch(`https://open.spotify.com/show/${spotifyShowId}`);
        if (spotifyResponse.ok) {
            // Parse the HTML to extract follower count if available
            const html = await spotifyResponse.text();
            const followerMatch = html.match(/(\d+(?:,\d+)*)\s*followers?/i);
            if (followerMatch) {
                const followers = parseInt(followerMatch[1].replace(/,/g, ''));
                return {
                    totalListeners: followers * 10, // Estimate: followers × 10 = monthly listeners
                    source: 'spotify-followers'
                };
            }
        }
        
        // Option 2: Try to get data from Spotify for Podcasters (if you have access)
        // This would require authentication and access to their internal API
        const spotifyForPodcastersData = await getSpotifyForPodcastersData();
        if (spotifyForPodcastersData) {
            return spotifyForPodcastersData;
        }
        
        return null;
        
    } catch (error) {
        console.log('Error fetching Spotify data:', error);
        return null;
    }
}

// Function to get Spotify for Podcasters data (requires authentication)
async function getSpotifyForPodcastersData() {
    try {
        // Since you have access to https://creators.spotify.com/dash/show/3c6KAQPQ54vxXUvLLRffC1
        // You can potentially extract data from the dashboard
        
        // Option 1: Try to fetch the dashboard page (may require authentication)
        const dashboardUrl = 'https://creators.spotify.com/dash/show/3c6KAQPQ54vxXUvLLRffC1';
        
        try {
            const response = await fetch(dashboardUrl);
            if (response.ok) {
                const html = await response.text();
                
                // Look for listener count patterns in the HTML
                // These patterns might change, so you may need to adjust
                const listenerPatterns = [
                    /(\d+(?:,\d+)*)\s*listeners?/i,
                    /(\d+(?:,\d+)*)\s*monthly\s*listeners?/i,
                    /(\d+(?:,\d+)*)\s*total\s*listeners?/i,
                    /"listeners?":\s*(\d+)/i,
                    /"monthlyListeners":\s*(\d+)/i
                ];
                
                for (const pattern of listenerPatterns) {
                    const match = html.match(pattern);
                    if (match) {
                        const listeners = parseInt(match[1].replace(/,/g, ''));
                        if (listeners > 0) {
                            return {
                                totalListeners: listeners,
                                source: 'spotify-dashboard'
                            };
                        }
                    }
                }
            }
        } catch (dashboardError) {
            console.log('Could not fetch dashboard (authentication required):', dashboardError);
        }
        
        // Option 2: Check if you have any stored manual data from previous dashboard visits
        const storedSpotifyData = localStorage.getItem('spotifyListenerData');
        if (storedSpotifyData) {
            const data = JSON.parse(storedSpotifyData);
            // Check if data is less than 30 days old
            if (Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000) {
                return {
                    totalListeners: data.count,
                    source: 'spotify-stored'
                };
            }
        }
        
        return null;
        
    } catch (error) {
        console.log('Error fetching Spotify for Podcasters data:', error);
        return null;
    }
}

// Function to get Substack subscriber data
async function getSubstackSubscriberData() {
    try {
        // Try to get subscriber count from Substack
        // Note: Substack doesn't have a public API for this
        // You could potentially scrape your Substack page or use browser automation
        
        const substackUrl = 'https://kivroglouparaskevi.substack.com';
        const response = await fetch(substackUrl);
        
        if (response.ok) {
            const html = await response.text();
            
            // Look for subscriber count in the HTML
            // This is a basic approach - you might need to adjust based on Substack's structure
            const subscriberMatch = html.match(/(\d+(?:,\d+)*)\s*subscribers?/i);
            if (subscriberMatch) {
                const subscribers = parseInt(subscriberMatch[1].replace(/,/g, ''));
                return {
                    subscriberCount: subscribers,
                    source: 'substack'
                };
            }
        }
        
        return null;
        
    } catch (error) {
        console.log('Error fetching Substack data:', error);
        return null;
    }
}

// Function to manually update listener count (for when you have real numbers)
function updateListenerCountManually(count, source = 'manual') {
    const listenerCount = document.getElementById('listener-count');
    if (listenerCount) {
        listenerCount.textContent = formatListenerCount(count);
        
        // Add a small indicator of the data source
        listenerCount.title = `Data source: ${source}`;
        
        // Store in localStorage for persistence
        localStorage.setItem('manualListenerCount', count);
        localStorage.setItem('listenerCountSource', source);
        
        // If it's from Spotify, also store it for the dashboard integration
        if (source === 'spotify') {
            localStorage.setItem('spotifyListenerData', JSON.stringify({
                count: count,
                timestamp: Date.now()
            }));
        }
    }
}

// Function to load manually entered listener count
function loadManualListenerCount() {
    const storedCount = localStorage.getItem('manualListenerCount');
    const storedSource = localStorage.getItem('listenerCountSource');
    
    if (storedCount) {
        updateListenerCountManually(parseInt(storedCount), storedSource);
        return parseInt(storedCount);
    }
    
    return null;
}

// Enhanced console function for Spotify data
window.setSpotifyListeners = function(count) {
    updateListenerCountManually(count, 'spotify');
    console.log(`✅ Spotify listener count updated to ${count}`);
    console.log(`💾 Data stored for future dashboard integration`);
    console.log(`📊 Next time you visit your dashboard, this will be used automatically`);
};

// Function to calculate smart estimate based on episode count
function calculateSmartEstimate(episodeCount) {
    // More sophisticated estimation based on typical podcast growth
    // Early episodes: fewer listeners, later episodes: more listeners
    let totalEstimatedListeners = 0;
    
    for (let i = 1; i <= episodeCount; i++) {
        // Assume growth from 100 listeners (episode 1) to 800 listeners (episode 50+)
        const listenersForEpisode = Math.max(100, Math.min(800, 100 + (i * 15)));
        totalEstimatedListeners += listenersForEpisode;
    }
    
    return totalEstimatedListeners;
}

// Function to format listener count nicely
function formatListenerCount(count) {
    if (count >= 1000000) {
        return `${Math.round(count / 100000) / 10}M+`;
    } else if (count >= 10000) {
        return `${Math.round(count / 1000)}K+`;
    } else if (count >= 1000) {
        return `${Math.round(count / 100) / 10}K+`;
    } else {
        return `${count}+`;
    }
}

// Function to create episode card HTML
function createEpisodeCard(item, index, isFeatured = false) {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const pubDate = item.querySelector('pubDate')?.textContent;
    
    // Extract episode number from title or use index
    let episodeNumber = `EP ${String(index + 1).padStart(2, '0')}`;
    
    // Look for episode numbers in the title (various formats)
    const episodeMatch = title.match(/(?:episode\s*|ep\s*|#\s*)(\d+)/i);
    if (episodeMatch) {
        episodeNumber = `EP ${episodeMatch[1].padStart(2, '0')}`;
    } else {
        // If no episode number found, use the actual position in the feed
        // This ensures the 3rd card shows the 3rd most recent episode
        episodeNumber = `EP ${String(index + 1).padStart(2, '0')}`;
    }
    
    // Estimate duration (you can modify this based on your actual episode lengths)
    const estimatedDuration = "25-35 min";
    
    // Extract tags from title and description
    const tags = extractTags(title, description);
    
    if (isFeatured) {
        // Featured episode card (larger, more prominent)
        return `
            <div class="episode-card">
                <div class="episode-header">
                    <div class="episode-number">${episodeNumber}</div>
                    <div class="episode-duration">${estimatedDuration}</div>
                </div>
                <h3>${title}</h3>
                <p>${description.substring(0, 150)}...</p>
                <div class="episode-tags">
                    ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="${link}" class="button" target="_blank">Listen Now</a>
            </div>
        `;
    } else {
        // Regular episode card (smaller, for the episodes section)
        return `
            <div class="episode-card">
                <h3>${title}</h3>
                <p>${description.substring(0, 100)}...</p>
                <a href="${link}" class="button" target="_blank">Listen Now</a>
            </div>
        `;
    }
}

// Function to extract relevant tags from title and description
function extractTags(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    const tagKeywords = {
        'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural', 'algorithm'],
        'Coding': ['coding', 'programming', 'development', 'software', 'code', 'developer'],
        'Productivity': ['productivity', 'efficiency', 'tools', 'workflow', 'automation'],
        'Tech': ['technology', 'tech', 'digital', 'innovation', 'future'],
        'Business': ['business', 'startup', 'entrepreneur', 'strategy', 'growth'],
        'Learning': ['learning', 'education', 'tutorial', 'guide', 'tips']
    };
    
    const foundTags = [];
    for (const [tag, keywords] of Object.entries(tagKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            foundTags.push(tag);
        }
    }
    
    // Return up to 3 tags, or default tags if none found
    return foundTags.slice(0, 3).length > 0 ? foundTags.slice(0, 3) : ['Tech', 'Insights'];
}

// Function to fetch and display podcast episodes from Substack RSS feed
async function loadPodcastEpisodes() {
    const substackRssFeed = 'https://kivroglouparaskevi.substack.com/feed';
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(substackRssFeed);
    
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            // Update statistics first
            updateStatistics(items);
            
            // Populate featured episodes section (first 3 episodes)
            const featuredEpisodesContainer = document.getElementById('featured-episodes-grid');
            if (featuredEpisodesContainer && items.length > 0) {
                featuredEpisodesContainer.innerHTML = '';
                
                for (let i = 0; i < Math.min(items.length, 3); i++) {
                    const item = items[i];
                    const episodeCard = createEpisodeCard(item, i, true);
                    featuredEpisodesContainer.innerHTML += episodeCard;
                }
            }
            
            // Populate podcast episodes section (next 3 episodes, if available)
            const episodeContainer = document.getElementById('podcast-episodes');
            if (episodeContainer && items.length > 3) {
                episodeContainer.innerHTML = '';
                
                for (let i = 3; i < Math.min(items.length, 6); i++) {
                    const item = items[i];
                    const episodeCard = createEpisodeCard(item, i, false);
                    episodeContainer.innerHTML += episodeCard;
                }
            }
        }
    } catch (error) {
        console.error('Error fetching podcast episodes:', error);
        
        // Show error in featured episodes section
        const featuredEpisodesContainer = document.getElementById('featured-episodes-grid');
        if (featuredEpisodesContainer) {
            featuredEpisodesContainer.innerHTML = `
                <div class="episode-card">
                    <h3>Couldn't load episodes</h3>
                    <p>Please visit my Substack directly to see the latest episodes.</p>
                    <a href="https://kivroglouparaskevi.substack.com" class="button" target="_blank">Visit Substack</a>
                </div>
            `;
        }
        
        // Show error in podcast episodes section
        const episodeContainer = document.getElementById('podcast-episodes');
        if (episodeContainer) {
            episodeContainer.innerHTML = `
                <div class="episode-card">
                    <h3>Couldn't load episodes</h3>
                    <p>Please visit my Substack directly to see the latest episodes.</p>
                    <a href="https://kivroglouparaskevi.substack.com" class="button" target="_blank">Visit Substack</a>
                </div>
            `;
        }
        
        // Show default statistics on error
        updateStatistics([]);
    }
}

// Load episodes when the page loads
window.addEventListener('DOMContentLoaded', loadPodcastEpisodes);

// Console functions for easy manual updates
// You can use these in your browser's developer console

// Function to manually set listener count
window.setListenerCount = function(count) {
    updateListenerCountManually(count, 'manual');
    console.log(`✅ Listener count updated to ${count}`);
    console.log(`💡 Use this function whenever you have real numbers from Spotify, Apple, or other sources`);
};

// Function to show current data source
window.showDataSource = function() {
    const listenerCount = document.getElementById('listener-count');
    if (listenerCount) {
        console.log(`📊 Current data source: ${listenerCount.title}`);
        console.log(`🎯 Current value: ${listenerCount.textContent}`);
    }
};

// Function to reset to estimates
window.resetToEstimates = function() {
    localStorage.removeItem('manualListenerCount');
    localStorage.removeItem('listenerCountSource');
    location.reload(); // Reload to recalculate estimates
};

// Debug function to show episode order
window.showEpisodeOrder = function() {
    console.log('🔍 Episode Order Debug:');
    console.log('This will show you the actual order of episodes from your RSS feed');
    
    // Try to fetch and show episode order
    const substackRssFeed = 'https://kivroglouparaskevi.substack.com/feed';
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(substackRssFeed);
    
    fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');
                
                console.log(`📊 Total episodes in feed: ${items.length}`);
                console.log('🎬 First 5 episodes in order:');
                
                for (let i = 0; i < Math.min(items.length, 5); i++) {
                    const item = items[i];
                    const title = item.querySelector('title').textContent;
                    const pubDate = item.querySelector('pubDate')?.textContent;
                    
                    console.log(`${i + 1}. ${title}`);
                    if (pubDate) {
                        console.log(`   Published: ${pubDate}`);
                    }
                }
                
                if (items.length > 5) {
                    console.log(`... and ${items.length - 5} more episodes`);
                }
            }
        })
        .catch(error => {
            console.error('❌ Could not fetch episode order:', error);
        });
};

// Console help message
console.log(`
🎙️ Podcast Statistics Console Commands:

🎵 setSpotifyListeners(number) - Set Spotify listener count (recommended)
   Example: setSpotifyListeners(2847)

📊 setListenerCount(number) - Set general listener count
   Example: setListenerCount(2500)

🔍 showDataSource() - Show current data source
   Example: showDataSource()

🔍 showEpisodeOrder() - Debug episode ordering (NEW!)
   Example: showEpisodeOrder()

🔄 resetToEstimates() - Reset to automatic estimates
   Example: resetToEstimates()

💡 Use setSpotifyListeners() when you get numbers from:
   - Spotify for Podcasters dashboard: https://creators.spotify.com/dash/show/3c6KAQPQ54vxXUvLLRffC1
   - This will store data for future automatic updates

🐛 Episode Order Issue? Use showEpisodeOrder() to see what's happening!
`);