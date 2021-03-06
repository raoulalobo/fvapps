const R = require('ramda');


export function recus( tableauElements = undefined ) {

  let byRecu = (sortie)=> sortie.retour.match(  new RegExp( 'oui', 'i') );
  let filtreMultipleRecu = R.compose(R.filter(byRecu));

  return filtreMultipleRecu(tableauElements) ;
}

export function filtrage(tableauElements = undefined, parVille = undefined, parClasse = undefined, parBus = undefined , parHotesse) {

    let byDate = R.ascend(R.prop('dateTime'));
    let byClasse = (depart)=> depart.classe.match(  new RegExp( parClasse, 'i') );
    let byVille = (depart)=> depart.dest.match(  new RegExp( parVille, 'i') );
    let byBus = (depart)=> depart.imm.match(  new RegExp( parBus, 'i') );
    let byHotesse = (depart)=> depart.obs.match(  new RegExp( parHotesse, 'i') );
    let filtreMultipleDeparts = R.compose(R.filter(byHotesse),R.filter(byClasse),R.filter(byVille),R.filter(byBus));
    return R.sort( byDate, filtreMultipleDeparts(tableauElements) );
}

export function filtrageSorties(tableauElements = undefined, parOrdonnateur = undefined, parDemandeur = undefined, parCode = undefined , parLibelle = undefined ) {

  let byDate = R.ascend(R.prop('date_sortie'));
  let Ordonnateur = (elt)=> elt.ordonnateur.match(  new RegExp( parOrdonnateur, 'i') );
  let Demandeur = (elt)=> elt.demandeur.match(  new RegExp( parDemandeur, 'i') );
  let Code = (elt)=> elt.code_sortie.match(  new RegExp( parCode, 'i') );
  let Libelle = (elt)=> elt.libelle.match(  new RegExp( parLibelle, 'i') );
  let filtreMultipleSorties = R.compose(R.filter(Libelle),R.filter(Code),R.filter(Demandeur),R.filter(Ordonnateur));
  return R.sort( byDate, filtreMultipleSorties(tableauElements) );
}

export function filtrageEmployes(tableauElements = undefined, inferieurDate = new Date(2015 , 11, 31).getTime() , superieurDate = new Date().getTime() , parNom = undefined, parService = undefined, parAssurance = undefined , parContrat) {

    let byDate = R.ascend(R.prop('embauche'));
    let inferiorDate = (employe)=> R.lte( inferieurDate , employe.embauche );
    let superiorDate = (employe)=> R.lte( employe.embauche , superieurDate  );
    let byNom = (employe)=> employe.nom.match(  new RegExp( parNom, 'i') );
    let byService = (employe)=> employe.service.match(  new RegExp( parService, 'i') );
    let byAssurance = (employe)=> employe.assurance.match(  new RegExp( parAssurance, 'i') );
    let byContrat = (employe)=> employe.contrat.match(  new RegExp( parContrat, 'i') );
    let filtreMultipleEmployes = R.compose( R.filter(inferiorDate), R.filter(superiorDate), R.filter(byContrat),R.filter(byAssurance),R.filter(byService),R.filter(byNom));
    return R.sort( byDate, filtreMultipleEmployes(tableauElements) );
}


export function filtreVidange( tableauElements = undefined, Immatriculation = undefined, Ordre = undefined ) {

    let byDate = R.descend(R.prop('dateTime'));
    let byImmatriculation = (vidange)=> vidange.immatriculation.match(  new RegExp( Immatriculation, 'i') );
    let byOrdre = (vidange)=> vidange.ordre.match(  new RegExp( Ordre , 'i') );
    let byObs = (vidange)=> vidange.observations.match(  new RegExp( Ordre , 'i') );
    let filtreMultiple = R.compose(R.filter(byOrdre),R.filter(byImmatriculation));
    return R.sort( byDate, filtreMultiple(tableauElements) );
}

