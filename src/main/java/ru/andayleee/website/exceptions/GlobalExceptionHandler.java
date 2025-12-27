package ru.andayleee.website.exceptions;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public String handleMaxSizeException(MaxUploadSizeExceededException ex, RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("toastMessage", "Файл слишком большой! Максимальный размер 10MB.");
        return "redirect:/account"; // перенаправляем на страницу аккаунта
    }
}
