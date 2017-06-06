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
Je kan properties weglaten uit `devConfig.json`, in dat geval worden de standaardwaarden uit `defaultConfig.json` gebruikt.

__Let op:__ Op dit moment werken alleen de API instellingen, de frontend config werkt nog niet.

# Handige commands
## NPM
`npm install` Installeerd alle dependencies  
`npm install some-package` Installeerd _some-package_  
`npm install some-package --save` Installeerd _some-package_ en zet het in `package.json`  
`npm install some-package -g` Installeerd _some-package_ globaal op je computer

__Let op:__ zorg dat je in de `ipsen5/frontend` map zit wanneer je deze commands uitvoerd.

### Toevoegen aan Angular
Wanneer je een script, css of asset uit een package die met NPM geïnstalleerd is aan Angular toe wil voegen:
1. Vind het bestand in `frontend/node_modules/some-package`
1. Voeg het toe in `frontend/.angular-cli.json` in de `assets`, `styles` of `scripts` array
    * node_modules staat een map hoger dan .angular-cli.json, dus begin je pad met `../node_modules/etc`
1. Dit bestand wordt nu automatisch geladen, je hoeft het niet in index.html toe te voegen

## Angular CLI:
`npm install -g @angular/cli` Installeer angular cli  
`ng g component Home` Maakt een Home Component aan  
`ng serve` Start een lokale server op port 4200  
`ng build` Bouwt een mapje /dist/ met alle productie bestanden  

__Component:__	`ng g component my-new-component`  
__Directive:__	`ng g directive my-new-directive`  
__Pipe:__		`ng g pipe my-new-pipe`  
__Service:__	`ng g service my-new-service`  
__Clas:s__		`ng g class my-new-class`  
__Guard:__		`ng g guard my-new-guard`  
__Interface:__	`ng g interface my-new-interface`  
__Enum:__		`ng g enum my-new-enum`  
__Module:__		`ng g module my-module`  

## Gulp:
`npm install --global gulp`  Installeer gulp  
`gulp watch` Automatic compiling van .sass bestanden in /sass/ folder --> app.css  
`gulp` Compiles sass, en watch'd  
`gulp dev` Compressed css file  

## Typescript types
Wanneer je een library installeerd, en deze komt standaard niet met typescript types, kan je deze installeren met het volgende command:  
`npm install @types/some-package-name --save-dev`  

Hoe je deze in je typescript gebruikt kan per library verschillen. Het toevoegen aan de pagina en het toegang hebben tot de types in .ts bestanden zijn vaak twee verschillende dingen.  
In je .ts bestanden kan je de volgende opties proberen:
* `import 'some-package-name'`
* `import * as SomePackageName from 'some-package-name'`
* `import {SomePackageName} from 'some-package-name'`

Voor het importeren van het javascript bestand in de website kan je deze toevoegen in `frontend/.angular-cli.json` onder `{...,apps:[{...,scripts:[...hier..]}]}`
