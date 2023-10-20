/* MQTT Mutual Authentication Example */

#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>

#include "protocol_examples_common.h"
#include "nvs_flash.h"

#include "esp_wifi.h"
#include "esp_system.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "esp_log.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"

#include "mqtt_client.h"

#include "driver/gpio.h"

#include "lwip/err.h"
#include "lwip/sys.h"
#include "lwip/netdb.h"
#include "lwip/dns.h"

#include <bmp280.h>
#include <stdlib.h>


#define _XOPEN_SOURCE_EXTENDED 1
#define GPIO_OUT_0     2
#define GPIO_IN_0      0
#define GPIO_OUTPUT_PIN_SEL  ((1ULL<<GPIO_OUT_0))
#define GPIO_INPUT_PIN_SEL  ((1ULL<<GPIO_IN_0))
#define ESP_INTR_FLAG_DEFAULT 0
#define ON 1
#define OFF 0


// Set your local broker URI
#define BROKER_URI "mqtts://test.mosquitto.org:8884"

static const char *TAG = "MQTTS_EXAMPLE";
char substring[13];
char onoff[1];

void  read_temp_pres();
int string_compare(char str1[], char str2[] , int l2);

// cliente MQTT
esp_mqtt_client_handle_t cliente;

extern const uint8_t client_cert_pem_start[] asm("_binary_client_crt_start");
extern const uint8_t client_cert_pem_end[] asm("_binary_client_crt_end");
extern const uint8_t client_key_pem_start[] asm("_binary_client_key_start");
extern const uint8_t client_key_pem_end[] asm("_binary_client_key_end");
extern const uint8_t server_cert_pem_start[] asm("_binary_broker_CA_crt_start");
extern const uint8_t server_cert_pem_end[] asm("_binary_broker_CA_crt_end");

static void log_error_if_nonzero(const char *message, int error_code)
{
    if (error_code != 0) {
        ESP_LOGE(TAG, "Last error %s: 0x%x", message, error_code);
    }
}

char *topic_time  = "medicion/timestamp";
char *topic_onoff = "edificio/1/depto/1/onoff";
char *topic_force = "edificio/1/depto/1/force";

char *topicAny = "edificio/1/depto/1/#";
char *topicBtn = "edificio/1/depto/1/button";
char *topicTmp = "edificio/1/depto/1/temperatura";
char *topicPre = "edificio/1/depto/1/presion";

bool forceRead = false;

static char *MQTT_MSJ_1 = "{\"device_id\":1, \"timestamp\":%s";
static char *MQTT_MSJ_T = ", \"value\":%0.2f, \"type\":1 ,\"meassure\":\"T\"}";
static char *MQTT_MSJ_P = ", \"value\":%0.2f, \"type\":1 ,\"meassure\":\"P\"}";

/*
 * @brief Event handler registered to receive MQTT events
 *
 *  This function is called by the MQTT client event loop.
 *
 * @param handler_args user data registered to the event.
 * @param base Event base for the handler(always MQTT Base in this example).
 * @param event_id The id for the received event.
 * @param event_data The data for the event, esp_mqtt_event_handle_t.
 */
