# Project uitvoeren
## Frontend
1. Open de project map in command-line
1. Ga naar de frontend map (`cd frontend`)
1. Download de dependencies (`npm install`)
1. Voer gulp uit (`gulp`)
1. Open de project in een tweede command-line
1. Ga naar de frontend map (`cd frontend`)
1. Start angular serve (`ng serve`)
1. Open de applicatie in de browser (standaard `http://localhost:4200/`)

## API
1. Open het project in IntelliJ
1. Import `pom.xml` naar Maven
1. Voer clean en install uit
1. Run de Main class
1. Je kan controleren of de API aan staat door het in je browser te bezoeken (standaard `http://localhost:8080/`)

# Configuratie
Het bestand `defaultConfig.json` bevat de standaard configuratie van de applicatie. Deze hoef je niet te veranderen.
Wanneer je andere configuratie wil gebruiken, maak een kopie van `defaultConfig.json` en noem deze `devConfig.json`.
Hier in kan je aanpassen hoe je wil, zonder dat anderen dit te zien krijgen.

__Let op:__ Op dit moment werken alleen de API instellingen, de frontend config werkt nog niet.
