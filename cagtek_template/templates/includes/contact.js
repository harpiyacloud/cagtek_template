// Copyright (c) 2021, Harpiya Software Technologies

harpiya.ready(function() {

	if(harpiya.utils.get_url_arg('subject')) {
	  $('[name="subject"]').val(harpiya.utils.get_url_arg('subject'));
	}

	$('.btn-send').off("click").on("click", function() {
		var email = $('[name="email"]').val();
		var fullname = $('[name="fullname"]').val();
		var message = $('[name="message"]').val();

		if(!(fullname && email && message)) {
			harpiya.msgprint('{{ _("Size geri dönebilmemiz için lütfen hem e-posta adresinizi hem de mesajınızı giriniz. Teşekkürler!") }}');
			return false;
		}

		if(!validate_email(email)) {
			harpiya.msgprint('{{ _("E-posta adresiniz hatalı. Geri dönebilmemiz için lütfen geçerli bir e-posta adresi girin.") }}');
			$('[name="email"]').focus();
			return false;
		}

		$("#contact-alert").toggle(false);
		harpiya.send_message({
			subject: $('[name="subject"]').val(),
			sender: email,
			message: fullname + "<br>"+ message,
			callback: function(r) {
				if(r.message==="okay") {
					harpiya.msgprint('{{ _("Mesajın için teşekkürler") }}');
				} else {
					harpiya.msgprint('{{ _("Hata oluştu") }}');
					console.log(r.exc);
				}
				$(':input').val('');
			}
		}, this);
		return false;
	});

});

var msgprint = function(txt) {
	if(txt) $("#contact-alert").html(txt).toggle(true);
}
