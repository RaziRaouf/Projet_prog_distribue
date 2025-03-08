package com.civilevents.service;

import com.civilevents.dto.CitizenDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MarriageService {

    private final RestTemplate restTemplate;

    @Value("${citizen.service.url}")
    private String citizenServiceUrl;

    public MarriageService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void marry(Long citizenId1, Long citizenId2) {
        // Récupération des citoyens
        CitizenDto citizen1 = getCitizen(citizenId1);
        CitizenDto citizen2 = getCitizen(citizenId2);

        // Validation
        validateMarriage(citizen1, citizen2);

        // Mise à jour
        updateCitizen(citizenId1, "married", citizenId2);
        updateCitizen(citizenId2, "married", citizenId1);
    }

    private CitizenDto getCitizen(Long id) {
        String url = citizenServiceUrl + "/citizens/" + id;
        return restTemplate.getForObject(url, CitizenDto.class);
    }

    private void updateCitizen(Long id, String status, Long spouseId) {
        String url = citizenServiceUrl + "/citizens/" + id + "/status";

        CitizenDto updateRequest = new CitizenDto();
        updateRequest.setCivilStatus(status);
        updateRequest.setSpouseId(spouseId);

        restTemplate.put(url, updateRequest);
    }

    private void validateMarriage(CitizenDto c1, CitizenDto c2) {
        if (!"single".equalsIgnoreCase(c1.getCivilStatus())) {
            throw new IllegalArgumentException("Citizen " + c1.getId() + " n'est pas célibataire");
        }
        if (c1.getGender().equalsIgnoreCase(c2.getGender())) {
            throw new IllegalArgumentException("Même sexe interdit pour le mariage");
        }
    }

    public String getMaritalStatus(Long id) {
        CitizenDto citizen = getCitizen(id);
        return citizen.getCivilStatus();
    }
}
