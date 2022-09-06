---
title: "How to Set up a Daily Recurring Task with Django-Q"
date: 2020-10-18T12:27:32-05:00
slug: "how-to-set-up-recurring-task-with-django-q"
description: "How to set up a recurring task with Django-Q"
keywords: [django, python, django-q]
draft: false
tags: [django, automation, python]
math: false
toc: false
---

Have you ever needed to do something over and over and over again with your data in Django? Perhaps you wanted to summarize your data. Maybe you needed to send some reminder emails. Regardless, as you get deeper and deeper into building apps with Django, you'll probably need to start automating some tasks.

When I first looked into doing this, [Celery](https://docs.celeryproject.org/en/stable/) was nearly always the top result. I added it to my Django project and tried to get it up and running. It was a bit harder and more complex than I was envisioning.

So I looked for something else - something a bit simpler. I found [huey](https://huey.readthedocs.io/en/latest/), [django-background-tasks](https://django-background-tasks.readthedocs.io/en/latest/), and [Django-Q](https://django-q.readthedocs.io/en/latest/). Ultimately, I chose Django-Q. It had recent commits (in of October 2020), great documentation, and over 1k stars on Github.

## How to Add Django-Q to Your Project

1. Install Django-Q.

        > pip install django-q

2. In your `settings.py` file, add django-q to your INSTALLED_APPS.

        # settings.py

        # Add Django-Q to installed apps
        INSTALLED_APPS = [
        ...,
        'django_q',
        ]

3. Django-Q needs a message broker. Because this is a simple daily task, we are just going to use the Django ORM. Configure this in your `settings.py`. 
        
        # settings.py

        # Configure the Q Cluster with the Django ORM
        Q_CLUSTER = {
            "name": "DjangORM",
            "workers": 4,
            "timeout": 90,
            "retry": 120,
            "queue_limit": 50,
            "bulk": 10,
            "orm": "default",
        }

    For reference, here's what "default" is in my example project.

        # settings.py

        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
            }
        }

    A message broker is a way to send messages between senders and receivers. Basically, it handles the "messages" of your scheduled tasks. Using the Django ORM as a broker is okay for simple tasks, but if you need to do something more complex consider something like Redis.

3. Django-Q needs to create the necessary tables in your database so you'll need to run these migrations.

        > python manage.py migrate

4. To run the tasks, fire up the qcluster.
        
        > python manage.py qcluster

    You'll see some gibberish like...
    
        > "Q Cluster carpet-lactose-beer-illinois starting"

    You're ready to go! 🔥

## How to Create the Recurring Task

Now we actually need to create the task that will kick off every day. I want to know how many new users signed up for my Django app on the previous day.

1. Create a `tasks.py` file in your app's folder, alongside `models.py`, `views.py`, etc.

2. Create the function. This is what Django-Q will run.

        # tasks.py

        def count_daily_new_users():
            '''
            Counts the new users that signed up on the previous day
            '''
            return User.objects.filter(date_joined__date=timezone.now().date() - timezone.timedelta(1)).count()

## How to Schedule the Recurring Task
1. Create the schedule for the task. I do this via the Admin. (You can also do this [via the Django shell.](https://django-q.readthedocs.io/en/latest/schedules.html)) Specify what function you want to run, how often, at what time, and how many times.

2. In order for your scheduled task to run, start your qcluster.

        > python manage.py qcluster

3. Your Django server must be running as well. 
   
        > python manage.py runserver

4. When your task is running and has finished you will see more gibberish that basically says it created a task, is processing the task, and then has processed the task once it's finished. 
   
        > 18:35:53 [Q] INFO Process-1 created a task from schedul [1]
        > 18:35:53 [Q] INFO Process-1:1 processing [helium-failed-artist-july]
        > 18:35:53 [Q] INFO Processed [helium-failed-artist-july]

5. Congrats! You've just automated a task! 🏖