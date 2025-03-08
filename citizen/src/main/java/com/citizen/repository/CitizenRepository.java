package com.citizen.repository;


import com.citizen.model.Citizen;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CitizenRepository extends JpaRepository<Citizen, Long> {

    List<Citizen> findByLastNameIgnoreCase(String lastName);
}
