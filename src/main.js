const path = require('path');
const caleENV = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: caleENV });

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { Jimp } = require('jimp');
const figlet = require('figlet');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const argv = yargs(hideBin(process.argv))
    .usage('Utilizare: $0 [optiuni]')
    .option('text', {
        alias: 't',
        type: 'string',
        description: 'Genereaza ASCII art dintr-un sir de text',
        conflicts: 'file'
    })
    .option('file', {
        alias: 'f',
        type: 'string',
        description: 'Calea catre imaginea de procesat',
        conflicts: 'text'
    })
    .option('color', {
        alias: 'c',
        type: 'boolean',
        default: false,
        description: 'Activeaza culorile originale ale imaginii',
    })
    .option('invert', {
        alias: 'i',
        type: 'boolean',
        default: false,
        description: 'Inverseaza culorile (pt terminale cu fundal alb)',
    })
    .option('desc', {
        alias: 'd',
        type: 'string',
        description: 'Descrierea stilului dorit (pentru functia --text)',
    })
    .help('help')
    .alias('help', 'h')
    .argv;

const apiKey = process.env.GEMINI_API_KEY;
let model = null;
let genAI = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
}

console.log("------------");
console.log("   ASCII ART V1.0   ");
console.log("------------");

const availableFonts = [
    '3-d', '3x5', '5lineoblique', 'acrobatic', 'alligator',
    'alligator2', 'alphabet', 'avatar', 'banner', 'banner3-D',
    'banner3', 'banner4', 'barbwire', 'basic', 'bell',
    'big', 'bigchief', 'binary', 'block', 'Bubble',
    'bulbhead', 'caligraphy', 'catwalk', 'chunky', 'coinstak',
    'colossal', 'computer', 'contessa', 'contrast', 'cosmic',
    'cosmike', 'cricket', 'cursive', 'cyberlarge', 'cybermedium',
    'cybersmall', 'diamond', 'digital', 'doh', 'doom',
    'dotmatrix', 'drpepper', 'eftichess', 'eftifont', 'eftipiti',
    'eftirobot', 'eftitalic', 'eftiwall', 'eftiwater', 'epic',
    'fender', 'fourtops', 'fuzzy', 'goofy', 'gothic',
    'graffiti', 'hollywood', 'invita', 'isometric1', 'isometric2',
    'isometric3', 'isometric4', 'italic', 'ivrit', 'jazmine',
    'jerusalem', 'katakana', 'kban', 'larry3d', 'lcd',
    'lean', 'letters', 'linux', 'lockergnome', 'madrid',
    'marquee', 'maxfour', 'mike', 'mini', 'mirror',
    'mnemonic', 'morse', 'moscow', 'nancyj-fancy', 'nancyj-underlined',
    'nancyj', 'nipples', 'ntgreek', 'o8', 'ogre',
    'pawp', 'peaks', 'pebbles', 'pepper', 'poison',
    'puffy', 'pyramid', 'rectangles', 'relief', 'relief2',
    'rev', 'roman', 'rot13', 'rounded', 'rowancap',
    'rozzo', 'runic', 'runyc', 'sblood', 'script',
    'serifcap', 'shadow', 'short', 'slant', 'slide',
    'slscript', 'small', 'smisome1', 'smkeyboard', 'smscript',
    'smshadow', 'smslant', 'smtengwar', 'speed', 'stampatello',
    'standard', 'starwars', 'stellar', 'stop', 'straight',
    'tanja', 'tengwar', 'term', 'thick', 'thin',
    'threepoint', 'ticks', 'ticksslant', 'tinker-toy', 'tombstone',
    'trek', 'tsalagi', 'twopoint', 'univers', 'usaflag',
    'wavy', 'weird'
];

async function getFontFromAPI(userDescription) {
    if (!model) return 'Standard';
    console.log(">>> Intreb AI-ul ce se potriveste...");
    const prompt = `
        Ești un asistent care alege fonturi ASCII.
        Utilizatorul vrea un text care arată: "${userDescription}".
        Alege UN SINGUR font din această listă care se potrivește cel mai bine: ${availableFonts.join(', ')}.
        Răspunde DOAR cu numele fontului, nimic altceva.
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        if (availableFonts.includes(text)) return text;
        else return 'Standard';
    } catch (error) {
        return 'Standard';
    }
}

async function processImageToAscii(filePath, useColor, invert) {
    let DENSITY = 'Ñ@#W$9876543210?!abc;:+=-,._ ';
    
    if (invert) {
        DENSITY = DENSITY.split('').reverse().join('');
    }

    try {
        const image = await Jimp.read(filePath);

        image.resize({ w: 60 });
        
        if (!useColor) {
            image.greyscale();
        }

        let asciiArt = "";

        for (let y = 0; y < image.height; y++) {
            for (let x = 0; x < image.width; x++) {
                const color = image.getPixelColor(x, y);

                const r = (color >> 24) & 255;
                const g = (color >> 16) & 255;
                const b = (color >> 8) & 255;
                const a = color & 255;

                if (a === 0) {
                    asciiArt += '  ';
                    continue;
                }

                const brightness = (r + g + b) / 3;
                const charIndex = Math.floor((brightness / 255) * (DENSITY.length - 1));
                const char = DENSITY[charIndex] || '.';

                if (useColor) {
                    asciiArt += `\x1b[38;2;${r};${g};${b}m${char}${char}\x1b[0m`;
                } else {
                    asciiArt += char + char;
                }
            }
            asciiArt += "\n";
        }
        console.log(asciiArt);

    } catch (err) {
        console.error("Eroare: Nu am putut citi imaginea.", err);
    }
}

(async () => {
    if (argv.text) {
        console.log(`Procesare text: "${argv.text}"`);
        
        let selectedFont = 'Standard';
        
        if (argv.desc) {
            selectedFont = await getFontFromAPI(argv.desc);
            
            if (selectedFont) {
                 selectedFont = selectedFont.charAt(0).toUpperCase() + selectedFont.slice(1);
            }

            console.log(`>>> AI-ul a ales fontul: ${selectedFont}`);
        }

        await new Promise((resolve, reject) => {
            figlet.text(argv.text, {
                font: selectedFont,
                width: 80
            }, function(err, data) {
                if (err) {
                    console.log(`EROARE FONT: Nu pot încărca '${selectedFont}'.`);
                    console.log("Detalii tehnice:", err.message);
                    
                    figlet.text(argv.text, { font: 'Standard', width: 80 }, function(err2, data2) {
                        console.log(data2);
                        resolve();
                    });
                } else {
                    console.log(data);
                    resolve();
                }
            });
        });

    } else if (argv.file) {
        console.log(`Procesez imaginea: "${argv.file}" (Color:${argv.color})...`);
        await processImageToAscii(argv.file, argv.color, argv.invert);

    } else {
        console.log("Nicio optiune selectata. Foloseste --help pentru detalii.");
    }
})();