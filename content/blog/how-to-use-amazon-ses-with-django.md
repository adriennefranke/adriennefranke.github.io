---
title: "How to Use Amazon SES With Django"
date: 2023-04-29T14:42:51-05:00
slug: "how-to-use-amazon-ses-with-django"
description: "How use Amazon SES with Django to send transactional emails"
keywords: [django, ses, aws]
tags: [django, ses, aws]
math: false
toc: false
draft: false
---

![SES + Django](../images/ses_django.jpg)

Amazon SES (Simple Email Service) is an AWS product that enables you to send marketing or transactional emails to your users. I’ve used it to send transactional emails, which are emails that are sent to a user following a transaction or an action, like signing up or requesting a password reset. Typically they come from a ‘noreply’ email address because you cannot reply to them. They’re very useful and should definitely be a component of your app.

## How to Use Amazon SES to send transactional emails for your Django app

1. First you will need to create an identity and verify the domain that you'd like to send the emails from. Amazon has some documentation for doing this [here](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#verify-domain-procedure). Sometimes it can take a few days for Amazon to verify the domain.
   
2. Once your domain has been verified, you'll have to generate SMTP credentials that will connect to your Amazon SES domain. These credentials are set by region so make sure you're creating these in the same region as your verified domain. I apologize for directing you somewhere else again, but Amazon has a short guide [here](https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html). Amazon will generate SMTP credentials, so make sure you copy those because you'll need them for the next step!
   
3. Store your SMTP username and password wherever you store your environment variables. You will need to access these in your Django code shortly.
   
4. Navigate to your `settings.py` file so we can add the proper SMTP settings. You can add this to the end of the file.
   
```
# settings.py

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'email-smtp.us-east-1.amazonaws.com'
EMAIL_HOST_USER = os.environ.get("SMTP_USERNAME") # Access your environment variable however you need
EMAIL_HOST_PASSWORD = os.environ.get("SMTP_PASSWORD")
EMAIL_PORT = 587
EMAIL_USE_TLS = True
```
   
5. Now it's time to actually configure your Django app to use these credentials. First, identify where to store the email template code (these will be HTML and TXT files). I like to keep mine in a `templates/emails` folder. I also like to make a general `emails` folder to store email configuration and logic such as subject, from_email, and to_emails. This will pull in the templates from `templates/emails`. Here's an example structure:
```
.
├── app_1
│   └── migrations
│   ├── __init.py__
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
├── app_2
│   └── migrations
│   ├── __init.py__
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
├── emails
│   ├── email_logic.py
├── templates
│   ├── email_template_1.html
│   ├── email_template_1.text
```

6. Let's send an email. When we call the following function with an email address, it will send an email to that address. 💌
   
```
# email_logic.py

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_email(recipient_email: str):
    message = EmailMultiAlternatives(
        subject="This is an Email Subject",
        body=render_to_string("email_template_1.txt"),
        from_email="noreply@yourdomain.com",
        to=[recipient_email]
    )
    html_content = render_to_string("email_template_1.html")
    message.attach_alternative(html_content, "text/html")
    message.send()
```


If you use Rails, you may be interested in [my other post](https://www.adriennefranke.com/blog/how-to-use-amazon-ses-with-rails/).
