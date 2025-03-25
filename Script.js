// Funzione per ottenere il prezzo di XAU/USD da Alpha Vantage
async function getXAUUSD() {
    const apiKey = 'YOUR_API_KEY'; // Inserisci la tua API key qui
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=XAUUSD&interval=5min&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data['Time Series (5min)']) {
            const latestTime = Object.keys(data['Time Series (5min)'])[0];
            const latestData = data['Time Series (5min)'][latestTime];
            const closePrice = parseFloat(latestData['4. close']);
            return closePrice;
        } else {
            console.error('Errore nel recupero dei dati.');
            return null;
        }
    } catch (error) {
        console.error('Errore nella richiesta API:', error);
        return null;
    }
}

// Funzione per determinare il segnale
function determineSignal(price) {
    if (price > 1900) {
        return 'BUY';
    } else if (price < 1800) {
        return 'SELL';
    } else {
        return 'WAIT';
    }
}

// Funzione per aggiornare il segnale nel sito
async function updateSignal() {
    const price = await getXAUUSD();
    const signalText = document.getElementById('signal-text');

    if (price !== null) {
        const signal = determineSignal(price);
        signalText.textContent = `Segnale: ${signal} (Prezzo: $${price.toFixed(2)})`;
    } else {
        signalText.textContent = 'Errore nel caricamento dei dati.';
    }
}

// Aggiorna il segnale ogni 5 minuti
setInterval(updateSignal, 300000);
updateSignal();  // Esegui subito al caricamento della pagina
