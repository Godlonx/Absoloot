package com.cours.atelier_partique.domain.exeption;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Traduit les exceptions métier en réponses JSON dont la forme est attendue par
 * le client (client/src/services/api.ts) : { status, message } et leurs variantes
 * 409 (detail / aventuriersInvalides) et 422 (prerequisNonSatisfait).
 */
@Slf4j
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidRequest(InvalidRequestException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler({
            MethodArgumentNotValidException.class,
            ConstraintViolationException.class,
            HttpMessageNotReadableException.class,
            MethodArgumentTypeMismatchException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<Map<String, Object>> handleValidation(Exception ex) {
        String message = "Données invalides - Vérifiez vos entrées";
        if (ex instanceof MethodArgumentNotValidException manv && manv.getBindingResult().getFieldError() != null) {
            var fieldError = manv.getBindingResult().getFieldError();
            message = fieldError.getField() + " : " + fieldError.getDefaultMessage();
        } else if (ex instanceof ConstraintViolationException cve) {
            message = cve.getConstraintViolations().stream()
                    .map(v -> v.getPropertyPath() + " " + v.getMessage())
                    .collect(Collectors.joining(", "));
        }
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException ex) {
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException ex) {
        Map<String, Object> body = baseBody(HttpStatus.CONFLICT, ex.getMessage());
        if (ex.getDetail() != null) {
            body.put("detail", ex.getDetail());
        }
        if (ex.getAventuriersInvalides() != null && !ex.getAventuriersInvalides().isEmpty()) {
            List<Map<String, Object>> invalides = ex.getAventuriersInvalides().stream()
                    .map(a -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("id", a.id());
                        m.put("nom", a.nom());
                        m.put("raison", a.raison());
                        return m;
                    })
                    .collect(Collectors.toList());
            body.put("aventuriersInvalides", invalides);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(PrerequisNonSatisfaitException.class)
    public ResponseEntity<Map<String, Object>> handlePrerequis(PrerequisNonSatisfaitException ex) {
        Map<String, Object> body = baseBody(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
        Map<String, Object> prereq = new LinkedHashMap<>();
        prereq.put("type", ex.getType());
        prereq.put("detail", ex.getDetail());
        body.put("prerequisNonSatisfait", prereq);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Une erreur interne s'est produite");
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(baseBody(status, message));
    }

    private Map<String, Object> baseBody(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("message", message);
        return body;
    }
}