static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%ld", base, event_id);
    esp_mqtt_event_handle_t event = event_data;
    esp_mqtt_client_handle_t client = event->client;
    int msg_id;

    switch ((esp_mqtt_event_id_t)event_id) {
    case MQTT_EVENT_CONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");

        msg_id = esp_mqtt_client_subscribe(client, topic_force, 0);
        ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);
        msg_id = esp_mqtt_client_subscribe(client, topic_onoff, 0);
        ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);

        msg_id = esp_mqtt_client_subscribe(client, topic_time, 0);
        ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);

        break;
    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED"); 
        break;

    case MQTT_EVENT_SUBSCRIBED:
        break;

    case MQTT_EVENT_UNSUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
        break;

    case MQTT_EVENT_PUBLISHED:
        ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
        break;

    case MQTT_EVENT_DATA:
        ESP_LOGI(TAG, "MQTT_EVENT_DATA");
        printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
        printf("DATA=%.*s\r\n", event->data_len, event->data);

        int comp = string_compare(topic_time, event->topic, event->topic_len); 
        ESP_LOGI(TAG, "timestamp=%d", comp);
        if(comp == 0 ){
            printf("Guardar el timestamp \r\n");
            printf("DATA=%.*s\r\n", event->data_len, event->data);
           
            strncpy(substring,event->data+9,13);
            printf("DATA=%.*s\r\n", 13, substring);
            break;
        }

        comp = string_compare(topic_force, event->topic, event->topic_len); 
        ESP_LOGI(TAG, "forzar lectura=%d", comp);
        if(comp == 0 ){
            printf("Forzar una lectura \r\n");
            forceRead = true;
            break;
        }

        comp = string_compare(topic_onoff, event->topic, event->topic_len); 
        
        ESP_LOGI(TAG, "onoff topic on off=%d", comp);
        if(comp == 0 ){
            printf("Encender/apagar el led \r\n");
            printf("DATA=%.*s\r\n", event->data_len, event->data);
           
            strncpy(onoff,event->data+9,1);
            printf("DATA=%.*s\r\n", 1, onoff);

            int i; 
            sscanf(onoff, "%d", &i);
            if(i == 1){
                printf("ONN\r\n");
                gpio_set_level(GPIO_OUT_0, ON);
                break;
            } else if(i == 0){
                printf("OFF\r\n");
                gpio_set_level(GPIO_OUT_0, OFF);
                break;
            }
            printf("nada\r\n");
            break;
        }
        break;
    case MQTT_EVENT_ERROR:
        ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
        if (event->error_handle->error_type == MQTT_ERROR_TYPE_TCP_TRANSPORT) {
            log_error_if_nonzero("reported from esp-tls", event->error_handle->esp_tls_last_esp_err);
            log_error_if_nonzero("reported from tls stack", event->error_handle->esp_tls_stack_err);
            log_error_if_nonzero("captured as transport's socket errno",  event->error_handle->esp_transport_sock_errno);
            ESP_LOGI(TAG, "Last errno string (%s)", strerror(event->error_handle->esp_transport_sock_errno));
        }
        break;
    default:
        ESP_LOGI(TAG, "Other event id:%d", event->event_id);
        printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
        printf("DATA=%.*s\r\n", event->data_len, event->data);
        break;
    }
}

static void mqtt_app_start(void)
{
    const esp_mqtt_client_config_t mqtt_cfg = {
        .broker.address.uri = BROKER_URI,
        .broker.verification.certificate = (const char *)server_cert_pem_start,
        .credentials.authentication.certificate = (const char *)client_cert_pem_start,
        .credentials.authentication.key = (const char *)client_key_pem_start,
    };

    ESP_LOGI(TAG, "[APP] Free memory: %ld bytes", esp_get_free_heap_size());
    esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
    /* The last argument may be used to pass data to the event handler, in this example mqtt_event_handler */
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);
    esp_mqtt_client_start(client);
        
    //Sensor BMP
    bmp280_params_t params;
    bmp280_init_default_params(&params);
    bmp280_t dev;
    memset(&dev, 0, sizeof(bmp280_t));
    i2cdev_init();  
    vTaskDelay(500);
    ESP_ERROR_CHECK(bmp280_init_desc(&dev, BMP280_I2C_ADDRESS_0, 0, 21, 22));//sda 21 scl 22
    ESP_ERROR_CHECK(bmp280_init(&dev, &params));
    bool bme280p = dev.id == BME280_CHIP_ID;
    ESP_LOGI(TAG, "BMP280: found %s\n", bme280p ? "BME280" : "BMP280");

    int count = 0;

    while(1) {
        vTaskDelay(20);
        count++;
        if (gpio_get_level(GPIO_IN_0) == 0) {
           
            char c1[200]="";
            strcat(c1, "{\"device_id\":");
            strcat(c1, "1");
            strcat(c1, ", \"timestamp\":");
            strcat(c1, substring);
            strcat(c1, ", \"value\":");
            strcat(c1, "1,");
            strcat(c1, "\"type\":1 ,\"meassure\":\"X\"}");

            printf("DATA=%.*s\r\n", 200, c1);

            printf("Button pressed\n");
            int msg_id = esp_mqtt_client_publish(client, topicBtn, c1 , 0, 0, 0);
            ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);  
        } 

        if(count > 180 || forceRead){
            float pressure, temperature, humidity;
            if (bmp280_read_float(&dev, &temperature, &pressure, &humidity) != ESP_OK) {
                ESP_LOGI(TAG, "Temperature/pressure reading failed\n");
                continue;
            } else {
                ESP_LOGI(TAG, "Pressure: %.2f Pa, Temperature: %.2f C", pressure, temperature);
                ESP_LOGI(TAG,", Humidity: %.2f\n", humidity);
            } 


            char send_buf1[150];
            sprintf(send_buf1, MQTT_MSJ_1, substring );
            char send_buf2[150];
            sprintf(send_buf2, MQTT_MSJ_T, temperature );
            
            char t1[300]="";
            strcat(t1,send_buf1);
            strcat(t1,send_buf2);
            
            esp_mqtt_client_publish(client, topicTmp, t1 , 0, 0, 0);

            char send_buf3[150];
            sprintf(send_buf3, MQTT_MSJ_1, substring );
            char send_buf4[150];
            sprintf(send_buf4, MQTT_MSJ_P, pressure );
            
            char p1[300]="";
            strcat(p1,send_buf3);
            strcat(p1,send_buf4);
            
            esp_mqtt_client_publish(client, topicPre, p1 , 0, 0, 0);
            
            if(!forceRead){
                count = 0;   
            }

            forceRead = false;
        }
    }
}

