package com.example.UserService.clients;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserRequest {
    private String name;
    private String lastName;
    private String address;
    private String phone;
    private String username;
    private String email;
    private String password;
}
