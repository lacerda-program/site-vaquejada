package com.sertaotickets.api.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Quem entra sem se identificar e quem precisa de credencial.
 *
 * <p>A régua é a natureza do dado: catálogo e checkout são públicos porque a loja
 * precisa vender para visitante; a carteira de ingressos exige credencial porque
 * consultar por CPF expõe dado pessoal de terceiro.
 *
 * <p><b>Limitação assumida:</b> não existe entidade de usuário no projeto, então a
 * proteção é um usuário único de serviço. Isso é um portão, não isolamento por
 * titular — qualquer autenticado consulta qualquer CPF. O próximo passo natural é
 * {@code Usuario} + JWT com o ingresso amarrado ao dono.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private static final String SENHA_PADRAO_DEV = "vaquejada";

    /** Porta padrão do Vite. Sobrescreva em produção via variável de ambiente. */
    @Value("${app.cors.allowed-origins}")
    private List<String> origensPermitidas;

    @Value("${app.security.admin.usuario}")
    private String usuarioAdmin;

    @Value("${app.security.admin.senha}")
    private String senhaAdmin;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                // API stateless com Basic: não há sessão nem formulário de onde
                // roubar um token CSRF, então o filtro só atrapalharia o POST.
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Sem isto o console do H2, que roda em <frame>, abre em branco.
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/eventos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/pedidos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/**").permitAll()
                        .requestMatchers("/api/ingressos/**").authenticated()
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Lista explícita, nunca "*": com allowCredentials o navegador recusa o
        // curinga, e o Basic da carteira de ingressos viaja como credencial.
        config.setAllowedOrigins(origensPermitidas);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Location"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        if (SENHA_PADRAO_DEV.equals(senhaAdmin)) {
            log.warn("Usando a senha padrão de desenvolvimento para '{}'. "
                    + "Defina app.security.admin.senha antes de expor esta API.", usuarioAdmin);
        }
        return new InMemoryUserDetailsManager(User.withUsername(usuarioAdmin)
                .password(encoder.encode(senhaAdmin))
                .roles("ADMIN")
                .build());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
