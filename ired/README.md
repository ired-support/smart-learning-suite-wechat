# Instruction for using iREd BLE module in WeChat Mini Program

A short summary: This folder contains examples and instructions for integrating iREd BLE (Bluetooth Low Energy) devices—such as thermometers, oximeters, blood pressure monitors, scales, jump ropes, and heart rate monitors—into WeChat Mini Programs using the iREd Healthkit BLE module. It includes initialization steps, usage examples, and event callbacks for pairing, connecting, receiving device data, and handling errors.

### app.json Configuration

```json
"permission": {
  "scope.userLocation": {
    "desc": "Required for Bluetooth."
  }
}
```

### Import the iREd BLE module

```js
const healthKit = require("../../ired/HealthkitBleManager");
```

### Thermometer Complete Example

```js
const currentDevice = "thermometer";
async onLoad(options) {
    await healthKit.initialise((err, message) => {
      if (err) {
        console.error("init Error", err);
      } else {
        console.log("init success", message);
        if (message === "pairedTheremometerLoaded") {
          this.setData({
            isPaired: healthKit.thermometerData.state.isPaired,
          });
        }
      }
    });

    healthKit.setCallback(currentDevice, "onConnectionStateChange", (state) => {
      console.log("onConnectionStateChange", state);
      this.setData({
        isConnected: state.connectionState == true,
      });
    });
    healthKit.setCallback(
      currentDevice,
      "onThermometerDataEvent",
      (event, data) => {
        if (event === "batteryLevel") {
          this.setData({
            batteryLevel: data.batteryLevel,
          });
        } else if (event === "temperature") {
          this.setData({
            temperature: data.temperature,
            modeDescription: data.modeDescription,
          });
        } else if (event === "error") {
          console.log("error", data);
        }
      }
    );
  },

  onUnload() {
    if (this.data.isConnected) {
      healthKit.disconnectDevice(currentDevice, (err) => {
        if (err) {
          console.error(`${currentDevice} Disconnect failed`, err);
        } else {
          console.log(`${currentDevice} Disconnect success`);
        }
      });
    }
  },

  onPairButtonPressed() {
    this.setData({
      isPaired: false,
    });
    healthKit.pairDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Pairing failed`, err);
      } else {
        console.log(`${currentDevice} Pairing success`, device);
        this.setData({
          isPaired: healthKit.thermometerData.state.isPaired,
        });
      }
    });
    let timeout = setTimeout(() => {
      if (!healthKit.thermometerData.state.isPaired) {
        healthKit.stopPairing(currentDevice);
        wx.showToast({
          title: "Pairing failed",
          icon: "none",
          duration: 2000,
        });
      }
    }, 30000);
  },
  onConnectButtonPressed() {
    healthKit.connectDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Connect failed`, err);
      } else {
        console.log(`${currentDevice} Connect success`, device);
      }
    });
  },
  onDisconnectButtonPressed() {
    healthKit.disconnectDevice(currentDevice, (err) => {
      if (err) {
        console.error(`${currentDevice} Disconnect failed`, err);
      } else {
        console.log(`${currentDevice} Disconnect success`);
      }
    });
  },


```

### Oximeter Complete Example
```js
const currentDevice = "oximeter";
async onLoad(options) {
    await healthKit.initialise((err, message) => {
      if (err) {
        console.error("init Error", err);
      } else {
        console.log("init success", message);
        if (message === "pairedOximeterLoaded") {
          this.setData({
            isPaired: healthKit.oximeterData.state.isPaired
          });
        }
      }
    })
    healthKit.setCallback(currentDevice, "onOximeterDataEvent", (event, data) => {
      console.log("onOximeterDataEvent", event, data)
      if (event == currentDevice) {
        // {pulseRate: 80, spo2: 98, pi: 1.5}
        this.setData({
          spo2: data.spo2,
          pulseRate: data.pulseRate,
          pi: data.pi
        });
      } else if (event == "batteryLevel") {
        // {batteryLevel: number, data: array}
        this.setData({
          batteryLevel: data.batteryLevel,
        });
      } else if (event == "error") {
        console.error(data)
      }

    });

    healthKit.setCallback(currentDevice, "onConnectionStateChange", (state) => {
      console.log("onConnectionStateChange", state)
      this.setData({
        isConnected: state.connectionState == true
      });
    });

  },
  onUnload() {
    if (this.data.isConnected) {
      healthKit.disconnectDevice(currentDevice, (err) => {
        if (err) {
          console.error(`${currentDevice} Disconnect failed`, err);
        } else {
          console.log(`${currentDevice} Disconnect success`);
        }
      })
    }
  },
  onPairButtonPressed() {
    this.setData({
      isPaired: false
    });
    healthKit.pairDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Pairing failed`, err);
      } else {
        console.log(`${currentDevice} Pairing success`, device);
        this.setData({
          isPaired: healthKit.oximeterData.state.isPaired
        });
      }
    })
    let timeout = setTimeout(() => {
      if (!healthKit.oximeterData.state.isPaired) {
        healthKit.stopPairing(currentDevice);
        wx.showToast({
          title: "Pairing failed",
          icon: "none",
          duration: 2000,
        });
      }
    }, 30000);
  },

  onConnectButtonPressed() {
    healthKit.connectDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Connect failed`, err);
      } else {
        console.log(`${currentDevice} Connect success`, device);
      }
    })
  },

  onDisconnectButtonPressed() {
    healthKit.disconnectDevice(currentDevice, (err) => {
      if (err) {
        console.error(`${currentDevice} Disconnect failed`, err);
      } else {
        console.log(`${currentDevice} Disconnect success`);
      }
    })
  },
```

### Blood Pressure Monitor Complete Example
```js
const currentDevice = "bloodPressureMonitor";
async onLoad(options) {
    await healthKit.initialise((err, message) => {
      if (err) {
        console.error("init Error", err);
      } else {
        console.log("init success", message);
        if (message === "pairedbloodPressureMonitorLoaded") {
          this.setData({
            isPaired: healthKit.bloodPressureMonitorData.state.isPaired
          });
        }
      }
    })

    healthKit.setCallback(currentDevice, "onConnectionStateChange", (state) => {
      console.log("onConnectionStateChange", state)
      this.setData({
        isConnected: state.connectionState == true
      });
    })

    healthKit.setCallback(currentDevice, "onPressureDataUpdate", (event, data) => {
      console.log("onPressureDataUpdate", event, data)
      // types of data:
      // 1. Final measurement: {systolicPressure, diastolicPressure, pulseRate}
      // 2. Intermediate reading: {pressure, pulseChange}
      // 3. Error: {errorCode, errorMessage}
      if (event == "bloodPressure") {
        this.setData({
          systolicPressure: data.systolicPressure,
          diastolicPressure: data.diastolicPressure,
          pulseRate: data.pulseRate,
        });

      } else if (event == "instantPressure") {
        this.setData({
          pressure: data.pressure,
          pulseChange: data.pulseChange
        });
      } else if (event == "error") {
        console.error("Measurement Error", data.errorCode, data.errorMessage);
      }

    })
  },
  onUnload() {
    if (this.data.isConnected) {
      healthKit.disconnectDevice(currentDevice, (err) => {
        if (err) {
          console.error(`${currentDevice} Disconnect failed`, err);
        } else {
          console.log(`${currentDevice} Disconnect success`);
      })
    }
  },
  onPairButtonPressed() {
    this.setData({
      isPaired: false
    });
    healthKit.pairDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Pairing failed`, err);
      } else {
        console.log(`${currentDevice} Pairing success`, device);
        this.setData({
          isPaired: healthKit.bloodPressureMonitorData.state.isPaired
        });
      }
    })
    let timeout = setTimeout(() => {
      if (!healthKit.bloodPressureMonitorData.state.isPaired) {
        healthKit.stopPairing(currentDevice);
        wx.showToast({
          title: "Pairing failed",
          icon: "none",
          duration: 2000,
        });
      }
    }, 30000);
  },

  onConnectButtonPressed() {
    healthKit.connectDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Connect failed`, err);
      } else {
        console.log(`${currentDevice} Connect success`, device);
      }
    })
  },

  onDisconnectButtonPressed() {
    healthKit.disconnectDevice(currentDevice, (err) => {
      if (err) {
        console.error(`${currentDevice} Disconnect failed`, err);
      } else {
        console.log(`${currentDevice} Disconnect success`);
      }
    })
  },
```

### Scale Complete Example
```js
const currentDevice = "scale";
async onLoad(options) {
    await healthKit.initialise((err, message) => {
      if (err) {
        console.error("init Error", err);
      } else {
        console.log("init success", message);
        if (message === "pairedScaleLoaded") {
          this.setData({
            isPaired: healthKit.scaleData && healthKit.scaleData.state && healthKit.scaleData.state.isPaired
          });
        }
      }
    })
    healthKit.setCallback(currentDevice, "onScaleDataEvent", (event, data) => {
      console.log("onScaleDataEvent", event, data)
      // event: scaleWeight
      // data: {weight: 9.73, isFinalResult: true}
      if (event == "scaleWeight") {
        // {weight: 70.5}
        this.setData({
          weight: data.weight,
          isFinalResult: data.isFinalResult
        });
      } else if (event == "error") {
        console.error(data)
      }
    });
  },
  onUnload() {
    if (this.data.isConnected) {
      healthKit.disconnectDevice(currentDevice, (err) => {
        if (err) {
          console.error(`${currentDevice} Disconnect failed`, err);
        } else {
          console.log(`${currentDevice} Disconnect success`);
      })
    }
  },
  onPairButtonPressed() {
    this.setData({
      isPaired: false
    });
    healthKit.pairDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Pairing failed`, err);
      } else {
        console.log(`${currentDevice} Pairing success`, device);
        this.setData({
          isPaired: healthKit.scaleData && healthKit.scaleData.state && healthKit.scaleData.state.isPaired
        });
      }
    })
    setTimeout(() => {
      if (!(healthKit.scaleData && healthKit.scaleData.state && healthKit.scaleData.state.isPaired)) {
        healthKit.stopPairing(currentDevice);
        wx.showToast({
          title: "Scale Pairing failed",
          icon: "none",
          duration: 2000,
        });
      }
    }, 30000);
  },
  onStartMeasurementButtonPressed() {
    
    healthKit.startScanScaleDevices((err) => {
      if (err) {
        console.error(`${currentDevice} Start measurement failed`, err);
      } else {
        console.log(`${currentDevice} Start measurement success`);
      }
    })
  },

  onStopMeasurementButtonPressed() {
    healthKit.stopScanScaleDevices( (err) => {
      if (err) {
        console.error(`${currentDevice} Stop measurement failed`, err);
      } else {
        console.log(`${currentDevice} Stop measurement success`);
      }
    })
  }
