export class Tipo {
    
    private _tipoId: Number = 0 
    private _nombre: String = ''
    private _tipo: String = ''
   
    
    public Tipo(){
    }

    public get tipoId(): Number {
        return this._tipoId
    }

    public set tipoId(value: Number) {
        this._tipoId = value
    }

    public get nombre(): String {
        return this._nombre
    }
    public set nombre(value: String) {
        this._nombre = value
    }

    
    public get tipo(): String {
        return this._tipo
    }

    public set tipo(value: String) {
        this._tipo = value
    }
}