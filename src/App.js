import React, { useState } from 'react';
import ReactTooltip from "react-tooltip";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { VictoryBar, VictoryTheme, VictoryChart } from 'victory';
import MapChart from "./MapChart";
import './App.css';


class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      itemsCountries: [],
      time: 0,
    };
  }

  aumentarTime() {
    this.setState({time: this.state.time+1});
    if (this.state.time === 2) clearInterval(this.timerID);
  }

  componentDidMount() {
    document.title = "Covid-19 dashboard";
    this.timerID = setInterval(
      () => this.aumentarTime(),
      1000
    );
      fetch("https://disease.sh/v3/covid-19/countries")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            itemsCountries: result
          });
        },
        (error) => {
          console.log(error)
        }
      )
  }

  render() {
    const { error, isLoaded, itemsCountries, time } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded || time<1) {
      return  <div>
      <Spinner animation="border" style={{marginLeft: "50%", marginTop:"5%"}}/>
      </div>;
    } else {
      return (
        <div>
        <Map data={itemsCountries}></Map>
        </div>
      );
    }
  }
}

function CardContent (props){
  let found = false; 
  let i = 0; 
  while (i < props.data.length && !found){
    if (props.data[i].country === props.country) {
      found = true; 
    }
    if (!found)++i;
  }
  if (!found) return "Pasa el ratón sobre el mapa para mostrar la info"; 
  else {
    const myData = props.data[i]; 
    const graphData = [
      {name: 'Cases💊' , num: myData.cases},
      {name: 'Deaths' , num: myData.deaths},
      {name: 'Recovered🎉' , num: myData.recovered},
      {name: 'Active🤢' , num: myData.active},
      {name: 'Critical🚨' , num: myData.critical},

    ]

    return (
      <div> 
        {props.country}
        <img src={myData.countryInfo.flag} style={{width: "4%", marginLeft: "2%"}}></img>
        <div >
          <VictoryChart >
          <VictoryBar  
          style={{ data: { fill: "#fcb045" } }}
          data={graphData}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
          x="name"
          y="num"
          />
          </VictoryChart>
        </div>
      </div>
    )
  }
}

function Map(props) {
  const [cardContent, setCardContent] = useState("Pasa el ratón sobre el mapa para mostrar la info")
  return (
    <div>
      <Row>
        <Col>
          <Card style={{ width: "100%"}}>
          <MapChart width="400" setTooltipContent={ setCardContent} /> 
          <ReactTooltip>{cardContent }</ReactTooltip>
          </Card>
        </Col>
        <Col>
          <Card><Card.Body><CardContent country={cardContent.split(" — ")[0]} data = {props.data}></CardContent></Card.Body></Card>
        </Col>
      </Row>

    </div>
  );
}


const App = () => (
  <Container fluid>
    <Jumbotron>
      <h1 className="header" style={{textAlign: "center", marginBottom: "3%"}}>Welcome to the Covid-19 dashboard
      <span role="img" aria-label="tada">
      🦠
      </span>
      </h1>
      <MyComponent></MyComponent>
    </Jumbotron>
  </Container>
);

export default App;
