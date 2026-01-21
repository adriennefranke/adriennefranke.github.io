---
title: "How to Use Amazon SES With Rails"
date: 2022-02-19T13:03:50-06:00
draft: false
slug: "how-to-use-amazon-ses-with-rails"
keywords: [rails, aws]
tags: [rails, aws]
math: false
toc: false
---

Amazon SES (Simple Email Service) is an AWS product that enables you to send marketing or transactional emails to your users. I've used it to send transactional emails, which are emails that are sent to a user following a transaction or an action, like signing up or requesting a password reset. Typically they come from a 'noreply' email address because you cannot reply to them. They're very useful and should definitely be a component of your app.

## How to Use Amazon SES to send transactional emails for your Rails app

1.  First you will need to create an identity and verify the domain that you'd like to send the emails from. Amazon has some documentation for doing this [here](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#verify-domain-procedure). Sometimes it can take a few days for Amazon to verify the domain.

2.  Once your domain has been verified, you'll have to generate SMTP credentials that will connect to your Amazon SES domain. These credentials are set by region so make sure you're creating these in the same region as your verified domain. I apologize for directing you somewhere else again, but Amazon has a short guide [here](https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html). Amazon will generate SMTP credentials, so make sure you copy those because you'll need them for the next step!

3.  I recommend using Rails multi environment credentials to store these credentials. It's super easy to set up and the credentials are encrypted. In your app directory...

        $ rails credentials:edit --environment development

This will open up a file in your text editor that will store your credentials for your _development_ environment. So when you're running the app locally in development, it'll load these specific credentials without you needing to specify the environment either in the credentials folder or in your app's code itself. Pretty nifty!

    	# Amazon SES
    	ses:
    		username: your-smtp-credential-username-from-step2
    		password: your-smtp-credential-password-from-step2

You'll then be able to use `Rails.application.credentials.ses.username` or `Rails.application.credentials.ses.password` throughout your app.

4.  Now we need to configure our Rails app to use these new credentials to send the transactional emails. Go to `config/environments/development.rb` and we'll add them there:

        # config/environments/development.rb
        Rails.application.configure do
        	# Email
        	config.x.mail_from = %(YourAppName <noreply@yourdomain.com>)
        	config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
        	config.action_mailer.perform_caching = false
        	config.action_mailer.perform_deliveries = true
        	config.action_mailer.raise_delivery_errors = true
        	config.action_mailer.delivery_method = :smtp
        	config.action_mailer.smtp_settings = {
        	address: 'email-smtp.us-east-1.amazonaws.com',
        	port: 587,
        	authentication: 'login',
        	domain: 'yourdomain.com',
        	user_name: Rails.application.credentials.ses.username,
        	password: Rails.application.credentials.ses.password,
        	enable_starttls_auto: true,
        	}
        end

5.  Now you're able to send transactional emails through your app! You'll want to make sure you do the same for your production environment by editing your production credentials:

        $ rails credentials:edit --environment production

And also by editing `config/environments/production.rb`:

    	# config/environments/development.rb
    	Rails.application.configure do
    		# Email
    		config.x.mail_from = %(YourAppName <noreply@yourdomain.com>)
    		config.action_mailer.default_url_options = { host: 'https://yourdomain.com' }
    		config.action_mailer.perform_caching = false
    		config.action_mailer.perform_deliveries = true
    		config.action_mailer.raise_delivery_errors = true
    		config.action_mailer.delivery_method = :smtp
    		config.action_mailer.smtp_settings = {
    		address: 'email-smtp.us-east-1.amazonaws.com',
    		port: 587,
    		authentication: 'login',
    		domain: 'yourdomain.com',
    		user_name: Rails.application.credentials.ses.username,
    		password: Rails.application.credentials.ses.password,
    		enable_starttls_auto: true,
    		}
    	end
