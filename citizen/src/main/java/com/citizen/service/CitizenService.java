package com.citizen.service;

import com.citizen.model.Citizen;
import com.citizen.repository.CitizenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional

public class CitizenService {

    private final CitizenRepository citizenRepository;

    @Autowired
    public CitizenService(CitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
    }

    // Méthodes métier
    public List<Citizen> getAllCitizens() {
        return citizenRepository.findAll();
    }

    public Optional<Citizen> getCitizenById(Long id) {
        return citizenRepository.findById(id);
    }

    public List<Citizen> getCitizensByLastName(String lastName) {
        return citizenRepository.findByLastNameIgnoreCase(lastName);
    }

    public Citizen createCitizen(Citizen citizen) {
        return citizenRepository.save(citizen);
    }

    public Optional<Citizen> updateCitizen(Long id, Citizen updatedCitizen) {
        return citizenRepository.findById(id).map(citizen -> {
            citizen.setFirstName(updatedCitizen.getFirstName());
            citizen.setLastName(updatedCitizen.getLastName());
            citizen.setDateOfBirth(updatedCitizen.getDateOfBirth());
            citizen.setGender(updatedCitizen.getGender());
            citizen.setCivilStatus(updatedCitizen.getCivilStatus());
            citizen.setSpouseId(updatedCitizen.getSpouseId());
            return citizenRepository.save(citizen);
        });
    }

    public void deleteCitizen(Long id) {
        citizenRepository.deleteById(id);
    }
}