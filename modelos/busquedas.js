import axios from "axios";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

export class Busquedas{
    historial = [];
    dbPath = './db/data.json';
    
    constructor(){
        this.restaurarBase();
    }

    async ciudad(lugar = ''){
        const consulta = axios.create({
            baseURL: 'https://api.mapbox.com/search/geocode/v6/forward',
            params: {
                'q': lugar,
                'access_token': process.env.MAPBOX_KEY,
                'language': 'es',
                'limit': 5
            }
        })
        const { data } = await consulta.get()
        return data.features.map((ubicacion)=>({
            id: ubicacion.id,
            lugar: ubicacion.properties.full_address,
            lon: ubicacion.geometry.coordinates[0],
            lat: ubicacion.geometry.coordinates[1]
        }));
    }

    async clima(lat, lon) {
        const consulta = axios.create({
            baseURL: "https://api.openweathermap.org/data/2.5/weather",
            params: {
                lat: lat,
                lon: lon,
                appid: process.env.OPENWEATHER_KEY,
                units: "metric",
                lang: "es",
            },
        })
        const { data } = await consulta.get();
        return {
            descripcion: data.weather[0].description,
            temp: data.main.temp,
            min: data.main.temp_min,
            max: data.main.temp_max,
            humedad: data.main.humidity,
        };
    }

    guardaBusqueda = (lugar = '') => {
        if(this.historial.includes()){
            return;
        }
        this.historial.unshift(lugar);
        this.historial = this.historial.slice(0, 5);

        this.guardaBase();
    };

    guardaBase = () =>{
        const payload = {historial: this.historial};
        writeFileSync(this.dbPath, JSON.stringify(payload));
    };

    restaurarBase = () => {
        if(!existsSync(this.dbPath)){
            return;
        }

        const info = readFileSync(this.dbPath, {encoding: "utf-8"}).trim();
        if(!info){
            this.historial = [];
            return;
        }

        try{
            const data = JSON.parse(info);
            this.historial = Array.isArray(data.historial) ? data.historial : [];
        } catch (err){
            console.error('Error: ', err);
            this.historial = [];
        }
    };

}