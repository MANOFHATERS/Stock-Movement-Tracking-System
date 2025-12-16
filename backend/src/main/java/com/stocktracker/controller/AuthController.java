package com.stocktracker.controller;

import com.stocktracker.model.User;
import com.stocktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {
    
    private final UserRepository userRepository;
    
    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("authenticated", true);
        userInfo.put("name", principal.getAttribute("name"));
        userInfo.put("email", principal.getAttribute("email"));
        userInfo.put("avatar", principal.getAttribute("avatar_url") != null 
                ? principal.getAttribute("avatar_url") 
                : principal.getAttribute("picture"));
        
        return ResponseEntity.ok(userInfo);
    }
    
    @GetMapping("/login/success")
    public ResponseEntity<?> loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not authenticated"));
        }
        
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String avatarUrl = principal.getAttribute("avatar_url") != null 
                ? principal.getAttribute("avatar_url") 
                : principal.getAttribute("picture");
        
        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .name(name)
                            .avatarUrl(avatarUrl)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return userRepository.save(newUser);
                });
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", user
        ));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
