import CoreAudio

// Tiny CLI that prints "1" if the default input device (microphone)
// is currently in use by any app on macOS, otherwise prints "0".

let systemObjectID = AudioObjectID(kAudioObjectSystemObject)

var defaultDeviceID = AudioDeviceID(0)
var defaultDeviceIDSize = UInt32(MemoryLayout<AudioDeviceID>.size)
var defaultDeviceAddress = AudioObjectPropertyAddress(
    mSelector: kAudioHardwarePropertyDefaultInputDevice,
    mScope: kAudioObjectPropertyScopeGlobal,
    mElement: kAudioObjectPropertyElementMain
)

var status = AudioObjectGetPropertyData(
    systemObjectID,
    &defaultDeviceAddress,
    0,
    nil,
    &defaultDeviceIDSize,
    &defaultDeviceID
)

if status != noErr || defaultDeviceID == 0 {
    print("0")
    exit(0)
}

var isRunningValue: UInt32 = 0
var isRunningSize = UInt32(MemoryLayout<UInt32>.size)
var isRunningAddress = AudioObjectPropertyAddress(
    mSelector: kAudioDevicePropertyDeviceIsRunningSomewhere,
    mScope: kAudioObjectPropertyScopeGlobal,
    mElement: kAudioObjectPropertyElementMain
)

status = AudioObjectGetPropertyData(
    defaultDeviceID,
    &isRunningAddress,
    0,
    nil,
    &isRunningSize,
    &isRunningValue
)

if status != noErr {
    print("0")
    exit(0)
}

print(isRunningValue != 0 ? "1" : "0")

