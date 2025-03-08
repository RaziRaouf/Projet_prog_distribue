package com.citizen.controller; // ❌ Package incorrect -> com.citizen.controller

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontEndController {

    @GetMapping({ "/marriages-page", "/divorces-page", "/births-page" })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}