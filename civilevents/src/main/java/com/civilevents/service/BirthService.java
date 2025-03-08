package com.civilevents.service;

import com.civilevents.client.CitizenClient;
import com.civilevents.dto.CitizenDto;
import org.springframework.stereotype.Service;

@Service
public class BirthService {

    private final CitizenClient citizenClient;

    public BirthService(CitizenClient citizenClient) {
        this.citizenClient = citizenClient;
    }

    public void registerBirth(String firstName, String gender, Long parentId1, Long parentId2) {
        CitizenDto parentA = citizenClient.getCitizen(parentId1);
        CitizenDto parentB = citizenClient.getCitizen(parentId2);

        validateParents(parentA, parentB);

        CitizenDto child = new CitizenDto();
        child.setFirstName(firstName);
        child.setLastName(getLastName(parentA, parentB));
        child.setGender(gender);
        child.setCivilStatus("single");

        citizenClient.createCitizen(child);
    }

    private void validateParents(CitizenDto p1, CitizenDto p2) {
        if (p1.getGender().equalsIgnoreCase(p2.getGender())) {
            throw new IllegalArgumentException("Parents must have different genders");
        }
        if (!p1.getSpouseId().equals(p2.getId()) || !p2.getSpouseId().equals(p1.getId())) {
            throw new IllegalArgumentException("Parents not married");
        }
    }

    private String getLastName(CitizenDto p1, CitizenDto p2) {
        return "male".equalsIgnoreCase(p1.getGender()) ? p1.getLastName() : p2.getLastName();
    }
}