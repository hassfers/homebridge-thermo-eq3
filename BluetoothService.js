const CommandPath = "/home/pi/homebridge-thermo/homebridge-thermo-eq3/src/eq3.exp "
var shell = require('shelljs');

class BluetoothService{
    constructor(address){
        this.address = address
        this.parameter = {
            boost: false,
            temperature: 20
        }
    }
}

// setInterval(BluetoothService.prototype.updateDeviceState = function(next) {
//     this.address = "00:1A:22:0E:0B:A1"
//     console.log(this.address) 
//     let output = shell.exec(CommandPath + this.address + " json", /*{ silent: true }*/)
//     console.log("refresh device State")
// }, 5000)

BluetoothService.prototype.updateDeviceStatus = function(next) {
        console.log("Update device: " + this.address) 
        let output = shell.exec(CommandPath + this.address + " json", { silent: true })
        try {
            const thermoData = JSON.parse(output)
            console.log(thermoData)
            this.parameter = {
                boost: thermoData["boost"],
                temperature: thermoData["temperature"]
            }
          } catch(err) {
            console.error(err)
          }
        console.log("refresh device State")
        shell.exec(CommandPath + this.address +  " clear")
    }

    BluetoothService.prototype.setTemperature = function(temperature) {
        console.log("set Temperature device: " + this.address +" "+ temperature) 

    }

    BluetoothService.prototype.setBoostMode = function(boostMode) {
        console.log("set Temperature device: " + this.address + " " + boostMode) 
        if (this.parameter.boost == boostMode) { return }
        this.parameter.boost = boostMode
        if(boostMode){
        let output = shell.exec(CommandPath + this.address + " boost", /*{silent:true}*/)
        console.log("setting boost to " + boostMode)
        } else {
        let output = shell.exec(CommandPath+ this.address + " boost off", /*{silent:true}*/)
        console.log("setting boost to " + boostMode)
        }
        shell.exec(CommandPath + this.address +  " clear")
    }

module.exports = BluetoothService