export function filtreDepenses(tableauElements = undefined, parType = undefined, parcode = undefined, parDesi = undefined) {

    let byType = (depense)=> depense.genre.match(  new RegExp( parType, 'i') );
    let byCode = (depense)=> depense.code.match(  new RegExp( parcode, 'i') );
    let byDesignation = (depense)=> depense.desi.match(  new RegExp( parDesi, 'i') );
    let filtreMultipleDepenses = R.compose(R.filter(byType),R.filter(byCode),R.filter(byDesignation));
    return filtreMultipleDepenses(tableauElements)
}

export function filtreMomo(tableauElements = undefined, searchNom = undefined, searchTicket = undefined , searchPrestataire = undefined ) {

    let byDate = R.descend(R.prop('dateTimeV'));
    let byNom = (mmoney)=> mmoney.nom.match(  new RegExp( searchNom, 'i') );
    let byTicket = (mmoney)=> mmoney.ticket.match(  new RegExp( searchTicket, 'i') );
    let byPrestataire = (mmoney)=> mmoney.prest.match(  new RegExp( searchPrestataire, 'i') );

    const filtreMultiple = R.compose( R.filter(byNom), R.filter(byTicket), R.filter(byPrestataire) ) ;
    return R.sort( byDate, filtreMultiple(tableauElements) );

}


export function filtreAlerte(tableauElements = undefined, searchType = undefined , searchCode = undefined , searchImmatriculation = undefined ) {

    let byDate = R.descend(R.prop('validite'));
    let byType = (alerte)=> alerte.type.match(  new RegExp( searchType, 'i') );
    let byCode = (alerte)=> alerte.code.match(  new RegExp( searchCode, 'i') );
    let byImmatriculation = (alerte)=> alerte.immatriculation.match(  new RegExp( searchImmatriculation, 'i') );

    const filtreMultiple = R.compose( R.filter(byType), R.filter(byCode), R.filter(byImmatriculation) ) ;
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

export function sommesColis(elts) {
    let  summ = (sum,n)=> sum + n.amount;
    return elts ? R.reduce(summ, 0,elts) : 0
}

export function sommeSorties(elts) {
  let  summ = (sum,n)=> sum + n.montant;
  return elts ? R.reduce(summ, 0,elts) : 0
}



export function nbrDeparts( tableauElements = undefined , parBus = undefined ) {
    let byBus = (depart)=> depart.imm.match(  new RegExp( parBus, 'i') );
    let res = R.compose(R.length ,R.filter(byBus))
    return res(tableauElements)
}

export function tableauRecap( nomDuTableur, summDlaVIP, todayDepartsCountDlaVIP, sumDlaVIPFDR, todayDepartsDlaVIP ) {

    var chn = "" ;

    chn += "<h3>Entrée Bus "+ nomDuTableur +" : "+ accounting.formatMoney( summDlaVIP, "", 0, ".", ",") +"Fcfa ("+ todayDepartsCountDlaVIP +" départs) </h3>" ;
    chn += "<h3>Frais de route "+ nomDuTableur +" : "+ accounting.formatMoney( sumDlaVIPFDR, "", 0, ".", ",") +" Fcfa</h3>" ;
    chn += "<table style=\"border: 1px solid black; border-collapse: collapse;\"><thead><tr>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">Date Heure</th>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">Immatriculation</th>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">Classe</th>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">Frais de route</th>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">Places gratuites</th>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">Places payée</th>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">Prix place</th>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">Observations</th>" +
        "<th style=\"border: 1px solid black; padding: 15px; text-align: center;\">total</th></tr></thead><tbody>" ;
    $.each(todayDepartsDlaVIP , function(index,value){
        chn += "<tr>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+ moment(value.datetime).locale('fr').format('ll LT')+"</td>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+value.immatriculation+"</td>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+value.classe+"</td>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+value.fraisDeRoute+"</td>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+value.pg+"</td>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+value.nbrePlaces+"</td>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+value.montantPlaces+"</td>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+value.observations+"</td>" +
            "<td style=\"border: 1px solid black; padding: 15px; text-align: center;\">"+value.sommeGeneree+"</td></tr>" ;
    });
    chn +="</tbody></table>" ;
    chn +="</br>" ;
    return chn ;


}