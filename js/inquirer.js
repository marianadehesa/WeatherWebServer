// npm install inquirer Checar en el JSON el dependecies de inquirer

import inquirer from "inquirer";
const colors = await import('colors')

const menu = [{
    type: 'list',
    name: 'menuOpt',
    message: 'Selecciona una opcion:',
    choices: [
        {
            value: 1,
            name: `1. Buscar ciudad`
        },
        {
            value: 2,
            name: `2. Historial`
        },
        {
            value: 0,
            name: `0. Salir`
        }

    ]
}]

export const inquirerMenu = async () =>{
    console.clear()
    console.log(colors.default.blue('==========================='));
    console.log(colors.default.blue('=  Selecciones una opcion ='));
    console.log(colors.default.blue('==========================='));

    const { menuOpt } = await inquirer.prompt(menu)
    return menuOpt
}

export const pausa = async () => {

    await inquirer.prompt( {
        type: 'input',
        name: 'pausa_opt',
        message: `Presiona ${colors.default.yellow('<<ENTER>>')} para continuar`
    })
}

export const capturaEntrada= async(message)=>{
    const respuesta= await inquirer.prompt([{
        type: 'input',
        name: 'resp',
        message,
        validation: ()=>{
            if (capturaEntrada.length==0){
                return 'Entrada invalida. Reintente';
            }
            else {
                return true;
            }
    }
    }])
    return respuesta.resp;
};

export const confirmar= async (message)=>{
    const { ok } = await inquirer.prompt([{
        type: 'confirm',
        name: 'ok',
        message
    }]);
    return ok;
};

export const listadoCiudades = async (listado = []) => {
    let cont = 0;
    const choices = listado.map((ciudad) => {
        cont++
        return {
            value: ciudad.id,
            name: `${colors.default.green(cont.toString() + '.')} ${colors.default.gray(ciudad.lugar)}`
        }
    })

    choices.unshift({
        value: 0, 
        name: `${colors.default.green('0.')} ${colors.default.yellow('Cancelar')}`
    });
    const respuesta = await inquirer.prompt([
        {
            type: 'list',
            name: 'resp',
            message: 'Selecciona la ciudad',
            choices
        }
    ])
    return respuesta.resp

}