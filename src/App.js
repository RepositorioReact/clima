import React, {Fragment, useState, useEffect} from 'react';
import Header from './components/Header';
import Formulario from './components/Formulario';
import Clima from './components/Clima';
import Error from './components/Error';

function App() {
  //useState del formulario
  const [busqueda, guardarBusqueda] = useState({
    ciudad: '',
    pais: ''
  });

  //state para que no se consulte la api cada vez que se hace el useEffect
  const [consultar, guardarConsultar] = useState(false);

  //state para mostrar y guardar el resultado 
  const [resultado, guardarResultado] = useState({});

  //state para guardar error de que no existe la ciudad
  const [error, guardarError] = useState(false);


  //extraer ciudad pais
  const {ciudad, pais} = busqueda;

  useEffect(() => {
    const consultarAPI = async () => {
      if(consultar){
          //http://api.openweathermap.org/data/2.5/weather?q=guadalajara,mexico&appid=cb7ce0479d0503a214eafc61dc4fc925
          const appID = 'cb7ce0479d0503a214eafc61dc4fc925';
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

          const respuesta = await fetch(url);
          const resultado = await respuesta.json();
          guardarResultado(resultado);
          //volvemos a poner false la consulta para reiniciar una vez consultado
          guardarConsultar(false);

          //detecta si el resultado(ciudad) es correcto en la consulta
          if(resultado.cod === "404"){
            guardarError(true);
          }else{
            guardarError(false);
          }
      }
    }
    //se llama a sí misma la función para cuando inicie
    consultarAPI();
    // eslint-disable-next-line
  }, [consultar]);//Cuando consultar cambie de false a true, es cuando se hace la consulta. Cambia a true en Formulario.js

  //esto es una carga condicional de componentes, en caso de que no exista la ciudad muestra un mensaje de error y en caso de que sí exista muestra el componente de clima
  let componente;
  if(error){
    componente = <Error mensaje="No hay resultados"/>
  }else{
    componente = <Clima
                  resultado={resultado}
                />
  }

  return (
    <Fragment>
      <Header
        titulo='Clima React App'
      />
      <div className="contenedor-form">
        <div className="container">
          <div className="row">
            <div className="col m6 s12">
              <Formulario
                busqueda={busqueda}
                guardarBusqueda={guardarBusqueda}
                guardarConsultar={guardarConsultar}
              />
            </div>
            <div className="col m6 s12">
              {componente}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
