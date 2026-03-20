// import init from "healthkit";
// import * as healthkit from "healthkit";

import init, {


  pair_thermometer,
  pair_oximeter,
  pair_blood_pressure_monitor,
  pair_heart_rate_monitor,
  pair_jump_rope,
  pair_scale,
  is_thermometer,
  is_oximeter,
  is_blood_pressure_monitor,
  is_heart_rate_monitor,
  is_jump_rope,
  is_scale,
  set_thermometer_data_event_callback,
  set_oximeter_data_event_callback,
  set_blood_pressure_data_event_callback,
  set_jump_rope_data_event_callback,
  set_heart_rate_monitor_data_event_callback,
  set_scale_data_event_callback,
  set_thermometer_device,
  set_oximeter_device,
  set_blood_pressure_monitor_device,
  set_jump_rope_device,
  set_scale_device,
  set_heart_rate_monitor_device,
  parse_thermometer_data,
  parse_oximeter_data,
  parse_blood_pressure_data,
  parse_jump_rope_data,
  parse_heart_rate_monitor_battery_data,
  parse_heart_rate_monitor_data,
  parse_scale_data,
  get_thermometer_battery_command,
  get_jump_rope_mode_command,
  get_jump_rope_mode_command_parameter,
  get_jump_rope_stop_current_mode_command,
  get_heart_rate_monitor_id,
  get_version
} from "healthkit";

class HealthKitBleManager {
  app = getApp();

  HEALTHKIT_UUID = {
    SERVICE_UUID: "0000FFE0-0000-1000-8000-00805F9B34FB",
    NOTIFY_CHAR_UUID: "0000FFE1-0000-1000-8000-00805F9B34FB",
    WRITE_CHAR_UUID: "0000FFE2-0000-1000-8000-00805F9B34FB",
  };

  JUMP_ROPE_UUID = {
    SERVICE_UUID: "0000FE00-0000-1000-8000-00805F9B34FB",
    NOTIFY_CHAR_UUID: "0000FFF1-0000-1000-8000-00805F9B34FB",
    WRITE_CHAR_UUID: "0000FFF2-0000-1000-8000-00805F9B34FB",
  };

  HEART_RATE_UUID = {
    SERVICE_UUID: "0000180D-0000-1000-8000-00805F9B34FB",
    NOTIFY_CHAR_UUID: "00002A37-0000-1000-8000-00805F9B34FB",
    WRITE_CHAR_UUID: "00002A39-0000-1000-8000-00805F9B34FB",
  };

  BATTERY_UUID = {
    SERVICE_UUID: "0000180F-0000-1000-8000-00805F9B34FB",
    NOTIFY_CHAR_UUID: "00002A19-0000-1000-8000-00805F9B34FB",
  };

  isPaired = false;
  isPairing = false;
  pairingType = ""; // thermometer, oximeter or bloodPressureMonitor
  onPairingStatusUpdate = null;

  isScanningScale = false;

  thermometerData = {
    pairedDevice: null,
    state: {
      isConnected: false,
      isPairing: false,
      isPaired: false,
    },
    data: {
      temperature: 0,
      batteryLevel: 0,
      mode: 0,
      modeDescription: "",
    },
  };

  oximeterData = {
    pairedDevice: null,
    state: {
      isConnected: false,
      isPairing: false,
      isPaired: false,
    },
    data: {
      spo2: 0,
      pulseRate: 0,
      pi: 0,
      batteryLevel: 0,
    },
  };

  bloodPressureMonitorData = {
    pairedDevice: null,
    state: {
      isConnected: false,
      isPairing: false,
      isPaired: false,
    },
    data: {
      systolicPressure: 0,
      diastolicPressure: 0,
      pulseRate: 0,
    },
  };

  heartRateMonitorData = {
    pairedDevice: null,
    state: {
      isConnected: false,
      isPairing: false,
      isPaired: false,
    },
    data: {
      heartRate: 0,
      batteryLevel: 0,
      measurementTime: null,
    },
  };

  jumpRopeData = {
    pairedDevice: null,
    state: {
      isConnected: false,
      isPairing: false,
      isPaired: false,
    },
    data: {
      jumpCount: 0,
      batteryLevel: 0,
    },
  };

  scaleData = {
    pairedDevice: null,
    state: {
      isConnected: false,
      isPairing: false,
      isPaired: false,
    },
    data: {
      weight: 0,
      bodyFatPercentage: 0,
      bmi: 0,
      batteryLevel: 0,
    },
  };

