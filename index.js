require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {

    const busquedas = new Busquedas();

    let opt;

    do {

        opt = await inquirerMenu();

        switch( opt ){

            case 1:
                // Mostrar mensaje
                const terminoBusqueda = await leerInput('Ciudad: ');
                
                // Buscar los lugares
                const lugares = await busquedas.ciudad( terminoBusqueda );
                
                // Seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado === 0) continue;

                
                const lugarSeleccionado = lugares.find( lugar => lugar.id === idSeleccionado );
                
                //Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                //Clima

                const clima = await busquedas.climaCiudad(lugarSeleccionado.lat, lugarSeleccionado.lng)

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Temperatura máxima:', clima.max);
                console.log('Temperatura mínima:', clima.min);
                console.log('Como esta el clima:', clima.desc);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1}`.green;
                    console.log( `${ idx } ${ lugar }`);
                });
            break;

        }


        if(opt !== 0) await pausa();

        
    } while(opt != 0)

} 


main();