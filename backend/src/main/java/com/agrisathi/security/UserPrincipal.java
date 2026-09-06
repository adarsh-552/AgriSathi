package com.agrisathi.security;

import com.agrisathi.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String identifier; // mobile or email
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String identifier, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.identifier = identifier;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        String principalId = user.getMobileNumber() != null ? user.getMobileNumber() : user.getEmail();
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole()));
        return new UserPrincipal(user.getId(), principalId, user.getPasswordHash(), authorities);
    }

    public Long getId() { return id; }
    @Override public String getUsername() { return identifier; }
    @Override public String getPassword() { return password; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