```


### Jump Rope Complete Example
```js
const currentDevice = "jumpRope";
async onLoad(options) {
    await healthKit.initialise((err, message) => {
      if (err) {
        console.error("init Error", err);
      } else {
        console.log("init success", message);
        if (message === "pairedJumpRopeLoaded") {
          this.setData({
            isPaired: healthKit.jumpRopeData.state.isPaired,
          });
        }
      }
    });

    healthKit.setCallback(currentDevice, "onConnectionStateChange", (state) => {
      console.log("onConnectionStateChange", state);
      this.setData({
        isConnected: state.connectionState == true,
      });
    });
    healthKit.setCallback(
      currentDevice,
      "onJumpRopeDataEvent",
      (event, data) => {
        console.log("onJumpRopeDataEvent", event, data);

        if (event === "jumpRopeStatus") {
          const batteryLabel = this.formatBattery(data.battery);
          const modeLabel = this.formatMode(data.mode);
          const statusLabel = this.formatStatus(data.status);
          const formattedTime = this.formatTime(data.time);
          this.setData({
            jumpCount: data.count,
            batteryLevel: data.battery,
            batteryLabel: batteryLabel,
            mode: data.mode,
            modeLabel: modeLabel,
            status: data.status,
            statusLabel: statusLabel,
            setting: data.setting,
            time: data.time,
            formattedTime: formattedTime,
          });
        
        } else if (event === "error") {
          console.log("error", data);
        }
      }
    );
  },
  onUnload() {
    if (this.data.isConnected) {
      healthKit.disconnectDevice(currentDevice, (err) => {
        if (err) {
          console.error(`${currentDevice} Disconnect failed`, err);
        } else {
          console.log(`${currentDevice} Disconnect success`);
      });
    }
  },
  onPairButtonPressed() {
    this.setData({
      isPaired: false,
    });
    healthKit.pairDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Pairing failed`, err);
      } else {
        console.log(`${currentDevice} Pairing success`, device);
        this.setData({
          isPaired: healthKit.jumpRopeData.state.isPaired,
        });
      }
    });
    let timeout = setTimeout(() => {
      if (!healthKit.jumpRopeData.state.isPaired) {
        healthKit.stopPairing(currentDevice);
        wx.showToast({
          title: `${currentDevice} Pairing failed`,
          icon: "none",
          duration: 2000,
        });
      }
    }, 30000);
  },
  onConnectButtonPressed() {
    healthKit.connectDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Connect failed`, err);
      } else {
        console.log(`${currentDevice} Connect success`, device);
      }
    });
  },
  onDisconnectButtonPressed() {
    healthKit.disconnectDevice(currentDevice, (err) => {
      if (err) {
        console.error(`${currentDevice} Disconnect failed`, err);
      } else {
        console.log(`${currentDevice} Disconnect success`);
      }
    });
  },
  setJumpRopeFreeMode(){
    const mode = 0;
    const setting = 0;
    healthKit.sendJumpRopeModeCommand(mode, setting, (err) => {
      if (err) {
        console.error(`${currentDevice} Set free mode failed`, err);
      } else {
        console.log(`${currentDevice} Set free mode success`);
      }
    });
  },
  setJumpRopeTimeMode(){
    const mode = 1;
    const setting = 20;
    healthKit.sendJumpRopeModeCommand(mode, setting, (err) => {
      if (err) {
        console.error(`${currentDevice} Set time mode failed`, err);
      } else {
        console.log(`${currentDevice} Set time mode success`);
      }
    });
  },
  setJumpRopeCountMode(){
    const mode = 2;
    const setting = 20;
    healthKit.sendJumpRopeModeCommand(mode, setting, (err) => {
      if (err) {
        console.error(`${currentDevice} Set count mode failed`, err);
      } else {
        console.log(`${currentDevice} Set count mode success`);
      }
    });
  },
  stopJumpRope(){
    healthKit.sendJumpRopeStopCurrentModeCommand((err) => {
      if (err) {
        console.error(`${currentDevice} Stop failed`, err);
      } else {
        console.log(`${currentDevice} Stop success`);
      }
    });
  },
  formatMode(mode) {
    switch (mode) {
      case 0:
        return "Free";
      case 1:
        return "Time";
      case 2:
        return "Count";
      default:
        return "Unknown";
    }
  },

  formatStatus(status) {
    switch (status) {
      case 0:
        return "Not jumping";
      case 1:
        return "Jumping";
      case 2:
        return "Paused";
      case 3:
        return "Finished";
      default:
        return "Unknown";
    }
  },

  formatBattery(battery) {
    switch (battery) {
      case 0:
        return "0-5%";
      case 1:
        return "6-25%";
      case 2:
        return "26-50%";
      case 3:
        return "51-75%";
      case 4:
        return "76-100%";
      default:
        return "Unknown";
    }
  },

  formatTime(seconds) {
    if (seconds == null) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  },
