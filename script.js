const stepElem = document.getElementById("steps");
const distanceElem = document.getElementById("distance");
const energyElem = document.getElementById("energy");

document.getElementById("connectBtn").addEventListener("click", async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'ELECTRASTEP' }],
      optionalServices: ['12345678-1234-5678-1234-56789abcdef0'] // Your service UUID
    });

    const server = await device.gatt.connect();
    console.log('Connected to:', device.name);

    const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
    const stepChar = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef1');
    const distanceChar = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef2');
    const energyChar = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef3');

    async function readData() {
      const stepVal = await stepChar.readValue();
      const distanceVal = await distanceChar.readValue();
      const energyVal = await energyChar.readValue();

      stepElem.textContent = stepVal.getUint16(0);
      distanceElem.textContent = (distanceVal.getFloat32(0) / 1000).toFixed(2);
      energyElem.textContent = energyVal.getFloat32(0).toFixed(2);
    }

    setInterval(readData, 2000);

  } catch (error) {
    console.error('Connection failed:', error);
    alert('Could not connect to ElectraStep. Make sure it is powered on!');
  }
});
