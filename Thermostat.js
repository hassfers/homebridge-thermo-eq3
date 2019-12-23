var Characteristic
const BluetoothService = require('./BluetoothService')

class Thermostat {
  constructor(address,CharacteristicIn,Service) {
      this.address = address;
      Characteristic = CharacteristicIn
      this.targetMode = Characteristic.TargetHeatingCoolingState.HEAT,
      this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS,
      this.currentMode = Characteristic.CurrentHeatingCoolingState.HEAT,
      this.currentTemperature = 20,
      this.targetTemperature = 20,
      this.boostMode = false,
      this.thermoService = Service
      this.bluetoothService = new BluetoothService(address)
      console.log(this.bluetoothService)

      //tell Homebridge default values
      this.thermoService.updateCharacteristic(CharacteristicIn.TargetHeatingCoolingState, Characteristic.TargetHeatingCoolingState.HEAT)
      this.thermoService.updateCharacteristic(CharacteristicIn.CurrentTemperature, this.currentTemperature)
      this.thermoService.updateCharacteristic(CharacteristicIn.TargetTemperature, this.targetTemperature)

      // this.refreshDeviceState()
    }
}

// setInterval(Thermostat.prototype.refreshDeviceState = function (next){
// //handle bluetooth connection
// // 00:1A:22:0E:01:BE
// this.bluetoothService.updateDeviceStatus()
// this.parseData()
// },5000)

Thermostat.prototype.refreshDeviceState = function (next){
  // //handle bluetooth connection
  // // 00:1A:22:0E:01:BE
  this.bluetoothService.updateDeviceStatus()
  this.parseData()
  }

Thermostat.prototype.getSwitchOnCharacteristic = function (next) {
console.log(`calling getOnCharacteristicHandler`, this.isOn)
return next(null, this.isOn);
}

Thermostat.prototype.setSwitchOnCharacteristic = function (on, next) {


// if(on){
// let output = shell.exec(this.workingDir + "src/eq3.exp " + address + "boost",{silent:true})
// console.log("setting boost to " + on)
// } else {
// let output = shell.exec(this.workingDir  +"src/eq3.exp " + address + "boost off",{silent:true})
// console.log("setting boost to " + on)
// }

this.isOn = on
console.log('setSwitchOnCharacteristic')
next(null)
}

Thermostat.prototype.getTargetHeatingCoolingState = function(callback) {
  callback(null, this.targetMode);
}

Thermostat.prototype.setTargetHeatingCoolingState = function (value, callback) {
  // this.settings.targetMode = value;
  // const mode = Object.keys(this.targetModes).find(key => this.targetModes[key] === value);
  console.log(`Called setTargetHeatingCoolingState: ${value} not supported, keep manual`);
  // this.daikin.sendJson({targetMode: mode});
  callback(null);
}

Thermostat.prototype.getTargetTemperature = function (callback) {
console.log(`Called getTargetTemperature: ${this.targetTemperature}`);
  callback(null,this.targetTemperature);
}

Thermostat.prototype.setTargetTemperature = function (value, callback) {
  console.log(`Called setTargetTemperature ${value}`);
  // console.log(this)
  this.targetTemperature = value
  this.thermoService.updateCharacteristic(Characteristic.TargetTemperature, this.targetTemperature)
  callback(null);
}

Thermostat.prototype.getCurrentTemperature = function (callback) {
callback(null, this.currentTemperature);
// callback(null, this.temp)
}

// Thermostat.prototype.getCurrentRelativeHumidity = function (callback) {
//   // callback(null, this.settings.currentHumidity);
// }

Thermostat.prototype.getTemperatureDisplayUnits = function (callback) {
  callback(null, this.temperatureDisplayUnits);
}

Thermostat.prototype.setTemperatureDisplayUnits = function (value, callback) {
  console.log(`Called setTemperatureDisplayUnits: ${value} not supported`);
  // setTimeout(() => {
  //   this.service.updateCharacteristic(Characteristic.TemperatureDisplayUnits, this.settings.temperatureDisplayUnits);
  // }, 100);

  callback(null);
}

Thermostat.prototype.getCurrentHeatingCoolingState = function (callback) {
  console.log(`Called getCurrentHeatingCoolingState`);
  callback(null, this.currentMode);
}

Thermostat.prototype.parseData = function(){  
this.targetTemperature = this.bluetoothService.parameter.temperature
this.boostMode = this.bluetoothService.parameter.boost
  console.log("Parsed form " + this.address + ":" + this.targetTemperature + this.boostMode)
}

module.exports = Thermostat