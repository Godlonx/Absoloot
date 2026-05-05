package com.cours.atelier_partique.domain.exeption;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(InvalidRequestException.class)
    public ProblemDetail handleInvalidRequestException(InvalidRequestException exception) {
        return buildProblemDetail(exception, HttpStatus.BAD_REQUEST, "Invalid request");
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ProblemDetail handleUserAlreadyExistsException(UserAlreadyExistsException exception) {
        return buildProblemDetail(exception, HttpStatus.CONFLICT, "User already exists");
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ProblemDetail handleInvalidCredentialsException(InvalidCredentialsException exception) {
        return buildProblemDetail(exception, HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationException(MethodArgumentNotValidException exception) {
        return buildProblemDetail(exception, HttpStatus.BAD_REQUEST, "Invalid request");
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleValidationException(HttpMessageNotReadableException exception) {
        return buildProblemDetail(exception, HttpStatus.BAD_REQUEST, "Invalid request");
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ProblemDetail handleValidationException(HttpMediaTypeNotSupportedException exception) {
        return buildProblemDetail(exception, HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Invalid content-type");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(Exception exception) {
        return buildProblemDetail(exception, HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error");
    }


    private static @NonNull ProblemDetail buildProblemDetail(Exception ex, HttpStatus httpStatus, String title) {
        ProblemDetail problem = ProblemDetail.forStatus(httpStatus);
        problem.setTitle(title);
        problem.setInstance(null);
        problem.setDetail(ex.getMessage());
        return problem;
    }
}
