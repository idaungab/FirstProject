import React, { Component } from 'react';
import {Table, Column, Cell} from 'fixed-data-table-2';
//import TextCell from './helper/cells.js';
import logo from './logo.svg';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import './App.css';
import './css/tabs.css';

class App extends Component {

constructor(){
  super();
  this.state = { countries: [], someKey: "kini daws" }
  this.addCountry = this.addCountry.bind(this);
}

componentDidMount(){
  var that = this;
  console.log('COMPONENT HAS MOUNTED');

  fetch('http://localhost:3000/api/countries')
    .then(response => response.json())
        .then(data => {
          that.setState({
            countries: data
          })
         })
         .catch( error => console.log('Error Fetch: ' + error))

         console.log(this.state.countries);
}

addCountry(e){
  e.preventDefault();
  let country_data={
    country_name: this.refs.country_name.value,
    continent_name: this.refs.continent_name.value
  };
  var request = new Request('http://localhost:3000/api/new-country',{
    method:'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(country_data)
  });


  console.log(this.state.countries);
  fetch(request)
    .then((response) => {
      let countries = this.state.countries;
      console.log(country_data);
      countries.push(country_data);
      console.log(countries);
      this.setState({
        countries: countries
      })
      response.json()
        .then((data) => {
        })
    })
    .catch(function(err){
      console.log(err);
    })
}

removeCountry(id){
    var that = this;
    let countries = this.state.countries;
    let country = countries.find(function(country){
      return country.id === id
    });
    console.log(countries.indexOf(country));

    var request = new Request('http://localhost:3000/api/remove/' + id,{
      method: 'DELETE'
    });

    fetch(request)
      .then((response) => {
        countries.splice(countries.indexOf(country),1);
        that.setState =({
          countries: countries
        })
        response.json()
          .then((data) => {
            console.log(data);
        })
      })
      .catch(function(err){
        console.log(err);
      })
      console.log(countries);
  }


  render() {
    let countries = this.state.countries;
    console.log(this.state.countries.length);
    const rows = [
        ['a1', 'b1', 'c1'],
        ['a2', 'b2', 'c2'],
        ['a3', 'b3', 'c3']
      ];


    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Simple CRUD ReactJS Application</h1>
        </header>
        <p className="App-intro"> </p>
        <form ref="countryForm">
          <input type="text" ref="country_name" placeholder="country_name" />
          <input type="text" ref="continent_name" placeholder="continent_name" />
          <button onClick={this.addCountry}>Add Country</button>
        </form>

        {/* <ul>
          {countries.map(country => <li key={country.id}> {country.country_name} {country.continent_name}
                <button onClick= {this.removeCountry.bind(this,country.id)}>Remove</button> </li> )}
        </ul> */}


        <Table
          rowsCount={this.state.countries.length}
          rowHeight={40}
          width={500}
          height={40+((countries.length + 1) * 30)}
          headerHeight={30}>

                <Column
                  header={<Cell>Country Name</Cell>}
                  width={230}
                  cell={ countries.map(country =>
                        <Cell key={country.id}>{country.country_name}</Cell>
                  )}
                />
                <Column
                  header={<Cell>Continent Name</Cell>}
                  width={230}
                  cell={ countries.map(country =>
                        <Cell key={country.id}>{country.continent_name}</Cell>
                  )}
                />
        </Table>

        <Table
            rowHeight={50}
            rowsCount={rows.length}
            width={500}
            height={500}
            headerHeight={50}>
            <Column
              header={<Cell>Col 1</Cell>}
              cell={<Cell>Column 1 static content</Cell>}
              width={200}
            />
            <Column
              header={<Cell>Col 2</Cell>}
              cell={<Cell></Cell>}
              width={100}
            />
            <Column
              header={<Cell>Col 3</Cell>}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  Data for column 3: {rows[rowIndex][2]}
                </Cell>
              )}
              width={200}
            />
         </Table>


      </div>
    );
  }
}
export default App;
