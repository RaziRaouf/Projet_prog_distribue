package com.civilevents.controller;

import com.civilevents.service.DivorceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/divorces")
public class DivorceController {

    private final DivorceService divorceService;

    public DivorceController(DivorceService divorceService) {
        this.divorceService = divorceService;
    }

    @PostMapping
    public ResponseEntity<String> divorce(@RequestBody DivorceRequest request) {
        try {
            divorceService.divorce(request.getCitizenId());
            return ResponseEntity.ok("Divorce processed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class DivorceRequest {
        private Long citizenId;
        public Long getCitizenId() {
            return citizenId;
        }
    }
}