  thermometerCallback = {
    onConnectionStateChange: null,
    onTemperatureUpdate: null,
    onBatteryLevelUpdate: null,
  };
  oximeterCallback = {
    onConnectionStateChange: null,
    onOximeterDataUpdate: null,
    onBatteryLevelUpdate: null,
  };
  bloodPressureMonitorCallback = {
    onConnectionStateChange: null,
    onPressureDataUpdate: null,
    onBloodPressureUpdate: null,
  };
  heartRateMonitorCallback = {
    onConnectionStateChange: null,
    onHeartRateDataEvent: null,
    onBatteryLevelUpdate: null,
  };
  jumpRopeCallback = {
    onConnectionStateChange: null,
    onJumpRopeDataEvent: null,
  };
  scaleCallback = {
    onScaleDataEvent: null,
  };

  constructor() {
    // this.checkAndGetLocation(
    //   (res) => console.log("Location success", res),
    //   (err) => console.log("Location failed", err)
    // );
    // ble scanning result
    wx.onBluetoothDeviceFound((result) => {
      // console.log("onBluetoothDeviceFound result:", result);
      // console.log("Devicetype", this.pairingType);
      result.devices.forEach((device) => {
        if (this.isPairing) {
          // filter the device with weak signal
          if (device.RSSI && device.RSSI < -65) {
            return;
          }
          if (this.pairingType == "thermometer") {
            if (is_thermometer(device)) {
              console.log(device);
              try {
                console.log("is thermometer device");
                let pairedDevice = pair_thermometer(device);
                if (pairedDevice) {
                  console.log(pairedDevice);
                  wx.stopBluetoothDevicesDiscovery();
                  console.log("Device found", device);
                  this.thermometerData.pairedDevice = pairedDevice;
                  this.thermometerData.state.isPaired = true;

                  this.isPairing = false;
                  this.onPairingStatusUpdate(null, pairedDevice);

                  wx.setStorageSync("pairedThermometer", pairedDevice);
                }
              } catch (err) {
                console.error("error pairing thermometer: ", err);
              }
              return;
            }
          } else if (this.pairingType == "oximeter") {
            if (is_oximeter(device)) {
              console.log(device);
              try {
                console.log("is oximeter device");
                let pairedDevice = pair_oximeter(device);
                if (pairedDevice) {
                  console.log(pairedDevice);
                  wx.stopBluetoothDevicesDiscovery();
                  console.log("Device found", device);
                  this.oximeterData.pairedDevice = pairedDevice;
                  this.oximeterData.state.isPaired = true;

                  this.isPairing = false;
                  this.onPairingStatusUpdate(null, pairedDevice);

                  wx.setStorageSync("pairedOximeter", pairedDevice);
                }
              } catch (err) {
                console.error("error pairing oximeter: ", err);
              }
            }
          } else if (this.pairingType == "bloodPressureMonitor") {
            if (is_blood_pressure_monitor(device)) {
              console.log(device);
              try {
                console.log("is blood pressure monitor device");
                let pairedDevice = pair_blood_pressure_monitor(device);
                if (pairedDevice) {
                  console.log(pairedDevice);
                  wx.stopBluetoothDevicesDiscovery();
                  console.log("Device found", device);
                  this.bloodPressureMonitorData.pairedDevice = pairedDevice;
                  this.bloodPressureMonitorData.state.isPaired = true;

                  this.isPairing = false;
                  this.onPairingStatusUpdate(null, pairedDevice);

                  wx.setStorageSync("pairedbloodPressureMonitor", pairedDevice);
                }
              } catch (err) {
                console.error("error pairing blood pressure monitor: ", err);
              }
            }
          } else if (this.pairingType == "heartRateMonitor") {
            // console.log(device);
            // if device.name contains with "CL831"
            if (device.name != null && device.name.startsWith("CL831")) {
              console.log("find device");
            }
            if (is_heart_rate_monitor(device)) {
              // console.log(device);
              try {
                // wx.stopBluetoothDevicesDiscovery();
                // let x = get_heart_rate_monitor_id(device);
                // console.log("heart rate monitor id:", x);

                console.log("is heart rate monitor device");
                let pairedDevice = pair_heart_rate_monitor(device);
                if (pairedDevice) {
                  console.log(pairedDevice);
                  wx.stopBluetoothDevicesDiscovery();
                  console.log("Device found", device);
                  this.heartRateMonitorData.pairedDevice = pairedDevice;
                  this.heartRateMonitorData.state.isPaired = true;

                  this.isPairing = false;
                  this.onPairingStatusUpdate(null, pairedDevice);

                  wx.setStorageSync("pairedHeartRateMonitor", pairedDevice);
                }
              } catch (err) {
                console.error("error pairing heart rate monitor: ", err);
              }
            }
          } else if (this.pairingType == "jumpRope") {
            // jump rope device pairing logic can be added here
            if (device.name != null && device.name.includes("QN-Rope")) {
              console.log("is jump rope device");
              if (is_jump_rope(device)) {
                console.log("is jump rope device confirmed");
                console.log("device:", device);

                try {
                  let pairedDevice = pair_jump_rope(device);
                  // console.log("pairedDevice:",pairedDevice);
                  if (pairedDevice) {
                    console.log(pairedDevice);
                    wx.stopBluetoothDevicesDiscovery();
                    console.log("Device found", device);
                    this.jumpRopeData.pairedDevice = pairedDevice;
                    this.jumpRopeData.state.isPaired = true;

                    this.isPairing = false;
                    this.onPairingStatusUpdate(null, pairedDevice);

                    wx.setStorageSync("pairedJumpRope", pairedDevice);
                  }
                } catch (err) {
                  console.error("error pairing jump rope: ", err);
                }
              }
            }
          } else if (this.pairingType == "scale") {
            // scale device pairing logic can be added here
            if (device.name != null && device.name.includes("AAA002")) {
              console.log("is scale device");
              if (is_scale(device)) {
                console.log("is scale device confirmed");
                console.log("device:", device);
                try {
                  let pairedDevice = pair_scale(device);  

                  if (pairedDevice) {
                    console.log(pairedDevice);
                    wx.stopBluetoothDevicesDiscovery();
                    console.log("Device found", device);
                    this.scaleData.pairedDevice = pairedDevice;
                    this.scaleData.state.isPaired = true;
                    this.isPairing = false;
                    this.onPairingStatusUpdate(null, pairedDevice);
                    wx.setStorageSync("pairedScale", pairedDevice);
                  }
                } catch (err) {
                  console.error("error pairing scale: ", err);
                }
              }
            }
          }
        } else {
          // not is pairing  , maybe scanning scale
          if (this.isScanningScale) {
           
            if (device.name != null && device.name.includes("AAA002")) {
               console.log("Scanning scale devices...", device);
              let res =  parse_scale_data(device);
              console.log("Parsed Scale Data:", res);

            }
            
            // handle scale scanning logic here
          }
        }
      });
    });

    wx.onBLEConnectionStateChange((result) => {
      console.log("onBLEConnectionStateChange result:", result);
      let deviceType = this.getDeviceTypeByDeviceId(result.deviceId);
      if (deviceType == "thermometer") {
        if (result.connected) {
          this.thermometerCallback.onConnectionStateChange({
            connectionState: true,
          });
        } else {
          this.thermometerCallback.onConnectionStateChange({
            connectionState: false,
          });
        }
      } else if (deviceType == "oximeter") {
        if (result.connected) {
          this.oximeterCallback.onConnectionStateChange({
            connectionState: true,
          });
        } else {
          this.oximeterCallback.onConnectionStateChange({
            connectionState: false,
          });
        }
      } else if (deviceType == "bloodPressureMonitor") {
        if (result.connected) {
          this.bloodPressureMonitorCallback.onConnectionStateChange({
            connectionState: true,
          });
        } else {
          this.bloodPressureMonitorCallback.onConnectionStateChange({
            connectionState: false,
          });
        }
      } else if (deviceType == "heartRateMonitor") {
        if (result.connected) {
          this.heartRateMonitorCallback.onConnectionStateChange({
            connectionState: true,
          });
        } else {
          this.heartRateMonitorCallback.onConnectionStateChange({
            connectionState: false,
          });
        }
      } else if (deviceType == "jumpRope") {
        if (result.connected) {
          this.jumpRopeCallback.onConnectionStateChange({
            connectionState: true,
          });
        } else {
          this.jumpRopeCallback.onConnectionStateChange({
            connectionState: false,
          });
        }
      } 
    });

    wx.onBLECharacteristicValueChange((result) => {
      console.log("onBLECharacteristicValueChange result:", result);
      let deviceType = this.getDeviceTypeByDeviceId(result.deviceId);
      console.log("Device Type:", deviceType);
      const arr = new Uint8Array(result.value);
      // console.log(arr);
      if (deviceType === "thermometer" && arr.length >= 6) {
        let resultData = parse_thermometer_data(result.deviceId, arr);
        // console.log("Parsed Data:", resultData);
      } else if (deviceType === "oximeter") {
        // oximeter data
        let resultData = parse_oximeter_data(result.deviceId, arr);
        // console.log("Parsed Data:", resultData);
      } else if (deviceType === "bloodPressureMonitor") {
        // blood pressure data
        let resultData = parse_blood_pressure_data(result.deviceId, arr);
        // console.log("Parsed Data:", resultData);
      } else if (deviceType === "heartRateMonitor") {
        // check service uuid and char uuid 
        if (result.serviceId === this.HEART_RATE_UUID.SERVICE_UUID){
          let resultData = parse_heart_rate_monitor_data(result.deviceId, arr);

        } else if (result.serviceId === this.BATTERY_UUID.SERVICE_UUID){
          let resultData = parse_heart_rate_monitor_battery_data(result.deviceId, arr);
        }
      
        // console.log("Parsed Heart Rate Monitor Data:", resultData);
      } else if (deviceType === "jumpRope") {
        let resultData = parse_jump_rope_data(result.deviceId, arr);
        // console.log("Parsed Jump Rope Data:", resultData);
      } else if (deviceType === "scale") {
        // scale data parsing can be added here
      }
    });
  }

