var Characteristic
const BluetoothService = require('./BluetoothService')

class Thermostat {
  constructor(address,CharacteristicIn,ThermoService,BoostService) {
      this.address = address;
      Characteristic = CharacteristicIn
      this.targetMode = Characteristic.TargetHeatingCoolingState.HEAT
      this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS
      this.currentMode = Characteristic.CurrentHeatingCoolingState.HEAT
      this.currentTemperature = 20
      this.targetTemperature = 20
      this.boostMode = false
      this.thermoService = ThermoService
      this.boostService = BoostService
      this.bluetoothService = new BluetoothService(address)
      // console.log(this.bluetoothService)

      //tell Homebridge default values
      this.thermoService.updateCharacteristic(Characteristic.TargetHeatingCoolingState, Characteristic.TargetHeatingCoolingState.HEAT)
      this.thermoService.updateCharacteristic(Characteristic.CurrentTemperature, this.currentTemperature)
      this.thermoService.updateCharacteristic(Characteristic.TargetTemperature, this.targetTemperature)
      this.boostService.updateCharacteristic(Characteristic.StatusActive,this.boostMode)

      this.refreshDeviceState()
    }
}

Thermostat.prototype.refreshDeviceState = function (next){

  this.bluetoothService.updateDeviceStatus()
  this.parseData()

     //tell Homebridge the new values
     this.thermoService.updateCharacteristic(Characteristic.CurrentTemperature, this.currentTemperature)
     this.thermoService.updateCharacteristic(Characteristic.TargetTemperature, this.targetTemperature)
     this.boostService.updateCharacteristic(Characteristic.StatusActive,this.boostMode)

    //refire function after 5 sec
    //  setTimeout(this.refreshDeviceState(), 30000);
  }

Thermostat.prototype.getSwitchOnCharacteristic = function (next) {
console.log(`calling getOnCharacteristicHandler` + this.isOn + this.address)
next(null, this.isOn);
}

Thermostat.prototype.setSwitchOnCharacteristic = function (on, next) {
this.isOn = on
console.log('setSwitchOnCharacteristic')
this.bluetoothService.setBoostMode(this.isOn)
next(null)
}

Thermostat.prototype.getTargetHeatingCoolingState = function(callback) {
  callback(null, this.targetMode);
}

Thermostat.prototype.setTargetHeatingCoolingState = function (value, callback) {
  console.log(`Called setTargetHeatingCoolingState: ${value} not supported, keep manual`);
  callback(null);
}

Thermostat.prototype.getTargetTemperature = function (callback) {
console.log(`Called getTargetTemperature: ${this.targetTemperature} from ` + this.address);
  callback(null,this.targetTemperature);
}

Thermostat.prototype.setTargetTemperature = function (value, callback) {
  console.log(`Called setTargetTemperature ${value}` + this.address);
  // console.log(this)
  // //homebridge 
  this.targetTemperature = value
  this.currentTemperature = value
  this.thermoService.updateCharacteristic(Characteristic.TargetTemperature, this.targetTemperature)
  this.thermoService.updateCharacteristic(Characteristic.CurrentTemperature, this.currentTemperature)
  //send to device
  this.bluetoothService.setTemperature(value)
  callback(null);
}

Thermostat.prototype.getCurrentTemperature = function (callback) {
callback(null, this.currentTemperature);
}

// Thermostat.prototype.getCurrentRelativeHumidity = function (callback) {
//   // callback(null, this.settings.currentHumidity);
// }

Thermostat.prototype.getTemperatureDisplayUnits = function (callback) {
  callback(null, this.temperatureDisplayUnits);
}

Thermostat.prototype.setTemperatureDisplayUnits = function (value, callback) {
  console.log(`Called setTemperatureDisplayUnits: ${value} not supported`);
  callback(null);
}

Thermostat.prototype.getCurrentHeatingCoolingState = function (callback) {
  console.log(`Called getCurrentHeatingCoolingState`);
  callback(null, this.currentMode);
}

Thermostat.prototype.parseData = function(){  
this.targetTemperature = this.bluetoothService.parameter.temperature
this.boostMode = this.bluetoothService.parameter.boost
this.currentTemperature = this.targetTemperature
  console.log("Parsed form " + this.address + " " + this.targetTemperature + this.boostMode)
}

module.exports = Thermostat