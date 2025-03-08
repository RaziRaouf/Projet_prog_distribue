package com.civilevents.controller;

import com.civilevents.service.BirthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/births")
public class BirthController {

    private final BirthService birthService;

    public BirthController(BirthService birthService) {
        this.birthService = birthService;
    }

    @PostMapping
    public ResponseEntity<String> registerBirth(@RequestBody BirthRequest request) {
        try {
            birthService.registerBirth(
                    request.getFirstName(),
                    request.getGender(),
                    request.getParentId1(),
                    request.getParentId2());
            return ResponseEntity.ok("Birth registered");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class BirthRequest {
        private String firstName;
        private String gender;
        private Long parentId1;
        private Long parentId2;

        public String getFirstName() {
            return firstName;
        }

        public String getGender() {
            return gender;
        }

        public Long getParentId1() {
            return parentId1;
        }

        public Long getParentId2() {
            return parentId2;
        }
    }
}
