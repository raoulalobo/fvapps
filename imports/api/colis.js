import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


import request from 'request';


export const Colis = new Mongo.Collection('colis');

if (Meteor.isServer) {
    Meteor.publish('colis', function (dateStart, dateEnd ) {
        //const searchServer = {} ;
        //searchServer.DateTimeExp = { $gte: dateStart , $lte: dateEnd }
        return Colis.find({ DateTimeExp: { $gte: dateStart , $lte: dateEnd } });
    });

    Meteor.methods({
        'colis.insert'( dateTime ,agent_recu, agent_saisie, code, bus, dest , amount, nameExp, telExp,nameDest, telDest, desc  ) {

            new SimpleSchema({
                dateTime: {
                    type: Date,
                    label: 'Date',
                },
                agent_recu: {
                    type: String,
                    label: 'Agent recu',
                },
                agent_saisie: {
                    type: String,
                    label: 'Agent saisie',
                },
                code: {
                    type: String,
                    label: 'Code',
                },
                bus: {
                    type: String,
                    label: 'Immatriculation',
                },
                dest: {
                    type: String,
                    label: 'Destination',
                    allowedValues: ['YAOUNDE','DOUALA'],
                },
                amount: {
                    type: SimpleSchema.Integer,
                    label: 'The amount',
                },
                nameExp: {
                    type: String,
                    label: 'Name exp.',
                },
                telExp: {
                    type: String,
                    label: 'Tel. exp.',
                    regEx: SimpleSchema.RegEx.Phone,
                    min : 12,
                    max : 12
                },
                nameDest: {
                    type: String,
                    label: 'Name dest.',
                },
                telDest: {
                    type: String,
                    label: 'Tel dest.',
                    regEx: SimpleSchema.RegEx.Phone,
                    min : 12,
                    max : 12
                },
                desc: {
                    type: String,
                    label: 'Desc. pack.',
                    min : 3,
                    max : 70,
                }

            }).validate({ dateTime, agent_recu, agent_saisie, code, bus, dest , amount, nameExp, telExp,nameDest, telDest, desc   });

            Colis.insert({
                dateTime: new Date().getTime(),
                agent_recu,
                agent_saisie,
                code,
                bus,
                dest,
                amount,
                nameExp,
                telExp,
                nameDest,
                telDest,
                desc,
                state : 'A',
                visible : true ,
                updatedAt : new Date().getTime(),
                DateTimeExp : dateTime.getTime(),
                expUserId : this.userId
            }, (err)=>{ if (!err)  {
                if ( Meteor.isServer ) {
                    const sender = 'FINEXS VOYAGES' ;
                    const message =`${nameDest}, votre colis(${code}) est en route pour ${dest}, il arrivera dans 04 a 05h de temps. Infos, Yde:699755276 -Dla:656968928 -Plaintes:697509899; Ouvert du lun. au sam : 08h-19h`
                    //console.log( telDest+'   '+message );
                    request('http://api.vassarl.com:9501/api?action=sendmessage&username=FINEXS&password=Finexs12345&originator='+sender+'&recipient='+telDest+'&messagetype=SMS:TEXT&messagedata='+message, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            //console.log( error )
                        }
                    })
                }
            } } );


        },
        'colis.arrived'(_id, code, dest, nameDest, telDest ) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                }
            }).validate({ _id});

            Colis.update({
                _id
            }, {
                $set: {
                    state : 'B',
                    updatedAt : new Date().getTime(),
                    DateTimeArr : new Date().getTime(),
                    userIdArr : this.userId
                }
            },(err)=>{ if (!err) {
                const sender = 'FINEXS VOYAGES' ;
                const message = nameDest+', votre colis ('+code+') est arrive a '+dest+',vous pouvez passer le recuperer. Finexs Voyages vous remercie de votre confiance.'
                console.log( telDest+'   '+message );
                request('http://api.vassarl.com:9501/api?action=sendmessage&username=FINEXS&password=Finexs12345&originator='+sender+'&recipient='+telDest+'&messagetype=SMS:TEXT&messagedata='+message, function (error, response, body) {
                    if (!error && response.statusCode == 200) { console.log( error ) }
                })

            }} );

        },
        'colis.loading'(_id, code, dest, nameDest, telDest ) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                }
            }).validate({ _id});

            Colis.update({
                _id
            }, {
                $set: {
                    userIdArr : this.userId
                }
            },(err)=>{ if (!err) {
                const sender = 'FINEXS VOYAGES' ;
                const message = nameDest+', votre colis ('+code+') est encore en route pour '+dest+'. Finexs Voyages vous remercie de votre confiance.'
                console.log( telDest+'   '+message );
                request('http://api.vassarl.com:9501/api?action=sendmessage&username=FINEXS&password=Finexs12345&originator='+sender+'&recipient='+telDest+'&messagetype=SMS:TEXT&messagedata='+message, function (error, response, body) {
                    if (!error && response.statusCode == 200) { console.log( error ) }
                })

            }} );

        },
        'colis.arrived.nosms'(_id, code, dest, nameDest, telDest ) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                }
            }).validate({ _id});

            Colis.update({
                _id
            }, {
                $set: {
                    state : 'B',
                    updatedAt : new Date().getTime(),
                    DateTimeArr : new Date().getTime(),
                    userIdArr : this.userId
                }
            },(err)=>{ if (!err) { console.log('good')}} );

        },
        'colis.end'(_id ) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                }
            }).validate({ _id });

            Colis.update({
                _id
            }, {
                $set: {
                    state : 'C',
                    updatedAt : new Date().getTime(),
                    DateTimeEnd : new Date().getTime(),
                    userIdEnd : this.userId
                }
            });

        },
        'colis.deleted'(_id ) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                }
            }).validate({ _id });

            Colis.update({
                _id
            }, {
                $set: {
                    deletedAt : new Date().getTime(),
                    visible: false,
                    userIdDeleted : this.userId
                }
            });
        }

    });
}


