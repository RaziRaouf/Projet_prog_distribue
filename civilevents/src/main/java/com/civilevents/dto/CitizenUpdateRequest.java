package com.civilevents.dto;

import lombok.Data;

@Data
public class CitizenUpdateRequest {
    private String civilStatus;
    private Long spouseId;
}