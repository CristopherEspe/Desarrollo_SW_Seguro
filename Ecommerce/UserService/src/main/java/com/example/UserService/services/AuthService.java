package com.example.UserService.services;

import com.example.UserService.models.entities.dto.LoginDto;

public interface AuthService {
    String login(LoginDto loginDto);
}
