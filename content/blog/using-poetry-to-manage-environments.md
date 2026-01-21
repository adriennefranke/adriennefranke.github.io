---
title: "Using Poetry to Manage Your Python Environments + Projects"
date: 2020-10-18T14:22:12-05:00
slug: "using-poetry-to-manage-python-environments"
keywords: [python, poetry, python environments]
draft: false
tags: [poetry, python]
math: false
toc: false
---

I started using [Poetry](https://python-poetry.org/) after my coworker recommended it when we started to build [nppes](https://github.com/jturan/nppes). It's completely changed the way I develop with Python.

## Install + Use Poetry

1.  Install Poetry.

        > curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -

2.  Check to see what version Poetry is.

        > poetry --version

## Start a new Python project with Poetry

1.  Head to the parent directory where you want the new project to live.

        > poetry new project-name

This will create a directory called project-name with everything you need! The `pyproject.toml` file has everything in it for your project's dependencies.

2.  Add some dependencies.

        > poetry add pandas

    This will add them to `pyproject.toml` so you don't need to do that manually. It will also add and install all of the requirements for the package you just added.

3.  Remove a dependency.

        > poetry remove pandas

4.  Use Poetry to run Python. (This is like activating your virtual environment.) In your terminal, type `poetry run` before the `python` command.

        > poetry run python python-script.py
