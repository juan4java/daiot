# ESP-32 

Se usa el ESP32 conectandose al broker Mosquitto utilizando TLS

## Configuracion SSID y PASS WiFi

Este ejemplo usa la funcion "example_connect()" de la platarforma ESP-IDF.

Para configurar el SSID y PASSWORD se debe hacer clic en el icono "engranaje" (configuración)
de la barra inferior del VSCode y allí en la sección de WiFi se podrán configurar los datos
necesarios

## Configurar URI del Broker

Dentro del archivo app_main.c hay que configurar la definición "BROKER_URI" que se encuentra
al inicio del archivo, colocando los datos correctos del broker a utilizar.

## Configurar certificados:

En los archivos client.crt, client.key y broker_CA.crt, hay que pegar el contenido
de los certificados que se crean en test.mosquitto.org

### Ejemplo de la salida por consola al ejecutar la aplicación:

```
rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)
configsip: 0, SPIWP:0xee
clk_drv:0x00,q_drv:0x00,d_drv:0x00,cs0_drv:0x00,hd_drv:0x00,wp_drv:0x00
mode:DIO, clock div:2
load:0x3fff0030,len:7096
load:0x40078000,len:15584
load:0x40080400,len:4
0x40080400: _init at ??:?

ho 8 tail 4 room 4
load:0x40080404,len:3876
entry 0x4008064c
I (30) boot: ESP-IDF v5.1.1-393-g7698a413bc 2nd stage bootloader
I (30) boot: compile time Oct 16 2023 20:35:43
I (32) boot: Multicore bootloader
I (36) boot: chip revision: v1.0
I (40) boot.esp32: SPI Speed      : 40MHz
I (44) boot.esp32: SPI Mode       : DIO
I (49) boot.esp32: SPI Flash Size : 2MB
I (53) boot: Enabling RNG early entropy source...
I (59) boot: Partition Table:
I (62) boot: ## Label            Usage          Type ST Offset   Length
I (70) boot:  0 nvs              WiFi data        01 02 00009000 00006000
I (77) boot:  1 phy_init         RF data          01 01 0000f000 00001000
I (85) boot:  2 factory          factory app      00 00 00010000 00100000
I (92) boot: End of partition table
I (96) esp_image: segment 0: paddr=00010020 vaddr=3f400020 size=29018h (167960) map
I (165) esp_image: segment 1: paddr=00039040 vaddr=3ffb0000 size=03844h ( 14404) load
I (171) esp_image: segment 2: paddr=0003c88c vaddr=40080000 size=0378ch ( 14220) load
I (178) esp_image: segment 3: paddr=00040020 vaddr=400d0020 size=a247ch (664700) map
I (420) esp_image: segment 4: paddr=000e24a4 vaddr=4008378c size=13744h ( 79684) load
I (464) boot: Loaded app from partition at offset 0x10000
I (464) boot: Disabling RNG early entropy source...
I (476) cpu_start: Multicore app
I (476) cpu_start: Pro cpu up.
I (476) cpu_start: Starting app cpu, entry point is 0x4008148c
0x4008148c: call_start_cpu1 at C:/Users/juanc/esp-51/esp-idf/components/esp_system/port/cpu_start.c:154

I (0) cpu_start: App cpu up.
I (494) cpu_start: Pro cpu start user code
I (494) cpu_start: cpu freq: 160000000 Hz
I (494) cpu_start: Application information:
I (499) cpu_start: Project name:     mqtt_ssl_mutual_auth
I (505) cpu_start: App version:      86166d8-dirty
I (511) cpu_start: Compile time:     Oct 16 2023 20:34:46
I (517) cpu_start: ELF file SHA256:  dbdfd84613ecdee7...
I (523) cpu_start: ESP-IDF:          v5.1.1-393-g7698a413bc
I (529) cpu_start: Min chip rev:     v0.0
I (534) cpu_start: Max chip rev:     v3.99
I (538) cpu_start: Chip rev:         v1.0
I (543) heap_init: Initializing. RAM available for dynamic allocation:
I (551) heap_init: At 3FFAE6E0 len 00001920 (6 KiB): DRAM
I (556) heap_init: At 3FFB7F18 len 000280E8 (160 KiB): DRAM
I (563) heap_init: At 3FFE0440 len 00003AE0 (14 KiB): D/IRAM
I (569) heap_init: At 3FFE4350 len 0001BCB0 (111 KiB): D/IRAM
I (575) heap_init: At 40096ED0 len 00009130 (36 KiB): IRAM
I (583) spi_flash: detected chip: generic
I (586) spi_flash: flash io: dio
W (590) spi_flash: Detected size(4096k) larger than the size in the binary image header(2048k). Using the size in the binary image header.
I (604) app_start: Starting scheduler on CPU0
I (608) app_start: Starting scheduler on CPU1
I (608) main_task: Started on CPU0
I (618) main_task: Calling app_main()
I (618) gpio: GPIO[2]| InputEn: 0| OutputEn: 1| OpenDrain: 0| Pullup: 0| Pulldown: 0| Intr:0 
I (628) gpio: GPIO[0]| InputEn: 1| OutputEn: 0| OpenDrain: 0| Pullup: 1| Pulldown: 0| Intr:0
I (638) MQTTS_EXAMPLE: [APP] Startup..
I (638) MQTTS_EXAMPLE: [APP] Free memory: 279096 bytes
I (648) MQTTS_EXAMPLE: [APP] IDF version: v5.1.1-393-g7698a413bc
I (698) example_connect: Start example_connect.
I (708) wifi:wifi driver task: 3ffbfb70, prio:23, stack:6656, core=0
I (728) wifi:wifi firmware version: ce9244d
I (728) wifi:wifi certification version: v7.0
I (728) wifi:config NVS flash: enabled
I (728) wifi:config nano formating: disabled
I (738) wifi:Init data frame dynamic rx buffer num: 32
I (738) wifi:Init management frame dynamic rx buffer num: 32
I (748) wifi:Init management short buffer num: 32
I (748) wifi:Init dynamic tx buffer num: 32
I (748) wifi:Init static rx buffer size: 1600
I (758) wifi:Init static rx buffer num: 10
I (758) wifi:Init dynamic rx buffer num: 32
I (768) wifi_init: rx ba win: 6
I (768) wifi_init: tcpip mbox: 32
I (768) wifi_init: udp mbox: 6
I (778) wifi_init: tcp mbox: 6
I (778) wifi_init: tcp tx win: 5744
I (778) wifi_init: tcp rx win: 5744
I (788) wifi_init: tcp mss: 1440
I (788) wifi_init: WiFi IRAM OP enabled
I (798) wifi_init: WiFi RX IRAM OP enabled
I (798) phy_init: phy_version 4771,450c73b,Aug 16 2023,11:03:10
I (898) wifi:mode : sta (0c:dc:7e:61:71:a4)
I (898) wifi:enable tsf
I (898) example_connect: Connecting to NoPasaran...
I (898) example_connect: Waiting for IP(s)
I (3318) wifi:new:<11,0>, old:<1,0>, ap:<255,255>, sta:<11,0>, prof:8
I (5448) wifi:state: init -> auth (b0)
I (6448) wifi:state: auth -> init (200)
I (6448) wifi:new:<11,0>, old:<11,0>, ap:<255,255>, sta:<11,0>, prof:8
I (6448) example_connect: Wi-Fi disconnected, trying to reconnect...
I (8868) example_connect: Wi-Fi disconnected, trying to reconnect...
I (11278) wifi:new:<11,0>, old:<11,0>, ap:<255,255>, sta:<11,0>, prof:8
I (11288) wifi:state: init -> auth (b0)
I (12198) wifi:state: auth -> assoc (0)
I (17478) wifi:state: assoc -> assoc (0)
I (17488) wifi:state: assoc -> run (10)
I (17538) wifi:connected with xxxxxx, aid = 1, channel 11, BW20, bssid = ec:be:dd:ba:d1:8d
I (17538) wifi:security: WPA2-PSK, phy: bgn, rssi: -70
I (17538) wifi:pm start, type: 1

I (17598) wifi:<ba-add>idx:0 (ifx:0, ec:be:dd:ba:d1:8d), tid:0, ssn:537, winSize:64
I (17628) wifi:AP's beacon interval = 102400 us, DTIM period = 1
I (18548) esp_netif_handlers: example_netif_sta ip: 192.168.0.46, mask: 255.255.255.0, gw: 192.168.0.1
I (18548) example_connect: Got IPv4 event: Interface "example_netif_sta" address: 192.168.0.46
I (18698) example_connect: Got IPv6 event: Interface "example_netif_sta" address: fe80:0000:0000:0000:0edc:7eff:fe61:71a4, type: ESP_IP6_ADDR_IS_LINK_LOCAL
I (18698) example_common: Connected to example_netif_sta
I (18708) example_common: - IPv4 address: 192.168.0.46,
I (18708) example_common: - IPv6 address: fe80:0000:0000:0000:0edc:7eff:fe61:71a4, type: ESP_IP6_ADDR_IS_LINK_LOCAL
I (18728) MQTTS_EXAMPLE: [APP] Free memory: 234060 bytes
I (18728) MQTTS_EXAMPLE: Other event id:7
TOPIC=
DATA=
I (22038) MQTTS_EXAMPLE: MQTT_EVENT_CONNECTED
I (22048) MQTTS_EXAMPLE: sent subscribe successful, msg_id=56253
I (22048) MQTTS_EXAMPLE: sent subscribe successful, msg_id=37770
I (23578) MQTTS_EXAMPLE: MQTT_EVENT_DATA
TOPIC=medicion/timestamp
DATA={"valor":1697686522298}
Guardar el timestamp
DATA={"valor":1697686522298}
DATA=1697686522298
I (23738) MQTTS_EXAMPLE: BMP280: found BMP280
```

