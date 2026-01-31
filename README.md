# Procesor de imagini ASCII art(CLI Tool)

## Autor
- Nume: Godeanu Constantin-Viorel
- Grupă: 2.1
- Email: constantin-viorel.godeanu@student.upt.ro
- An academic: 2025-2026

Aceasta este o aplicatie in linie de comanda (CLI) dezvoltata in Node.js care permite convertirea textului si a imaginilor in arta ASCII. Aplicatia utilizeaza Inteligenta Artificiala (Google Gemini) pentru a alege stilul optim de font pentru text si include functionalitati avansate pentru procesarea imaginilor (color, resize, invert).

Proiectul este complet containerizat folosind Docker.

## Functionalitati

### 1. Generator Text-to-ASCII
- Conversie text in ASCII art folosind libraria `figlet`.
- Integrare AI: Utilizeaza API-ul Google Gemini pentru a analiza descrierea stilului dorit de utilizator (ex: "horror", "cyberpunk") si alege automat cel mai potrivit font.
- Suport pentru zeci de fonturi diferite.

### 2. Generator Image-to-ASCII
- Proceseaza imagini (JPG, PNG) si le converteste in caractere ASCII.
- Suport Culori ANSI: Pastreaza culorile originale ale imaginii afisandu-le in terminal.
- Inversare Culori: Modul `--invert` pentru terminale cu fundal deschis.

## Tehnologii Utilizate
- Limbaj: Node.js
- Librarii: `jimp` (procesare imagine), `figlet` (text ASCII), `yargs` (argument parsing), `google/generative-ai` (AI integration).
- Containerizare: Docker

## Cerințe sistem

- Docker
- Node.js
- Sistem de operare: Windows 10/11, macOS sau orice distributie Linux moderna
- Dependente externe: Conexiune la internet pentru comunicarea cu API-ul


### Pasi
1. Cloneaza repository-ul:
   ```bash
   git clone https://github.com/parroxysm/proiect-map-ascii-art.git
   cd proiect-map-ascii-art

# Comandă de bază
node main --help

### Comenzi de test

###Testare:
- Verificam daca AI ul alege fontul corect bazat pe descriere.
   ```bash
   docker run --rm --env-file .env parr0xysm/ascii-art --text "UPT MAP" --desc "futuristic"
- Verificam conversia imaginii
   ```bash
   docker run --rm -v ${PWD}:/app --env-file .env parr0xysm/ascii-art --file kaneki.png --color
