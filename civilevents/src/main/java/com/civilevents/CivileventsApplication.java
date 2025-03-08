package com.civilevents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class CivileventsApplication {
    public static void main(String[] args) {
        SpringApplication.run(CivileventsApplication.class, args);
    }
}
