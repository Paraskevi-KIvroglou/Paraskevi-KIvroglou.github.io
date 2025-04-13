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
            
            const episodeContainer = document.getElementById('podcast-episodes');
            episodeContainer.innerHTML = ''; // Clear existing content
            
            // Display the 3 most recent episodes
            for (let i = 0; i < Math.min(items.length, 3); i++) {
                const item = items[i];
                const title = item.querySelector('title').textContent;
                const description = item.querySelector('description').textContent;
                const link = item.querySelector('link').textContent;
                
                // Create episode card
                const episodeCard = document.createElement('div');
                episodeCard.className = 'episode-card';
                episodeCard.innerHTML = `
                    <h3>${title}</h3>
                    <p>${description.substring(0, 150)}...</p>
                    <a href="${link}" class="button" target="_blank">Listen Now</a>
                `;
                
                episodeContainer.appendChild(episodeCard);
            }
        }
    } catch (error) {
        console.error('Error fetching podcast episodes:', error);
        document.getElementById('podcast-episodes').innerHTML = `
            <div class="episode-card">
                <h3>Couldn't load episodes</h3>
                <p>Please visit my Substack directly to see the latest episodes.</p>
                <a href="https://kivroglouparaskevi.substack.com" class="button" target="_blank">Visit Substack</a>
            </div>
        `;
    }
}

// Load episodes when the page loads
window.addEventListener('DOMContentLoaded', loadPodcastEpisodes);