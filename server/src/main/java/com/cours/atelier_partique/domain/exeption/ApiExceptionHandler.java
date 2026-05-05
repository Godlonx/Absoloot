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
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(InvalidRequestException.class)
    public ProblemDetail handleInvalidRequestException(InvalidRequestException exception) {
        return buildProblemDetail(exception, HttpStatus.BAD_REQUEST, "Invalid request");
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ProblemDetail handleUserAlreadyExistsException(UserAlreadyExistsException exception) {
        return buildProblemDetail(exception, HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ProblemDetail handleInvalidCredentialsException(InvalidCredentialsException exception) {
        return buildProblemDetail(exception, HttpStatus.UNAUTHORIZED, exception.getMessage());
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

    @ExceptionHandler(NoResourceFoundException.class)
    public ProblemDetail handleValidationException(NoResourceFoundException exception) {
        return buildProblemDetail(exception, HttpStatus.NOT_FOUND, "Not found");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(Exception exception) {
        log.error(exception.getMessage(), exception);
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
