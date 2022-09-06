---
title: "How to Generate Fake Data for Testing Your Rails App"
date: 2022-02-20T11:31:33-06:00
draft: false
slug: "how-to-generate-data-for-testing-your-rails-app"
keywords: [rails, testing]
tags: [rails, testing]
---

For a while, I created my own test data, manually, in every single test. It was tedious and took a bit of creative energy because I also tried to make the test data Stars Wars themed 😅. Eventually I came across some data that was a bit too tedious for me to create on my own and I decided that it was time to start generating it. And it was actually incredibly easy to implement, and I'll never manually create test data again! It makes your code simpler and more concise.

1. Install the gems you'll need: `factory-bot-rails` and `faker`. Add `gem factory-bot-rails` and `gem 'faker'` to your Gemfile under the test and development sections and run `bundle install`.

2. Create a "factory" using FactoryBot and Faker. A factory tells FactoryBot how to make test data and Faker actually makes the fake data. You can put factories anywhere in your app, but I put them in `spec/factories.rb`

		# spec/factories.rb
		FactoryBot.define do
			factory :user do
				username { Faker::Internet.username }
				password { Faker::Internet.password }
			end
		end

[Faker](https://github.com/faker-ruby/faker/) has excellent [generators](https://github.com/faker-ruby/faker/#generators) to generate test data for addresses, names, numbers, and even more fun stuff like Cosmere generators.

3. Add a helper method to `spec/rails_helper.rb` to simplify your tests:

		# spec/rails_helper.rb
		RSpec.configure do |config|
		...
			config.include FactoryBot::Syntax::Methods
		...
		end

4. Now you can use your factories to make test data in your tests!

		# spec/system/sign_in_spec.rb
		require 'rails_helper'
		RSpec.describe 'Sign in', type: :system do
		    scenario 'valid inputs' do
		        user = create(:user) # This is the line that uses FactoryBot and Faker!
		        visit '/'
		        click_link 'Sign In'
		        fill_in 'Email', with: user.email
		        fill_in 'Password', with: user.password
		        click_on 'Sign In!'
		        expect(page).to have_content('Signed in successfully.')
		    end
		end