```

### Heart Rate Monitor Complete Example
```js
const currentDevice = "heartRateMonitor";
async onLoad(options) {
    await healthKit.initialise((err, message) => {
      if (err) {
        console.error("init Error", err);
      } else {
        console.log("init success", message);
        if (message === "pairedHeartRateMonitorLoaded") {
          this.setData({
            isPaired: healthKit.heartRateMonitorData.state.isPaired,
          });
        }
      }
    });

    healthKit.setCallback(currentDevice, "onConnectionStateChange", (state) => {
      console.log("onConnectionStateChange", state);
      this.setData({
        isConnected: state.connectionState == true,
      });
    });
    healthKit.setCallback(
      currentDevice,
      "onHeartRateDataEvent",
      (event, data) => {
        console.log("onHeartRateDataEvent", event, data);
        if (event === "batteryLevel") {
          console.log("battery Level", data);
          this.setData({
            batteryLevel: data.batteryLevel,
          });
        } else if (event === "heartRate") {
          console.log("heartRate", data);
          this.setData({
            heartRate: data.heartRate,
          });
        } else if (event === "error") {
          console.log("error", data);
        }
      }
    );
  },
  onUnload() {
    if (this.data.isConnected) {
      healthKit.disconnectDevice(currentDevice, (err) => {
        if (err) {
          console.error(`${currentDevice} Disconnect failed`, err);
        } else {
          console.log(`${currentDevice} Disconnect success`);
        }
      });
    }
  },
  onPairButtonPressed() {
    this.setData({
      isPaired: false,
    });
    healthKit.pairDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Pairing failed`, err);
      } else {
        console.log(`${currentDevice} Pairing success`, device);
        this.setData({
          isPaired: healthKit.heartRateMonitorData.state.isPaired,
        });
      }
    });
    let timeout = setTimeout(() => {
      if (!healthKit.heartRateMonitorData.state.isPaired) {
        healthKit.stopPairing(currentDevice);
        wx.showToast({
          title: "Pairing failed",
          icon: "none",
          duration: 2000,
        });
      }
    }, 30000);
  },
  onConnectButtonPressed() {
    healthKit.connectDevice(currentDevice, (err, device) => {
      if (err) {
        console.error(`${currentDevice} Connect failed`, err);
      } else {
        console.log(`${currentDevice} Connect success`, device);
      }
    });
  },
  onDisconnectButtonPressed() {
    healthKit.disconnectDevice(currentDevice, (err) => {
      if (err) {
        console.error(`${currentDevice} Disconnect failed`, err);
      } else {
        console.log(`${currentDevice} Disconnect success`);
      }
    });
  },
```
