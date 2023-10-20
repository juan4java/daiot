import {Tipo } from './Tipo';
export class Dispositivo {
    
    private _equipoId: Number = 0 
    private _nombre: String = ''
    private _ubicacion: String = ''
    private _tipo: Tipo = new Tipo()
   
    
    public Dispositivo(){
    }

    public get equipoId(): Number {
        return this._equipoId
    }

    public set equipoId(value: Number) {
        this._equipoId = value
    }

    public get tipoId(): Number {
        return this._tipo.tipoId
    }
    public set tipoId(value: Number) {
        this._tipo.tipoId = value
    }

    public get ubicacion(): String {
        return this._ubicacion
    }
    public set ubicacion(value: String) {
        this._ubicacion = value
    }

    public get nombre(): String {
        return this._nombre
    }
    public set nombre(value: String) {
        this._nombre = value
    }
}