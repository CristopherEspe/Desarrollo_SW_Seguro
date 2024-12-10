package com.example.UserService.services.Impl;

import com.example.UserService.models.entities.User;
import com.example.UserService.models.entities.dto.LoginDto;
import com.example.UserService.repositories.UserRepository;
import com.example.UserService.services.AuthService;
import com.example.UserService.services.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;

    private UserRepository userRepository;

    private final JwtService jwtService;

    @Override
    public String login(LoginDto loginDto) {
        String username = loginDto.getUsernameOrEmail();
        String password = loginDto.getPassword();
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(username, password));

        User user = (User) authentication.getPrincipal();

        Map<String, Object> claims = Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "id", user.getId(),
                "role", user.getRole().getName()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

//        String token = jwtTokenProvider.generateToken(authentication);
        String token = jwtService.generateToken(claims, user);

        return token;
    }
}