export class Timeseries{

    private _device_id: Number = 0
    private _timestamp: Number = 0
    private _type: Number = 0
    private _value: Number = 0
    private _meassure: String = ''


    public Timeseries(){
    }

    public set device_id(id:Number) {
        this._device_id = id
    }

    public get device_id() { return this._device_id }

    public set timestamp (t:Number) {
        this._timestamp = t
    }

    public get timestamp() { return this._timestamp}

    public set value(value:Number){
        this._value = value
    }
    
    public get value() { return this._value}

    public set meassure(meassure:String) {
        this._meassure = meassure
    }

    public get meassure() { return this._meassure}
}