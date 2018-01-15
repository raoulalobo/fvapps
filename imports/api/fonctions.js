const R = require('ramda');

export function filtrage(tableauElements = undefined, parVille = undefined, parClasse = undefined, parBus = undefined , parHotesse) {

    let byDate = R.ascend(R.prop('dateTime'));
    let byClasse = (depart)=> depart.classe.match(  new RegExp( parClasse, 'i') );
    let byVille = (depart)=> depart.dest.match(  new RegExp( parVille, 'i') );
    let byBus = (depart)=> depart.imm.match(  new RegExp( parBus, 'i') );
    let byHotesse = (depart)=> depart.obs.match(  new RegExp( parHotesse, 'i') );
    let filtreMultipleDeparts = R.compose(R.filter(byHotesse),R.filter(byClasse),R.filter(byVille),R.filter(byBus));
    return R.sort( byDate, filtreMultipleDeparts(tableauElements) );
}


export function filtreVidange( tableauElements = undefined, Immatriculation = undefined, Ordre = undefined ) {

    let byDate = R.descend(R.prop('dateTime'));
    let byImmatriculation = (vidange)=> vidange.immatriculation.match(  new RegExp( Immatriculation, 'i') );
    let byOrdre = (vidange)=> vidange.ordre.match(  new RegExp( Ordre , 'i') );
    let byObs = (vidange)=> vidange.observations.match(  new RegExp( Ordre , 'i') );
    let filtreMultiple = R.compose(R.filter(byObs),R.filter(byImmatriculation));
    return R.sort( byDate, filtreMultiple(tableauElements) );
}

export function filtreDepenses(tableauElements = undefined, parType = undefined, parcode = undefined, parDesi = undefined) {

    let byType = (depense)=> depense.genre.match(  new RegExp( parType, 'i') );
    let byCode = (depense)=> depense.code.match(  new RegExp( parcode, 'i') );
    let byDesignation = (depense)=> depense.desi.match(  new RegExp( parDesi, 'i') );
    let filtreMultipleDepenses = R.compose(R.filter(byType),R.filter(byCode),R.filter(byDesignation));
    return filtreMultipleDepenses(tableauElements)
}

export function filtreMomo(tableauElements = undefined, searchNom = undefined, searchTicket = undefined ) {

    let byDate = R.descend(R.prop('dateTimeV'));
    let byNom = (mmoney)=> mmoney.nom.match(  new RegExp( searchNom, 'i') );
    let byTicket = (mmoney)=> mmoney.ticket.match(  new RegExp( searchTicket, 'i') );

    const filtreMultiple = R.compose(R.filter(byNom),R.filter(byTicket)) ;
    return R.sort( byDate, filtreMultiple(tableauElements) );

}

export function sommes(elts) {
    let  summ = (sum,n)=> sum + n.total;
    return elts ? R.reduce(summ, 0,elts) : 0
}

export function sommesLitre(elts) {
    let  summ = (sum,n)=> sum + n.qtte;
    return elts ? R.reduce(summ, 0,elts) : 0
}

export function nbrDeparts( tableauElements = undefined , parBus = undefined ) {
    let byBus = (depart)=> depart.imm.match(  new RegExp( parBus, 'i') );
    let res = R.compose(R.length ,R.filter(byBus))
    return res(tableauElements)
}