  async initialise(callback) {
    wx.openBluetoothAdapter({
      mode: "central",
      success: (res) => {
        console.log("openBluetoothAdapter success");

        //read pairedThermometer from storage
        wx.getStorage({
          key: "pairedThermometer",
          success: (res) => {
            console.log("read pairedThermometer from storage:", res);
            this.thermometerData.pairedDevice = res.data;
            let setResult = set_thermometer_device(res.data); // set device for thermometer parsing
            console.log("set_thermometer_device result:", setResult);
            this.thermometerData.state.isPaired = true;

            console.log(
              "pairedThermometer from storage:",
              this.thermometerData.pairedDevice
            );
            callback?.(null, "pairedTheremometerLoaded");
          },
          fail: (err) => {
            // console.log("getStorageSync failed", err);
          },
        });
        wx.getStorage({
          key: "pairedOximeter",
          success: (res) => {
            this.oximeterData.pairedDevice = res.data;
            this.oximeterData.state.isPaired = true;
            let setResult = set_oximeter_device(res.data); // set device for oximeter parsing
            console.log("set_oximeter_device result:", setResult);

            console.log(
              "pairedOximeter from storage:",
              this.oximeterData.pairedDevice
            );
            callback?.(null, "pairedOximeterLoaded");
          },
          fail: (err) => {
            // console.log("getStorageSync failed", err);
          },
        });
        wx.getStorage({
          key: "pairedbloodPressureMonitor",
          success: (res) => {
            this.bloodPressureMonitorData.pairedDevice = res.data;
            this.bloodPressureMonitorData.state.isPaired = true;
            let setResult = set_blood_pressure_monitor_device(res.data); // set device for blood pressure monitor parsing
            console.log("set_blood_pressure_monitor_device result:", setResult);
            console.log(
              "pairedbloodPressureMonitor from storage:",
              this.bloodPressureMonitorData.pairedDevice
            );
            callback?.(null, "pairedBloodPressureMonitorLoaded");
          },
          fail: (err) => {
            // console.log("getStorageSync failed", err);
          },
        });
        wx.getStorage({
          key: "pairedHeartRateMonitor",
          success: (res) => {
            this.heartRateMonitorData.pairedDevice = res.data;
            this.heartRateMonitorData.state.isPaired = true;
            let setResult = set_heart_rate_monitor_device(res.data); // set device for heart rate monitor parsing
            console.log("set_heart_rate_monitor_device result:", setResult);
            console.log(
              "pairedHeartRateMonitor from storage:",
              this.heartRateMonitorData.pairedDevice
            );
            callback?.(null, "pairedHeartRateMonitorLoaded");
          },
          fail: (err) => {
            // console.log("getStorageSync failed", err);
          },
        });
        // jump rope paired device load
        wx.getStorage({
          key: "pairedJumpRope",
          success: (res) => {
            this.jumpRopeData.pairedDevice = res.data;
            this.jumpRopeData.state.isPaired = true;
            let setResult = set_jump_rope_device(res.data); // set device for jump rope parsing
            console.log("set_jump_rope_device result:", setResult);
            console.log(
              "pairedJumpRope from storage:",
              this.jumpRopeData.pairedDevice
            );
            callback?.(null, "pairedJumpRopeLoaded");
          },
          fail: (err) => {
            // console.log("getStorageSync failed", err);
          },
        });
        // scale paired device load
        wx.getStorage({
          key: "pairedScale",
          success: (res) => {
            this.scaleData.pairedDevice = res.data;
            this.scaleData.state.isPaired = true;
            let setResult = set_scale_device(res.data); // set device for scale parsing
            console.log("set_scale_device result:", setResult);
            console.log(
              "pairedScale from storage:",
              this.scaleData.pairedDevice
            );
            callback?.(null, "pairedScaleLoaded");
          },
          fail: (err) => {
            // console.log("getStorageSync failed", err);
          },
        });


        callback?.(null, "init success");
      },
      fail: (err) => {
        wx.showToast({
          title: "Please enable Bluetooth",
          icon: "error",
        });
        callback?.(err);
      },
    });

    await init("/ired/healthkit.wasm");

    console.log("Healthkit sdk version:", get_version());

    callback?.(null, "init success");
  }

