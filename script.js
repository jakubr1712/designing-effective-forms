let clickCount = 0;

const countryInput = document.getElementById('country');
const countryCodeInput = document.getElementById('countryCode');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

const countrySearchInput = document.getElementById('countrySearch');
const suggestionsList = document.getElementById('countrySuggestions');
let allCountries = []; 

function updateSuggestions(inputValue) {
    const matches = allCountries.filter(country =>
        country.toLowerCase().startsWith(inputValue.toLowerCase())
    ).slice(0, 5); 

    suggestionsList.innerHTML = '';

    matches.forEach(country => {
        const li = document.createElement('li');
        li.textContent = country;
        li.classList.add('list-group-item', 'list-group-item-action');
        li.style.cursor = 'pointer';

        li.addEventListener('click', () => {
            countrySearchInput.value = country;
            suggestionsList.innerHTML = '';
            document.getElementById('country').value = country;
            getCountryCode(country);
        });

        suggestionsList.appendChild(li);
    });
}

countrySearchInput.addEventListener('input', () => {
    const inputVal = countrySearchInput.value;
    if (inputVal.length === 0) {
        suggestionsList.innerHTML = '';
        return;
    }
    updateSuggestions(inputVal);
});

countrySearchInput.addEventListener('blur', () => {
    setTimeout(() => suggestionsList.innerHTML = '', 100); 
});


function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        allCountries = data.map(country => country.name.common).sort();

        const options = allCountries.map(country =>
            `<option value="${country}">${country}</option>`
        ).join('');
        countryInput.innerHTML = `<option value="">Wybierz kraj</option>` + options;

        getCountryByIP(); 
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}


function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            if (countryInput) {
                const countryOption = Array.from(countryInput.options).find(opt => opt.value === country);
                if (countryOption) {
                    countryInput.value = country;
                    getCountryCode(country); 
                }
            }
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes[0];
        // Jeśli kod istnieje w select, ustaw go
        const codeOption = Array.from(countryCodeInput.options).find(opt => opt.value === countryCode);
        if (codeOption) {
            countryCodeInput.value = countryCode;
        }
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}

(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', (event) => {
        const active = document.activeElement;
        const isInForm = document.getElementById('form').contains(active);
    
        if (event.key === 'Enter' && isInForm && active.tagName !== 'TEXTAREA') {
            event.preventDefault();
            document.getElementById('form').requestSubmit();
        }
    
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('form').requestSubmit();
        }
    
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
            event.preventDefault();
            const firstField = document.querySelector('#form input:not([type=hidden]), #form select, #form textarea');
            if (firstField) firstField.focus();
        }
    
        if (event.key === 'Escape') {
            const confirmed = confirm('Czy na pewno chcesz wyczyścić formularz?');
            if (confirmed) {
                document.getElementById('form').reset();
            }
        }
    });
    
    fetchAndFillCountries(); 
})();

