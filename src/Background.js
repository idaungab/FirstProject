import React,{Component} from 'react';
import {Table, Column, Cell} from 'fixed-data-table-2';

export default class Background extends Component{
  constructor(){
    super();
    this.state = {
      counts:[]
    };
  }

  componentDidMount(){
    fetch('http://localhost:3000/api/countries')
    .then(results =>{
      return results.json();
    }).then(data => {
      let count = data.results.map((country) => {
        return(
          <Table
            rowsCount={country.length}
            rowHeight={40}
            width={500}
            height={40+((country.length + 1) * 30)}
            headerHeight={30}
            key={country.results}>
              <Column
                width={200}
                header={<Cell>Country</Cell>}
                cell={country.country_name}
              />
          </Table>
        )
      })
    })
  }
}