  getDeviceIdByDeviceType(deviceType) {
    let deviceId = "";
    if (deviceType === "thermometer" && this.thermometerData.state.isPaired) {
      deviceId = this.thermometerData.pairedDevice?.deviceId || "";
    } else if (deviceType === "oximeter" && this.oximeterData.state.isPaired) {
      deviceId = this.oximeterData.pairedDevice?.deviceId || "";
    } else if (
      deviceType === "bloodPressureMonitor" &&
      this.bloodPressureMonitorData.state.isPaired
    ) {
      deviceId = this.bloodPressureMonitorData.pairedDevice?.deviceId || "";
    } else if (
      deviceType === "heartRateMonitor" &&
      this.heartRateMonitorData.state.isPaired
    ) {
      deviceId = this.heartRateMonitorData.pairedDevice?.deviceId || "";
    } else if (
      deviceType === "jumpRope" &&
      this.jumpRopeData.state.isPaired
    ) {
      deviceId = this.jumpRopeData.pairedDevice?.deviceId || "";
    } else if (
      deviceType === "scale" &&
      this.scaleData.state.isPaired
    ) {
      deviceId = this.scaleData.pairedDevice?.deviceId || "";
    }
    return deviceId;
  }

  getDeviceTypeByDeviceId(deviceId) {
    let deviceType = "";
    if (
      this.thermometerData.pairedDevice &&
      this.thermometerData.pairedDevice.deviceId != null &&
      deviceId == this.thermometerData.pairedDevice.deviceId
    ) {
      deviceType = "thermometer";
    } else if (
      this.oximeterData.pairedDevice &&
      this.oximeterData.pairedDevice.deviceId != null &&
      deviceId == this.oximeterData.pairedDevice.deviceId
    ) {
      deviceType = "oximeter";
    } else if (
      this.bloodPressureMonitorData.pairedDevice &&
      this.bloodPressureMonitorData.pairedDevice.deviceId != null &&
      deviceId == this.bloodPressureMonitorData.pairedDevice.deviceId
    ) {
      deviceType = "bloodPressureMonitor";
    } else if (
      this.heartRateMonitorData.pairedDevice &&
      this.heartRateMonitorData.pairedDevice.deviceId != null &&
      deviceId == this.heartRateMonitorData.pairedDevice.deviceId
    ) {
      deviceType = "heartRateMonitor";
    } else if (
      this.jumpRopeData.pairedDevice &&
      this.jumpRopeData.pairedDevice.deviceId != null &&
      deviceId == this.jumpRopeData.pairedDevice.deviceId
    ) {
      deviceType = "jumpRope";
    } else if (
      this.scaleData.pairedDevice &&
      this.scaleData.pairedDevice.deviceId != null &&
      deviceId == this.scaleData.pairedDevice.deviceId
    ) {
      deviceType = "scale";
    }

    return deviceType;
  }

