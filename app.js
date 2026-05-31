import dotenv from 'dotenv';
import express from 'express';
import hbs from 'hbs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Busquedas } from './modelos/busquedas.js';

dotenv.config();

// Configuración __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App
const app = express();
const port = process.env.PORT;

// ==================
// CONFIGURACIÓN VISTAS
// ==================
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// HOME
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/clima', async (req, res) => {
  try {
    // Se toma la ciudad exacta si viene de selección, o el nombre normal del formulario
    const ciudadFull = req.query.ciudadFull || req.query.ciudad;

    if (!ciudadFull) {
      return res.render('home', { error: 'Debes escribir una ciudad' });
    }

    const busquedas = new Busquedas();
    const lugares = await busquedas.ciudad(ciudadFull);

    if (lugares.length === 0) {
      return res.render('home', { error: 'No se encontró la ciudad' });
    }

    // Si hay varias coincidencias y viene de búsqueda normal, mostrar lista
    if (!req.query.ciudadFull && lugares.length > 1) {
      const sugerencias = lugares.slice(0, 5); // máximo 5
      return res.render('seleccion', { lugares: sugerencias });
    }

    // Buscar coincidencia exacta si viene de selección
let lugar = lugares.find(l => `${l.lugar},${l.pais}` === ciudadFull) || lugares[0];


    const clima = await busquedas.clima(lugar.lat, lugar.lon);
    busquedas.guardaBusqueda(lugar.lugar);

    return res.render('home', {
      ciudad: lugar.lugar,
      latitud: lugar.lat,
      longitud: lugar.lon,
      descripcion: clima.descripcion,
      temperatura: clima.temp,
      temp_min: clima.min,
      temp_max: clima.max,
      humedad: clima.humedad
    });

  } catch (error) {
    res.render('home', { error: 'No se pudo encontrar la ciudad' });
  }
});


// HISTORIAL 
app.get('/historial', (req, res) => {
  const busquedas = new Busquedas();
  res.render('historial', {
    historial: busquedas.historial
  });
});


app.get(/.*/, (request, response)=>{
          response.sendFile(path.resolve(__dirname, 'public/404.html'));
})

// ==================
// SERVIDOR
// ==================
app.listen(port, () => {
  console.log('Servidor corriendo en puerto', port);
});

/*const colors = await import('colors');
import dotenv from 'dotenv';
import { capturaEntrada, inquirerMenu, listadoCiudades, pausa } from './js/inquirer.js';
import { Busquedas } from './modelos/busquedas.js';

dotenv.config();

const main = async ()=>{
    let resp; 
  
    const busquedas = new Busquedas();
    do{
        resp = await inquirerMenu()
                switch (resp) {
                    case 1: const lugar = await capturaEntrada('Ciudad: ')
                            const lugares = await busquedas.ciudad(lugar)
                            const id = await listadoCiudades(lugares);
                            const lugarSeleccionado = lugares.find(ciudad => ciudad.id == id);
                            busquedas.guardaBusqueda(lugarSeleccionado.lugar);
                            const climaCiudad = await busquedas.clima(lugarSeleccionado.lat, lugarSeleccionado.lon);
                            console.log(`\n${colors.default.yellow('Ciudad: ')} ${lugarSeleccionado.lugar}`);
                            console.log(`${colors.default.yellow('Latitud: ')} ${lugarSeleccionado.lat}`);
                            console.log(`${colors.default.yellow('Longitud: ')} ${lugarSeleccionado.lon}`);
                            console.log(`${colors.default.yellow('Clima: ')} ${climaCiudad.descripcion}`);
                            console.log(`${colors.default.yellow('Temperatura: ')} ${climaCiudad.temp}`);
                            console.log(`${colors.default.yellow('Temperatura mínima: ')} ${climaCiudad.min}`);
                            console.log(`${colors.default.yellow('Temperatura máxima: ')} ${climaCiudad.max}`);
                            console.log(`${colors.default.yellow('Sensación térmica: ')} ${climaCiudad.humedad}`);
                        break;
                
                    case 2:
                        let cont = 1;
                        busquedas.historial.forEach((lugar)=>{
                            console.log(`${colors.default.green(cont.toString()+'.')} ${colors.default.white(lugar)}`);
                            cont++;
                        })
                        break;
                }
                if (resp !== 0) {
                    await pausa()
                }
    }while(resp!==0);
    console.clear();
}

main()*/