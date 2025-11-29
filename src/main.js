const path = require('path');
const caleENV = path.resolve(__dirname, '../.env');
require('dotenv').config({path: caleENV});

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const figlet = require('figlet');
const { GoogleGenerativeAI} = require("@google/generative-ai");


const argv = yargs(hideBin(process.argv))
    .usage('Utilizare: $0 [optiuni]')

    .option('text',{
        alias: 't',
        type: 'string',
        description: 'Genereaza ASCII art dintr un sir de text',
        conflicts: 'file' //nu poti sa folosesti --text si --file in acelasi timp
    })

    .option('file', {
        alias: 'f',
        type: 'string',
        description: 'Calea catre imaginea de procesat',
        conflicts: 'text'
    })

    .option('desc',{
        alias: 'd',
        type: 'string',
        description: 'Descrierea stilului dorit (pentru AI)',
    })

    .help('help')
    .alias('help', 'h')
    .argv

const apiKey = process.env.GEMINI_API_KEY;
let model = null;
let genAI = null;


if(apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
}

console.log("------------");
console.log("   ASCII ART V0.1    ");
console.log("------------");

const availableFonts = ['3-d', '3x5', '5lineoblique', 'acrobatic', 'alligator',
  'alligator2', 'alphabet', 'avatar', 'banner', 'banner3-D',
  'banner3', 'banner4', 'barbwire', 'basic', 'bell',
  'big', 'bigchief', 'binary', 'block', 'bubble',
  'bulbhead', 'calgphy2', 'catwalk', 'chunky', 'coinstak',
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
  'wavy', 'weird'];

async function getFontFromAPI(userDescription){
    if(!model) return 'Standard';

    console.log(">>>Intreb AI ul ce se potriveste...");

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

        if(availableFonts.includes(text)){
            return text;
        }else{
            return 'Standard';
        }
    }catch(error){
        console.error("Eroare AI:", error.message);
        return 'Standard';
    }
}

(async () => {
    
    
    if (argv.text) {
        console.log(`Procesare text: "${argv.text}"`);
        
        let selectedFont = 'Standard';


        if (argv.desc) {
            selectedFont = await getFontFromAPI(argv.desc);
            console.log(`>>> AI-ul a ales fontul: ${selectedFont}`);
        }


        figlet.text(argv.text, {
            font: selectedFont,
            width: 80
        }, function(err, data) {
            if (err) {
                console.log('Eroare Figlet...');
                return;
            }
            console.log(data);
        });


    } else if (argv.file) {
        console.log(`Procesare fisier: "${argv.file}"`);
        console.log("(Funcționalitatea pentru imagini este în lucru...)");



    } else {
        console.log('Nicio optiune selectata; foloseste --help pentru a vedea optiunile');
    }

})();
