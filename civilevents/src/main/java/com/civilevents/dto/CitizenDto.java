package com.civilevents.dto;


import lombok.Data;
import java.time.LocalDate;

@Data
public class CitizenDto {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String civilStatus;
    private Long spouseId;
}
