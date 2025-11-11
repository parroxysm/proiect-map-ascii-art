// import biblioteca yargs pentru a parsa argumentele
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
//const Jimp = require ('jimp');

console.log("------------");
console.log("   ASCII ART V0.1    ");
console.log("------------");

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

    .help('help')
    .alias('help', 'h')
    .argv

    //logica principala a aplicatiei

if(argv.text){  //daca utilizatorul a furnizat optiunea --text
    console.log(`Procesare fisier: "${argv.text}"`);
    //TODO
}else if(argv.file){
    console.log(`Procesare fisier: "${argv.file}"`);
    //TODO
}else{
    console.log('Nici-o optiune selectata; foloseste --help pentru a vedea optiunile')
}

