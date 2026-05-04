package com.cours.atelier_partique.domain;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
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

    private static @NonNull ProblemDetail buildProblemDetail(Exception ex, HttpStatus httpStatus, String title) {
        ProblemDetail problem = ProblemDetail.forStatus(httpStatus);
        problem.setTitle(title);
        problem.setDetail(ex.getMessage());
        return problem;
    }
}
