package com.civilevents.client;

import com.civilevents.dto.CitizenDto;
import com.civilevents.dto.CitizenUpdateRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "citizen-service", url = "${citizen.service.url}")
public interface CitizenClient {

    @GetMapping("/citizens/{id}")
    CitizenDto getCitizen(@PathVariable Long id);

    @PutMapping("/citizens/{id}") 
    void updateCitizenStatus(@PathVariable Long id, @RequestBody CitizenUpdateRequest request);

    @PostMapping("/citizens")
    CitizenDto createCitizen(@RequestBody CitizenDto citizen);
}