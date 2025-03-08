package com.civilevents.controller; // ❌ Package incorrect -> com.civilevents.controller

import com.civilevents.service.MarriageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/marriages")
public class MarriageController {

    private final MarriageService marriageService;

    public MarriageController(MarriageService marriageService) {
        this.marriageService = marriageService;
    }

    @PostMapping
    public ResponseEntity<String> marry(
            @RequestBody MarriageRequest request) {
        try {
            marriageService.marry(request.getCitizenId1(), request.getCitizenId2());
            return ResponseEntity.ok("Mariage enregistré");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Problème ici ⚠️
    private static class MarriageRequest {
        private Long citizenId1;
        private Long citizenId2;

        // ❌ Manque les setters
        public void setCitizenId1(Long citizenId1) {
            this.citizenId1 = citizenId1;
        }

        public void setCitizenId2(Long citizenId2) {
            this.citizenId2 = citizenId2;
        }

        public Long getCitizenId1() {
            return citizenId1;
        }

        public Long getCitizenId2() {
            return citizenId2;
        }
    }
}