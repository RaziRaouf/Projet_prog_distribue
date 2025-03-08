package com.civilevents.service;

import com.civilevents.client.CitizenClient;
import com.civilevents.dto.CitizenDto;
import com.civilevents.dto.CitizenUpdateRequest;
import org.springframework.stereotype.Service;

@Service
public class DivorceService {

    private final CitizenClient citizenClient;

    public DivorceService(CitizenClient citizenClient) {
        this.citizenClient = citizenClient;
    }

    public void divorce(Long citizenId) {
        CitizenDto citizen = citizenClient.getCitizen(citizenId);
        
        if (!"married".equalsIgnoreCase(citizen.getCivilStatus())) {
            throw new IllegalArgumentException("Citizen not married");
        }

        Long spouseId = citizen.getSpouseId();
        CitizenDto spouse = citizenClient.getCitizen(spouseId);

        updateCitizenStatus(citizenId);
        updateCitizenStatus(spouseId);
    }

    private void updateCitizenStatus(Long id) {
        CitizenUpdateRequest request = new CitizenUpdateRequest();
        request.setCivilStatus("single");
        request.setSpouseId(null);
        citizenClient.updateCitizenStatus(id, request);
    }
}