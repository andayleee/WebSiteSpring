$('#registerForm').on('submit', function(e) {
    e.preventDefault();

    const form = $(this);
    const data = {
        email: form.find('[name="email"]').val(),
        password: form.find('[name="password"]').val(),
        accessKey: form.find('[name="accessKey"]').val()
    };

    $.ajax({
        url: '/register',
        type: 'POST',
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(data),
        success: function() {
            alert('Регистрация успешна');
            form[0].reset();
        },
        error: function(jqXHR) {
            alert('Ошибка: ' + jqXHR.responseText);
        }
    });
});