  // set device callback
  setCallback(deviceType, callbackType, callback) {
    console.log("setCallback:", deviceType, callbackType);
  
    if (typeof callback === "function") {
      if (deviceType === "thermometer") {
        if (callbackType === "onThermometerDataEvent") {
          set_thermometer_data_event_callback(callback);
        } else if (callbackType === "onConnectionStateChange") {
          this.thermometerCallback.onConnectionStateChange = callback;
        }
      } else if (deviceType === "oximeter") {
        if (callbackType === "onOximeterDataEvent") {
          set_oximeter_data_event_callback(callback);
        } else if (callbackType === "onConnectionStateChange") {
          this.oximeterCallback.onConnectionStateChange = callback;
        }
      } else if (deviceType === "bloodPressureMonitor") {
        // For blood pressure meter, use dictionary-based callbacks
        if (callbackType === "onPressureDataUpdate") {
          set_blood_pressure_data_event_callback(callback);
        } else if (callbackType === "onConnectionStateChange") {
          this.bloodPressureMonitorCallback.onConnectionStateChange = callback;
        }
      } else if (deviceType === "heartRateMonitor") {
        if (callbackType === "onHeartRateDataEvent") {
          set_heart_rate_monitor_data_event_callback(callback);
        } else if (callbackType === "onConnectionStateChange") {
          this.heartRateMonitorCallback.onConnectionStateChange = callback;
        } 
      } else if (deviceType === "jumpRope") {
        if (callbackType === "onJumpRopeDataEvent") {
          set_jump_rope_data_event_callback(callback);
        } else if (callbackType === "onConnectionStateChange") {
          this.jumpRopeCallback.onConnectionStateChange = callback;
        }
      } else if (deviceType === "scale") {
        if (callbackType === "onScaleDataEvent") {
          set_scale_data_event_callback(callback);
        }
      }
    }
  }

