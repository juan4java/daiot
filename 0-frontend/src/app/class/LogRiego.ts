export class LogRiego {
    
    private _logRiegoId: Number = 0
    private _apertura: Number = 0
    private _fecha: String = ""
    private _tipoId: Number = 0

    public LogRiego(id?:Number){
        if(id)
            this._logRiegoId = id
    }


    public set logRiegoId(id:Number){
        this._logRiegoId = id
    }    

    public get logRiegoId() { return this._logRiegoId }

    public set apertura(apertura:Number){
        this._apertura = apertura
    }

    public get apertura() { return this._apertura }

    public set fecha(fecha:String){
        this._fecha = fecha
    }

    public get fecha() { return this._fecha }

    public set tipoId(eId:Number){
        this._tipoId = eId
    }

    public get tipoId() { return this._tipoId }
    
}