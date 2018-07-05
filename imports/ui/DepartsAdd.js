import React from "react";
import { Meteor } from "meteor/meteor";
import Flatpickr from "react-flatpickr";
import { fr } from "flatpickr/dist/l10n/fr.js";
import { Button, Modal, Form, Message } from "semantic-ui-react";

export default class DepartsAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            dateTime: "",
            imm: "",
            dest: "",
            driver: "",
            fuel: '0',
            fdr: '0',
            amount: '0',
            seat: '0',
            leasing: '0',
            km: '0',
            eau:'0',
            cafe: '0',
            the: '0',
            sucre:'0',
            cuillere: '0',
            gobelet: '0',
            couvercle: '0',
            sandwich: '0',
            croissant: '0',
            choco: '0',
            biscuit: '0',
            mouchoir: '0',
            obs: "",
            error: ""
        };
    }
    onSubmit(e) {
        const {
            dateTime,
            imm,
            dest,
            driver,
            fuel,
            fdr,
            amount,
            seat,
            leasing,
            km,
            eau,
            cafe,
            the,
            sucre,
            cuillere,
            gobelet,
            couvercle,
            sandwich,
            croissant,
            choco,
            biscuit,
            mouchoir,
            obs
        } = this.state;

        e.preventDefault();

        if (
            dateTime &&
            imm &&
            dest &&
            driver &&
            fuel &&
            fdr  &&
            amount &&
            seat &&
            obs
        ) {
            Meteor.call(
                "depenses.insert",
                dateTime,
                "DCB",
                imm.trim().toUpperCase(),
                "Carburant bus",
                635,
                parseInt(fuel.trim()),
                "RAS",
                fuel.trim() > 0 ? true : false,
                (err, res) => {
                    if (!err) {
                        Meteor.call(
                            "departs.insert",
                            res,
                            dateTime,
                            imm.trim().toUpperCase(),
                            dest.trim().toLocaleLowerCase(),
                            driver.trim().toLocaleLowerCase(),
                            parseInt(fuel),
                            parseInt(fdr),
                            parseInt(amount),
                            parseInt(seat),
                            parseInt(leasing),
                            parseInt(km),
                            parseInt(eau) ,
                            parseInt(cafe),
                            parseInt(the),
                            parseInt(sucre),
                            parseInt(cuillere),
                            parseInt(gobelet),
                            parseInt(couvercle),
                            parseInt(sandwich),
                            parseInt(croissant),
                            parseInt(choco),
                            parseInt(biscuit),
                            parseInt(mouchoir),
                            obs.trim(),
                            (err, res) => {
                                if (!err) {
                                    this.handleClose();

                                    Bert.alert(
                                        "enregistrements ajoute avec succes.",
                                        "danger",
                                        "growl-top-right",
                                        "fa-check"
                                    );
                                } else {
                                    this.setState({ error: err.reason });
                                }
                            }
                        );
                    } else {
                        this.setState({ error: err.reason });
                    }
                }
            );
        } else {
            this.setState({ error: "All field are required" });
        }
    }

    handleClose() {
        this.setState({
            modalOpen: false,
            dateTime: "",
            imm: "",
            dest: "",
            driver: "",
            fuel: '0',
            fdr: '0',
            amount: '0',
            seat: '0',
            leasing: '0',
            km: '0',
            eau:'0',
            cafe: '0',
            the: '0',
            sucre:'0',
            cuillere: '0',
            gobelet: '0',
            couvercle: '0',
            sandwich: '0',
            croissant: '0',
            choco: '0',
            biscuit: '0',
            mouchoir: '0',
            obs: "",
            error: ""
        });
    }
    handleOpen() {
        this.setState({ modalOpen: true });
    }
    onChangeField(e, { name, value }) {
        this.setState({ [name]: value });
        console.log(`${name} -> ${value}`);
        if ([name] == 'amount' && this.state.amount < 5000 ) {
            this.setState({ eau : '0' });
            this.setState({ cafe : '0' });
            this.setState({ the : '0' });
            this.setState({ sucre : '0' });
            this.setState({ cuillere : '0' });
            this.setState({ gobelet : '0' });
            this.setState({ couvercle : '0' });
            this.setState({ sandwich : '0' });
            this.setState({ croissant : '0' });
            this.setState({ choco : '0' });
            this.setState({ biscuit : '0' });
            this.setState({ mouchoir : '0' });
        }
    }
    render() {
        const options = [
            { key: "y", text: "yaounde", value: "yaounde" },
            { key: "d", text: "douala", value: "douala" }
        ];
        return (
            <Modal
                onSubmit={this.onSubmit.bind(this)}
                open={this.state.modalOpen}
                onClose={this.handleClose.bind(this)}
                size="small"
                trigger={
                    <Button onClick={this.handleOpen.bind(this)} primary size="mini">
                        + Ajouter un depart
                    </Button>
                }
            >
                <Modal.Header>Ajouter un depart</Modal.Header>
                <Modal.Content>
                    {this.state.error ? (
                        <Message negative>
                            <Message.Header>
                                Desole , nous ne pouvons effectuer cet enregistrement
                            </Message.Header>
                            <p>{this.state.error}</p>
                        </Message>
                    ) : (
                        undefined
                    )}
                    <Form>
                        <Form.Group widths="equal">
                            <div className="field">
                                <label>Date Heure</label>
                                <div className="ui input">
                                    <Flatpickr
                                        as={Form.Field}
                                        data-enable-time
                                        onChange={startDate => {
                                            this.setState({ dateTime: startDate[0] });
                                            console.log(this.state.dateTime);
                                        }}
                                        options={{
                                            altInput: true,
                                            time_24hr: true,
                                            locale: fr
                                        }}
                                    />
                                </div>
                            </div>
                            <Form.Input
                                label="Immatriculation"
                                name="imm"
                                value={this.state.imm}
                                onChange={this.onChangeField.bind(this)}
                            />
                        </Form.Group>

                        <Form.Group widths="equal">
                            <Form.Dropdown
                                label="Destination"
                                minCharacters={0}
                                name="dest"
                                placeholder="Selectionnez la destination"
                                search
                                selection
                                options={options}
                                onChange={this.onChangeField.bind(this)}
                            />

                            <Form.Input
                                label="Chauffeur"
                                name="driver"
                                value={this.state.driver}
                                onChange={this.onChangeField.bind(this)}
                            />
                        </Form.Group>

                        <Form.Group widths="equal">
                            <Form.Input
                                label="Carburant"
                                name="fuel"
                                value={this.state.fuel}
                                onChange={this.onChangeField.bind(this)}
                            />
                            <Form.Input
                                label="FDR"
                                name="fdr"
                                value={this.state.fdr}
                                onChange={this.onChangeField.bind(this)}
                            />
                        </Form.Group>

                        <Form.Group widths="equal">
                            <Form.Input
                                label="Prix place"
                                name="amount"
                                value={this.state.amount}
                                onChange={this.onChangeField.bind(this)}
                            />
                            <Form.Input
                                label="Nbr de places"
                                name="seat"
                                value={this.state.seat}
                                onChange={this.onChangeField.bind(this)}
                            />
                        </Form.Group>

                        <Form.Group widths="equal">
                            <Form.Input
                                label="Location"
                                name="leasing"
                                value={this.state.leasing}
                                onChange={this.onChangeField.bind(this)}
                            />
                            <Form.Input
                                label="Kilometrage"
                                name="km"
                                value={this.state.km}
                                onChange={this.onChangeField.bind(this)}
                            />
                        </Form.Group>

                        {this.state.amount < 5000 ?
                            <Form.Group widths="equal">

                            </Form.Group> :
                            <div>
                                <Form.Group widths="equal">
                                    <Form.Input
                                        label="Eau"
                                        name="eau"
                                        value={this.state.eau}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                    <Form.Input
                                        label="Cafe"
                                        name="cafe"
                                        value={this.state.cafe}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                    <Form.Input
                                        label="The"
                                        name="the"
                                        value={this.state.the}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                </Form.Group>

                                <Form.Group widths="equal">
                                    <Form.Input
                                        label="Sucre"
                                        name="sucre"
                                        value={this.state.sucre}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                    <Form.Input
                                        label="Cuillere"
                                        name="cuillere"
                                        value={this.state.cuillere}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                    <Form.Input
                                        label="Gobelet"
                                        name="gobelet"
                                        value={this.state.gobelet}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                </Form.Group>

                                <Form.Group widths="equal">
                                    <Form.Input
                                        label="Couvercle"
                                        name="couvercle"
                                        value={this.state.couvercle}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                    <Form.Input
                                        label="Sandwich"
                                        name="sandwich"
                                        value={this.state.sandwich}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                    <Form.Input
                                        label="Croissants"
                                        name="croissant"
                                        value={this.state.croissant}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                </Form.Group>

                                <Form.Group widths="equal">
                                    <Form.Input
                                        label="Pain choco"
                                        name="choco"
                                        value={this.state.choco}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                    <Form.Input
                                        label="Biscuits"
                                        name="biscuit"
                                        value={this.state.biscuit}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                    <Form.Input
                                        label="Mouchoir"
                                        name="mouchoir"
                                        value={this.state.mouchoir}
                                        onChange={this.onChangeField.bind(this)}
                                    />
                                </Form.Group>
                            </div>




                        }

                        <Form.Group widths="equal" />

                        <Form.TextArea
                            label="Observations"
                            name="obs"
                            value={this.state.obs}
                            onChange={this.onChangeField.bind(this)}
                        />
                        <Form.Button fluid basic color="blue">
                            Enregistrer
                        </Form.Button>
                    </Form>
                </Modal.Content>
            </Modal>
        );
    }
}
