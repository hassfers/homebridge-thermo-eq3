//includes 
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });
const Thermostat = require('./Thermostat.js')

//Homebridge
var Service;
var Characteristic;
var HomebridgeAPI;


module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory('homebridge-thermo-eq3', 'eq3BT-Python', eq3blePython);
}

function getSerial(){
	var fs = require('fs');
	var content = fs.readFileSync('/proc/cpuinfo', 'utf8').split("\n");	
	var serial = content[content.length-3].split(":");
	return serial[1].slice(9);
}

function eq3blePython(log, config) {
	this.workingDir = "/homebridge/homebridge-thermo-eq3/"
	this.name = "temp";
	this.log = log;
	this.config = config;
	this.thermoService = new Service.Thermostat(config['name']);
	this.switchService = new Service.Switch(config['name']+ " " + 'Boost');
	this.serialNumber = getSerial() + this.name
	this.thermostat = new Thermostat(config['address'],Characteristic,this.thermoService,this.switchService)

	var thermostat = this.thermostat
	// console.log(thermostat)
	// console.log(this.thermoService)
	// console.log(this.workingDir)
	// console.log("config:");
	// console.log(config);

	this.informationService = new Service.AccessoryInformation();
	this.informationService
		.setCharacteristic(Characteristic.Manufacturer, "hassfers")
		.setCharacteristic(Characteristic.Model, "eq3-Thermostat")
		.setCharacteristic(Characteristic.SerialNumber, this.serialNumber );

	
	this.switchService
		.getCharacteristic(Characteristic.On)
		.on('get', thermostat.getSwitchOnCharacteristic.bind(thermostat))
		.on('set', thermostat.setSwitchOnCharacteristic.bind(thermostat));


	this.thermoService
	.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
	.on('get', thermostat.getCurrentHeatingCoolingState.bind(thermostat));

	this.thermoService
	.getCharacteristic(Characteristic.TargetHeatingCoolingState)
	.on('get', thermostat.getTargetHeatingCoolingState.bind(thermostat))
	.on('set', thermostat.setTargetHeatingCoolingState.bind(thermostat));


	this.thermoService
	.getCharacteristic(Characteristic.TargetTemperature)
	.on('get', thermostat.getTargetTemperature.bind(thermostat))
	.on('set', thermostat.setTargetTemperature.bind(thermostat))
	.setProps({
        minValue: 5,
        maxValue: 30,
        minStep: 1
	  });
	  
	  this.thermoService
      .getCharacteristic(Characteristic.CurrentTemperature)
	  .on('get', thermostat.getCurrentTemperature.bind(thermostat));
	  

	  this.thermoService 
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .on('get', thermostat.getTemperatureDisplayUnits.bind(thermostat))
      .on('set', thermostat.setTemperatureDisplayUnits.bind(thermostat));

	// console.log(this.switchService)
	console.log("serialNumber " + this.serialNumber)
	console.log("init complete")
}


// Service declaration  
eq3blePython.prototype.getServices = function () {
	return [this.informationService,this.thermoService,this.switchService];
}

