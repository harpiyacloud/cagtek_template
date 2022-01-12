# Copyright (c) 2021, Harpiya Software Technologies

import harpiya
from harpiya.utils import now
from harpiya import _

sitemap = 1


def get_context(context):
    doc = harpiya.get_doc("Contact Us Settings", "Contact Us Settings")

    if doc.query_options:
        query_options = [opt.strip() for opt in doc.query_options.replace(",", "\n").split("\n") if opt]
    else:
        query_options = ["Satış", "Destek", "Genel"]

    context = {
        "query_options": query_options,
        "parents": [
            {"name": _("Anasayfa"), "route": "/"}
        ]
    }
    context.update(doc.as_dict())
    return context


max_communications_per_hour = 1000


@harpiya.whitelist(allow_guest=True)
def send_message(subject="", message="", sender=""):
    if not fullname:
        harpiya.response["message"] = _("Lütfen adınızı ve soyadınızı yazın")
    if not subject:
        harpiya.response["message"] = _("Lütfen adınızı ve soyadınızı yazın")
    if not message:
        harpiya.response["message"] = _('Lütfen birşeyler yazın')
        return

    if not sender:
        harpiya.response["message"] = 'E-posta adresi gereklidir'
        return

    # guest method, cap max writes per hour
    if harpiya.db.sql("""select count(*) from `tabCommunication`
		where `sent_or_received`="Received"
		and TIMEDIFF(%s, modified) < '01:00:00'""", now())[0][0] > max_communications_per_hour:
        harpiya.response[
            "message"] = "Üzgünüz: Bu tür makul olmayan sayıda talep aldığımızı düşünüyoruz. Lütfen daha sonra tekrar deneyin"
        return

    # send email
    forward_to_email = harpiya.db.get_value("Contact Us Settings", None, "forward_to_email")
    if forward_to_email:
        harpiya.sendmail(recipients=forward_to_email, sender=sender, content=message, subject=subject)

    # add to to-do ?
    harpiya.get_doc(dict(
        doctype='Communication',
        sender=sender,
        subject=_('Websitesi İletişim Sayfasından Yeni Mesaj'),
        sent_or_received='Received',
        content=message,
        status='Open',
    )).insert(ignore_permissions=True)

    return "okay"
