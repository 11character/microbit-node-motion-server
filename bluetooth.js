const noble = require('noble');

const UART_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e';
const UART_RX_CHARACTERISTIC_UUID = '6e400002b5a3f393e0a9e50e24dcca9e';
// const UART_TX_CHARACTERISTIC_UUID = '6e400003b5a3f393e0a9e50e24dcca9e';

noble.startScanning();

noble.on('discover', (peripheral) => {
    const zeroValue = '0,0,0,0,0';
    const name = peripheral.advertisement.localName;

    if (name && name.indexOf('micro:bit') > -1) {
        noble.stopScanning();

        // 끊김시 종료.
        peripheral.on('disconnect', () => {
            console.log(zeroValue);
            process.exit();
        });

        // 연결.
        peripheral.connect(() => {
            console.log(zeroValue);

            // 데이터를 받는 분분 검색, 구독.
            peripheral.discoverSomeServicesAndCharacteristics(
                [UART_SERVICE_UUID], // 서비스 ID
                [UART_RX_CHARACTERISTIC_UUID], // 수신기능 ID
                (error, services, characteristics) => {
                    characteristic = characteristics[0];

                    // 수신하는 부분에 값이 들어오면 실행되는 이벤트.
                    characteristic.on('data', (data) => {
                        console.log(data.toString());
                    });

                    // 이벤트 실행을 감지할 수 있도록 구독.
                    characteristic.subscribe((error) => {
                        console.log(zeroValue);
                    });
                }
            );
        });
    }
});