int string_compare(char str1[], char str2[], int l2)
{
    int ctr=0;
    int l1 = strlen(str1);

    if(l1!=l2){
        return -1;
    }

    while(ctr < l2)
    {
        if(str1[ctr]==str2[ctr]){
            //Mientras sean iguales sigo
        } else {
            return -1;
        }
        ctr++;
    }

    return 0;
}

void app_main(void){
 // GPIO OUTPUTS CONFIG
    //zero-initialize the config structure.
    gpio_config_t out_conf = {};
    //disable interrupt
    out_conf.intr_type = GPIO_INTR_DISABLE;
    //set as output mode
    out_conf.mode = GPIO_MODE_OUTPUT;
    //bit mask of the pins that you want to set,e.g.GPIO18/19
    out_conf.pin_bit_mask = GPIO_OUTPUT_PIN_SEL;
    //disable pull-down mode
    out_conf.pull_down_en = 0;
    //disable pull-up mode
    out_conf.pull_up_en = 0;
    //configure GPIO with the given settings
    gpio_config(&out_conf);

    // GPIO INPUTS CONFIG
    //zero-initialize the config structure.
    gpio_config_t in_conf = {};
    //disable interrupt
    in_conf.intr_type = GPIO_INTR_DISABLE;
    //set as output mode
    in_conf.mode = GPIO_MODE_INPUT;
    //bit mask of the pins that you want to set,e.g.GPIO18/19
    in_conf.pin_bit_mask = GPIO_INPUT_PIN_SEL;
    //disable pull-down mode
    in_conf.pull_down_en = 0;
    //enable pull-up mode
    in_conf.pull_up_en = 1;
    //configure GPIO with the given settings
    gpio_config(&in_conf);

    ESP_LOGI(TAG, "[APP] Startup..");
    ESP_LOGI(TAG, "[APP] Free memory: %ld bytes", esp_get_free_heap_size());
    ESP_LOGI(TAG, "[APP] IDF version: %s", esp_get_idf_version());

    esp_log_level_set("*", ESP_LOG_INFO);
    esp_log_level_set("MQTT_CLIENT", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT_BASE", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT", ESP_LOG_VERBOSE);
    esp_log_level_set("OUTBOX", ESP_LOG_VERBOSE);

    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());


    /* This helper function configures Wi-Fi or Ethernet, as selected in menuconfig.
     * Read "Establishing Wi-Fi or Ethernet Connection" section in
     * examples/protocols/README.md for more information about this function.
     */
    ESP_ERROR_CHECK(example_connect());
    mqtt_app_start(); 
}