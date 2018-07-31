import React, { Component } from 'react'
import Flatpickr from 'react-flatpickr'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
import {fr} from 'flatpickr/dist/l10n/fr.js'
import {Meteor} from "meteor/meteor";
import {sommes} from "../api/fonctions";


export class SortieSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchRecu: '',
      searchCode: '',
      searchLibelle: '',
      searchDesignation:'',
      sortieStartedDateGetTime: '',
      sortieStartedDate: '',
      sortieEndedDateGetTime: '',
      sortieEndedDate: ''
    };

  }
  componentDidMount() {

        Session.set('sortieStartedDate',''),
        Session.set('sortieEndedDate',''),
        Session.set('searchRecu',''),
        Session.set('searchCode',''),
        Session.set('searchLibelle',''),
        Session.set('searchDesignation','')
  }
  onSubmitForm(e) {
    const {  sortieStartedDateGetTime , sortieEndedDateGetTime , searchRecu , searchCode , searchLibelle, searchDesignation } = this.state;

    e.preventDefault();

    this.props.Session.set('sortieStartedDate', sortieStartedDateGetTime );
    this.props.Session.set('sortieEndedDate', sortieEndedDateGetTime );
    this.props.Session.set('searchRecu', searchRecu );
    this.props.Session.set('searchCode', searchCode );
    this.props.Session.set('searchLibelle', searchLibelle );
    this.props.Session.set('searchDesignation', searchDesignation );

    console.log( this.props.Session.get( 'searchDesignation' ) )

  }
  handleChange(e, { name,value }) {
    //this.props.Session.set(name, value );
    this.setState( { [name] : value });
    console.log(`${name} -> ${value}`)
    //console.log( `${[name]} -> ${this.props.Session.get(name)}` )
  }
  render() {

    return (
        <Form>
          <Form.Group widths='equal'>
            <div className='field'>
              <div className='ui input'>
                <Flatpickr
                    as={Form.Field}
                    placeholder="Date debut..."
                    data-enable-time
                    onChange={ (startDate)  => {
                      this.setState( { sortieStartedDate : startDate[0] } ) ;
                      this.setState( { sortieStartedDateGetTime : startDate[0].getTime() } ) ;
                      //this.props.Session.set('sortieStartedDate', startDate[0].getTime() );
                      console.log( this.props.Session.get('sortieStartedDate') );
                    } }
                    options={
                      {
                        altInput: true,
                        time_24hr: true,
                        locale : fr
                      }
                    }
                />
              </div>
            </div>

            <div className='field'>
              <div className='ui input'>
                <Flatpickr
                    as={Form.Field}
                    placeholder="Date fin..."
                    data-enable-time
                    onChange={ (startDate)  => {
                      this.setState( { sortieEndedDate : startDate[0] } ) ;
                      this.setState( { sortieEndedDateGetTime : startDate[0].getTime() } ) ;
                      //this.props.Session.set('sortieEndedDate', startDate[0].getTime() );
                      console.log( this.props.Session.get('sortieEndedDate') );
                    } }
                    options={
                      {
                        altInput: true,
                        time_24hr: true,
                        locale : fr
                      }
                    }
                />
              </div>
            </div>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field
                name='searchRecu'
                value={this.state.searchRecu}
                control={Input}
                onChange={this.handleChange.bind(this)}
                placeholder='Recu...' />
            <Form.Field
                name='searchCode'
                value={this.state.searchCode}
                control={Input}
                onChange={this.handleChange.bind(this)}
                placeholder='Code...' />
            <Form.Field
                name='searchLibelle'
                value={this.state.searchLibelle}
                control={Input}
                onChange={this.handleChange.bind(this)}
                placeholder='Libelle...' />
            <Form.Field
                name='searchDesignation'
                value={this.state.searchDesignation}
                control={Input}
                onChange={this.handleChange.bind(this)}
                placeholder='Designation...' />

          </Form.Group>

          <Form.Button onClick={this.onSubmitForm.bind(this)} fluid basic color='blue'>rechercher</Form.Button>
        </Form>
    )
  }
}

SortieSearch.propTypes = {
};

export default createContainer(() => {

  return {
    Session
  };

}, SortieSearch);