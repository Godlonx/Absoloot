package com.cours.atelier_partique.domain.exeption;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.ConflictError;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.ConflictErrorInvalidAdventurersInner;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.Error;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UnprocessableEntityError;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UnprocessableEntityErrorUnmetPrerequisite;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Translates business exceptions into JSON responses. Skill rule violations
 * follow the contract error schemas (Error / ConflictError /
 * UnprocessableEntityError); auth exceptions use RFC 7807 ProblemDetail.
 */
@Slf4j
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<Error> handleInvalidRequest(InvalidRequestException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler({
            MethodArgumentNotValidException.class,
            ConstraintViolationException.class,
            HttpMessageNotReadableException.class,
            MethodArgumentTypeMismatchException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<Error> handleValidation(Exception ex) {
        String message = "Invalid data - check your inputs";
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
    public ResponseEntity<Error> handleUnauthorized(UnauthorizedException ex) {
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Error> handleNotFound(NotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ConflictError> handleConflict(ConflictException ex) {
        ConflictError body = ConflictError.builder()
                .status(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .detail(ex.getDetail())
                .build();
        if (ex.getAventuriersInvalides() != null && !ex.getAventuriersInvalides().isEmpty()) {
            List<ConflictErrorInvalidAdventurersInner> invalid = ex.getAventuriersInvalides().stream()
                    .map(a -> ConflictErrorInvalidAdventurersInner.builder()
                            .id(UUID.fromString(a.id()))
                            .name(a.nom())
                            .reason(a.raison())
                            .build())
                    .collect(Collectors.toList());
            body.setInvalidAdventurers(invalid);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(PrerequisNonSatisfaitException.class)
    public ResponseEntity<UnprocessableEntityError> handlePrerequisite(PrerequisNonSatisfaitException ex) {
        UnprocessableEntityErrorUnmetPrerequisite unmet =
                UnprocessableEntityErrorUnmetPrerequisite.builder()
                        .type(UnprocessableEntityErrorUnmetPrerequisite.TypeEnum.fromValue(ex.getType()))
                        .detail(ex.getDetail())
                        .build();
        UnprocessableEntityError body = UnprocessableEntityError.builder()
                .status(HttpStatus.UNPROCESSABLE_ENTITY.value())
                .message(ex.getMessage())
                .unmetPrerequisite(unmet)
                .build();
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ProblemDetail handleUserAlreadyExists(UserAlreadyExistsException ex) {
        return problem(ex, HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ProblemDetail handleInvalidCredentials(InvalidCredentialsException ex) {
        return problem(ex, HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Error> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "An internal error occurred");
    }

    private ResponseEntity<Error> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Error.builder()
                .status(status.value())
                .message(message)
                .build());
    }

    private static @NonNull ProblemDetail problem(Exception ex, HttpStatus status, String title) {
        ProblemDetail problem = ProblemDetail.forStatus(status);
        problem.setTitle(title);
        problem.setDetail(ex.getMessage());
        return problem;
    }
}
