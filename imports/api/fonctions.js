const R = require('ramda');

export function filtrage(tableauElements = undefined, parVille = undefined, parClasse = undefined, parBus = undefined) {

    let byVille = (depart)=> depart.dest.match(  new RegExp( parVille, 'i') );
    let byClasse = (depart)=> depart.classe.match(  new RegExp( parClasse, 'i') );
    let byBus = (depart)=> depart.imm.match(  new RegExp( parBus, 'i') );
    let filtreMultipleDeparts = R.compose(R.filter(byVille),R.filter(byClasse),R.filter(byBus));
    return filtreMultipleDeparts(tableauElements)
}

export function filtreDepenses(tableauElements = undefined, parType = undefined, parcode = undefined, parDesi = undefined) {

    let byType = (depense)=> depense.genre.match(  new RegExp( parType, 'i') );
    let byCode = (depense)=> depense.code.match(  new RegExp( parcode, 'i') );
    let byDesignation = (depense)=> depense.desi.match(  new RegExp( parDesi, 'i') );
    let filtreMultipleDepenses = R.compose(R.filter(byType),R.filter(byCode),R.filter(byDesignation));
    return filtreMultipleDepenses(tableauElements)
}

export function sommes(elts) {
    let  summ = (sum,n)=> sum + n.total;
    return R.reduce(summ, 0,elts)
}