
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('loadUser');
    const userDisplay = document.getElementById('userDisplay');
    const countryDisplay = document.getElementById('countryDisplay');
    const exchangeDisplay = document.getElementById('exchangeDisplay');
    const newsDisplay = document.getElementById('newsDisplay');
    const loadingElement = document.getElementById('loading');
    

    button.addEventListener('click', async function() {
        if (loadingElement) loadingElement.style.display = 'block';
        
        try {
            const userResponse = await fetch('/random-user');
            if (!userResponse.ok) throw new Error('Failed to get user data');
            const userData = await userResponse.json();
            const user = userData.user;
            const country = user.country;
            
            userDisplay.innerHTML = `
                <div class="user-card">
                    <img src="${user.picture}" alt="Profile picture">
                    <h3>${user.name}</h3>
                    <p><strong>Gender:</strong> ${user.gender}</p>
                    <p><strong>Age:</strong> ${user.age}</p>
                    <p><strong>Birth Date:</strong> ${user.dob}</p>
                    <p><strong>Location:</strong> ${user.city}, ${country}</p>
                    <p><strong>Address:</strong> ${user.address}</p>
                </div>`;
            const countryResponse = await fetch(`/country-info/${encodeURIComponent(country)}`);
            const countryInfo = await countryResponse.json();
            
            countryDisplay.innerHTML = `
                <div class="country-card">
                    <img src="${countryInfo.flag}" alt="Flag" class="flag">
                    <h3>${countryInfo.name}</h3>
                    <p><strong>Capital:</strong> ${countryInfo.capital}</p>
                    <p><strong>Languages:</strong> ${countryInfo.languages}</p>
                    <p><strong>Currency:</strong> ${countryInfo.currencyName} (${countryInfo.currencyCode})</p>
                </div>`;
            
            let exchangeRates = { usd: 'N/A', kzt: 'N/A' };
            if (countryInfo.currencyCode && countryInfo.currencyCode !== 'Unknown') {
                const exchangeResponse = await fetch(`/exchange-rate/${countryInfo.currencyCode}`);
                exchangeRates = await exchangeResponse.json();
            }
            exchangeDisplay.innerHTML = `
                <div class="exchange-card">
                    <p>1 ${countryInfo.currencyCode} = ${exchangeRates.usd} USD</p>
                    <p>1 ${countryInfo.currencyCode} = ${exchangeRates.kzt} KZT</p>
                </div>`;
            
            const newsResponse = await fetch(`/news/${encodeURIComponent(country)}`);
            const news = await newsResponse.json();
            if (news.length > 0) {
                let newsHTML = '<div class="news-grid">';
                news.forEach(article => {
                    newsHTML += `
                        <div class="news-card">
                            ${article.image ? `<img src="${article.image}" alt="News image">` : ''}
                            <h4>${article.title}</h4>
                            <p>${article.description}</p>
                            <a href="${article.url}" target="_blank">Read more →</a>
                        </div>
                    `;
                });
                newsHTML += '</div>';
                newsDisplay.innerHTML = newsHTML;
            } else {
                newsDisplay.innerHTML = '<p class="no-news">No news available for this country</p>';
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            if (loadingElement) loadingElement.style.display = 'none';
        }
    });
});