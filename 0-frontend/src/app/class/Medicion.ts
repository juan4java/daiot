export class Medicion{

    private _id: Number = 0
    private _fecha: String = ''
    private _valor: String = ''

    public Medicion(){
    }

    public set id(id:Number) {
        this._id = id
    }

    public get id() { return this._id }

    public set fecha (fecha:String) {
        this._fecha = fecha
    }

    public get fecha() { return this._fecha}

    public set valor(valor:String){
        this._valor = valor
    }
    
    public get valor() { return this._valor}
}