  stopPairing(deviceType) {
    this.isPairing = false;
    this.pairingType = "";
    this.onPairingStatusUpdate = null;

    wx.stopBluetoothDevicesDiscovery({
      success: () => {
        console.log("stopBluetoothDevicesDiscovery success");
      },
      fail: (err) => {
        console.log("stopBluetoothDevicesDiscovery failed", err);
      },
    });
  }

  pairDevice(deviceType, callback) {
    switch (deviceType) {
      case "thermometer":
        this.thermometerData.pairedDevice = null;
        this.thermometerData.state.isPairing = false;
        this.thermometerData.state.isPaired = false;
        wx.removeStorage({
          key: "pairedThermometer",
          success: (res) => {
            console.log("removeStorageSync success", res);
          },
          fail: (err) => {
            console.log("removeStorageSync failed", err);
          },
        });
        break;
      case "oximeter":
        this.oximeterData.pairedDevice = null;
        this.oximeterData.state.isPairing = false;
        this.oximeterData.state.isPaired = false;
        wx.removeStorage({
          key: "pairedOximeter",
          success: (res) => {
            console.log("removeStorageSync success", res);
          },
          fail: (err) => {
            console.log("removeStorageSync failed", err);
          },
        });
        break;
      case "bloodPressureMonitor":
        this.bloodPressureMonitorData.pairedDevice = null;
        this.bloodPressureMonitorData.state.isPairing = false;
        this.bloodPressureMonitorData.state.isPaired = false;
        wx.removeStorage({
          key: "pairedbloodPressureMonitor",
          success: (res) => {
            console.log("removeStorageSync success", res);
          },
          fail: (err) => {
            console.log("removeStorageSync failed", err);
          },
        });
        break;

      case "heartRateMonitor":
        this.heartRateMonitorData.pairedDevice = null;
        this.heartRateMonitorData.state.isPairing = false;
        this.heartRateMonitorData.state.isPaired = false;
        wx.removeStorage({
          key: "pairedHeartRateMonitor",
          success: (res) => {
            console.log("removeStorageSync success", res);
          },
          fail: (err) => {
            console.log("removeStorageSync failed", err);
          },
        });

        break;

      case "jumpRope":
        this.jumpRopeData.pairedDevice = null;
        this.jumpRopeData.state.isPairing = false;
        this.jumpRopeData.state.isPaired = false;
        wx.removeStorage({
          key: "pairedJumpRope",
          success: (res) => {
            console.log("removeStorageSync success", res);
          },
          fail: (err) => {
            console.log("removeStorageSync failed", err);
          },
        });
        break;

      case "scale":
        this.scaleData.pairedDevice = null;
        this.scaleData.state.isPairing = false;
        this.scaleData.state.isPaired = false;
        wx.removeStorage({
          key: "pairedScale",
          success: (res) => {
            console.log("removeStorageSync success", res);
          },
          fail: (err) => {
            console.log("removeStorageSync failed", err);
          },
        });
        break;
    }
    this.isPairing = true;
    this.pairingType = deviceType;
    this.onPairingStatusUpdate = callback;
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: () => {
        console.log("startBluetoothDevicesDiscovery success");
      },
      fail: (err) => callback?.(err),
    });
  }

  disconnectDevice(deviceType, callback) {
    const deviceId = this.getDeviceIdByDeviceType(deviceType);
    if (!deviceId || deviceId == "")
      return callback?.(new Error("No device connected"));
    wx.closeBLEConnection({
      deviceId: deviceId,
      success: () => {
        callback?.(null);
      },
      fail: (err) => callback?.(err),
    });
  }

  connectDevice(deviceType, onServiceReadyCabllback) {
    let device = (() => {
      switch (deviceType) {
        case "thermometer":
          return this.thermometerData.state.isPaired
            ? this.thermometerData.pairedDevice
            : null;
        case "oximeter":
          return this.oximeterData.state.isPaired
            ? this.oximeterData.pairedDevice
            : null;
        case "bloodPressureMonitor":
          return this.bloodPressureMonitorData.state.isPaired
            ? this.bloodPressureMonitorData.pairedDevice
            : null;
        case "heartRateMonitor":
          return this.heartRateMonitorData.state.isPaired
            ? this.heartRateMonitorData.pairedDevice
            : null;
        case "jumpRope":
          return this.jumpRopeData.state.isPaired
            ? this.jumpRopeData.pairedDevice
            : null;
        // case "scale":
        //   return this.scaleData.state.isPaired
        //     ? this.scaleData.pairedDevice
        //     : null;
        default:
          return null;
      }
    })();

    if (!device) {
      wx.showToast({
        title: `Please pair ${deviceType} first`,
        icon: "none",
      });
      return;
    }

    console.log("connecting device", device);

    wx.createBLEConnection({
      deviceId: device.deviceId,
      success: () => {
        // Trigger connection state callback for thermometer
        if (deviceType === "thermometer") {
          this.thermometerCallback?.onConnectionStateChange({
            connectionState: "connected",
          });
        }
        wx.getBLEDeviceServices({
          deviceId: device.deviceId,
          success: (serviceRes) => {
            serviceRes.services
              .filter((service) => service.isPrimary)
              .forEach((service) => {
                wx.getBLEDeviceCharacteristics({
                  deviceId: device.deviceId,
                  serviceId: service.uuid,
                  success: (charRes) => {
                    charRes.characteristics.forEach((char) => {
                      console.log(
                        `✅ Service: ${service.uuid}, Characteristic: ${char.uuid}, Properties: ${char.properties}`
                      );

                      if (
                        service.uuid == this.HEALTHKIT_UUID.SERVICE_UUID &&
                        char.uuid == this.HEALTHKIT_UUID.NOTIFY_CHAR_UUID
                      ) {
                        if (
                          char.properties.notify ||
                          char.properties.indicate
                        ) {
                          console.log(
                            `deviceid ${device.deviceId} serviceid: ${service.uuid} charid ${char.uuid}`
                          );

                          wx.notifyBLECharacteristicValueChange({
                            deviceId: device.deviceId,
                            serviceId: service.uuid,
                            characteristicId: char.uuid,
                            state: true,
                            success: () => {
                              onServiceReadyCabllback?.(null, char.uuid);
                              console.log(char.uuid);
                              // ✅ 自动发送查询系统信息（电量）
                              if (deviceType === "thermometer") {
                                setTimeout(() => {
                                  const command = new Uint8Array(
                                    // this.THERMOMETER_BATTERY_COMMAND
                                    get_thermometer_battery_command()
                                  ).buffer;
                                  wx.writeBLECharacteristicValue({
                                    deviceId: device.deviceId,
                                    serviceId: this.HEALTHKIT_UUID.SERVICE_UUID,
                                    characteristicId:
                                      this.HEALTHKIT_UUID.WRITE_CHAR_UUID,
                                    value: command,
                                    success: () =>
                                      console.log(
                                        "📤 Battery query command sent"
                                      ),
                                    fail: (err) =>
                                      console.error(
                                        "⚠️ Battery command send failed:",
                                        err
                                      ),
                                  });
                                }, 100); // 100ms延迟
                              }
                            },
                          });
                        }
                      } else if (
                        service.uuid == this.JUMP_ROPE_UUID.SERVICE_UUID &&
                        char.uuid == this.JUMP_ROPE_UUID.NOTIFY_CHAR_UUID
                      ) {
                        if (
                          char.properties.notify ||
                          char.properties.indicate
                        ) {
                          console.log(
                            `Jump rope deviceid ${device.deviceId} serviceid: ${service.uuid} charid ${char.uuid}`
                          );
                          wx.notifyBLECharacteristicValueChange({
                            deviceId: device.deviceId,
                            serviceId: service.uuid,
                            characteristicId: char.uuid,
                            state: true,
                            success: () => {
                              onServiceReadyCabllback?.(null, char.uuid);
                              console.log(char.uuid);
                            },
                          });
                        }
                      } else if (
                        service.uuid == this.HEART_RATE_UUID.SERVICE_UUID &&
                        char.uuid == this.HEART_RATE_UUID.NOTIFY_CHAR_UUID
                      ) {
                        if (
                          char.properties.notify ||
                          char.properties.indicate
                        ) {
                          console.log(
                            `Heart Rate Monitor deviceid ${device.deviceId} serviceid: ${service.uuid} charid ${char.uuid}`
                          );
                          wx.notifyBLECharacteristicValueChange({
                            deviceId: device.deviceId,
                            serviceId: service.uuid,
                            characteristicId: char.uuid,
                            state: true,
                            success: () => {
                              onServiceReadyCabllback?.(null, char.uuid);
                              console.log(char.uuid);
                            },
                          });
                        }
                      } else if (
                        service.uuid == this.BATTERY_UUID.SERVICE_UUID &&
                        char.uuid == this.BATTERY_UUID.NOTIFY_CHAR_UUID){
                        if (
                          char.properties.notify ||
                          char.properties.indicate
                        ) {
                          console.log(
                            `Battery Service deviceid ${device.deviceId} serviceid: ${service.uuid} charid ${char.uuid}`
                          );
                          //read battery characteristic
                          wx.readBLECharacteristicValue({
                            deviceId: device.deviceId,
                            serviceId: service.uuid,
                            characteristicId: char.uuid,
                            success: (res) => {
                              console.log(
                                `Battery read success:`,
                                res
                              );
                            },
                            fail: (err) => {
                              console.error(
                                `Battery read failed:`,
                                err
                              );
                            },
                          });
                          wx.notifyBLECharacteristicValueChange({
                            deviceId: device.deviceId,
                            serviceId: service.uuid,
                            characteristicId: char.uuid,
                            state: true,
                            success: () => {
                              onServiceReadyCabllback?.(null, char.uuid);
                              console.log(char.uuid);
                            },
                          });

                        }
                      }
                    });
                  },
                });
              });
          },
        });
      },
      fail: (err) => {
        // device.state.isConnectFailed = true;
        onServiceReadyCabllback?.(err);
      },
      complete: () => {
        // device.state.isConnecting = false;
      },
    });
  }

  startScanScaleDevices(callback) {
    this.isScanningScale = true;
    this.deviceType = "scale";
    this.isPairing = false;
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: () => {
        console.log("startBluetoothDevicesDiscovery for scale success");
        callback?.(null);
      },
      fail: (err) => {
        console.log("startBluetoothDevicesDiscovery for scale failed", err);
        callback?.(err);
      },
    });
  }

  stopScanScaleDevices(callback) {
    this.isScanningScale = false;
    this.deviceType = null;
    this.isPairing = false;
    wx.stopBluetoothDevicesDiscovery({
      success: () => {
        console.log("stopBluetoothDevicesDiscovery for scale success");
        callback?.(null);
      },
      fail: (err) => {
        console.log("stopBluetoothDevicesDiscovery for scale failed", err);
        callback?.(err);
      },
    }); 
  }



  // set jump rope mode command
  // mode: 0: free mode, 1: time mode, 2: count mode
  // setting: time in seconds or count
  sendJumpRopeModeCommand(mode, setting) {
    let device = this.jumpRopeData.pairedDevice;
    if (!device) {
      console.error("No jump rope device connected");
      return;
    }
    // check mode and setting validity should be number
    if (typeof mode !== "number" || typeof setting !== "number") {
      console.error("Invalid mode or setting");
      return;
    }

    const command = new Uint8Array(get_jump_rope_mode_command(mode, setting)).buffer;
    wx.writeBLECharacteristicValue({
      deviceId: device.deviceId,
      serviceId: this.JUMP_ROPE_UUID.SERVICE_UUID,
      characteristicId: this.JUMP_ROPE_UUID.WRITE_CHAR_UUID,
      value: command,
      success: () => console.log("Jump rope mode command sent"),
      fail: (err) =>
        console.error("⚠️ Jump rope mode command send failed:", err),
    });
  }

  sendJumpRopeStopCurrentModeCommand() {
    let device = this.jumpRopeData.pairedDevice;
    if (!device) {
      console.error("No jump rope device connected");
      return;
    }

    const command = new Uint8Array(get_jump_rope_stop_current_mode_command()).buffer;
    wx.writeBLECharacteristicValue({
      deviceId: device.deviceId,
      serviceId: this.JUMP_ROPE_UUID.SERVICE_UUID,
      characteristicId: this.JUMP_ROPE_UUID.WRITE_CHAR_UUID,
      value: command,
      success: () => console.log("Jump rope stop current mode command sent"),
      fail: (err) =>
        console.error("⚠️ Jump rope stop current mode command send failed:", err),
    });

  }

  checkAndGetLocation(success, fail) {
    const getLoc = () => {
      wx.getLocation({
        type: "wgs84",
        isHighAccuracy: true,
        highAccuracyExpireTime: 3000,
        success(res) {
          success && success(res);
        },
        fail(err) {
          if (
            err.errMsg === "getLocation:fail:system permission denied" ||
            err.errMsg == "getLocation:fail fail:require permission desc"
          ) {
            wx.showModal({
              title: "Notice",
              content:
                "Location access is required. Please enable location services (Precise Location) in system settings, otherwise some features may not work properly.",
              showCancel: false,
            });
          }
          fail && fail(err);
        },
      });
    };
    return getLoc();
  }
}

module.exports = new HealthKitBleManager(); // export a singleton
// export { HealthKitBleManager };
