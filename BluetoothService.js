//nohup ./eq3.exp 00:1A:22:0E:01:BE boost off > /dev/null 2>&1 &
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

BluetoothService.prototype.updateDeviceStatus = function(next) {
        console.log("Update device status: " + this.address) 
        let output = shell.exec(CommandPath + this.address + " " + "json", { silent: true })
        try {
            const thermoData = JSON.parse(output)
            // console.log(thermoData)
            this.parameter = {
                boost: thermoData["mode"]["boost"],
                temperature: thermoData["temperature"]
            }
            console.log(this.parameter)
          } catch(err) {
            console.error(err)
          }
        console.log("refreshed device State")
        shell.exec(CommandPath + this.address +  " clear")
    }

    BluetoothService.prototype.setTemperature = function(temperature) {
        console.log("set Temperature device: " + this.address + " " + temperature) 
        let output = shell.exec(CommandPath + this.address + " " +  "temp" + " " + temperature,{silent:true,async:true})
        shell.exec(CommandPath + this.address + " " +  "clear", {silent:true,async:true})
    }

    BluetoothService.prototype.setBoostMode = function(boostMode) {
        console.log("set device: " + this.address + " Boostmode to: " + boostMode) 
        if (this.parameter.boost == boostMode) { return }
        this.parameter.boost = boostMode

        if(boostMode){
        let output = shell.exec(CommandPath + this.address + " " +  "boost", {silent:true,async:true})
        console.log("setting boost to " + boostMode)
        } else {
        let output = shell.exec(CommandPath+ this.address + " " + "boost off", {silent:true,async:true})
        console.log("setting boost to " + boostMode)
        }
        shell.exec(CommandPath + this.address + " " +  "clear", {silent:true,async:true})
    }

module.exports = BluetoothService
