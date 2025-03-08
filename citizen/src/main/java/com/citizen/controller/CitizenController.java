package com.citizen.controller;

import com.citizen.model.Citizen;
import com.citizen.service.CitizenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/citizens")
public class CitizenController {

    private final CitizenService citizenService;

    @Autowired
    public CitizenController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }

    @GetMapping
    public ResponseEntity<?> getCitizens(
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String query) {

        if (searchType == null || query == null) {
            List<Citizen> citizens = citizenService.getAllCitizens();
            return citizens.isEmpty()
                    ? ResponseEntity.noContent().build()
                    : ResponseEntity.ok(citizens);
        }

        switch (searchType.toLowerCase()) {
            case "id":
                try {
                    Long id = Long.parseLong(query);
                    Optional<Citizen> citizen = citizenService.getCitizenById(id);
                    return citizen.map(ResponseEntity::ok)
                            .orElseGet(() -> ResponseEntity.notFound().build());
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Invalid ID format.");
                }

            case "lastname":
                List<Citizen> citizensByLastName = citizenService.getCitizensByLastName(query);
                return citizensByLastName.isEmpty()
                        ? ResponseEntity.noContent().build()
                        : ResponseEntity.ok(citizensByLastName);

            default:
                return ResponseEntity.badRequest().body("Invalid search type.");
        }
    }

    @PostMapping
    public ResponseEntity<Citizen> createCitizen(@RequestBody Citizen citizen) {
        return new ResponseEntity<>(citizenService.createCitizen(citizen), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Citizen> getCitizenById(@PathVariable Long id) {
        return citizenService.getCitizenById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Citizen> updateCitizen(@PathVariable Long id, @RequestBody Citizen updatedCitizen) {
        return citizenService.updateCitizen(id, updatedCitizen)
                .map(citizen -> new ResponseEntity<>(citizen, HttpStatus.OK))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCitizen(@PathVariable Long id) {
        Optional<Citizen> citizen = citizenService.getCitizenById(id);
        if (citizen.isPresent()) {
            citizenService.deleteCitizen(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}