class Api::UsersController < ApplicationController
    before_action :set_user, only: %i[show update destroy]
  
    def index
      @users = User.all
      render json: @users
    end
  
    def show
      render json: @user
    end
  
    def create
      @user = User.new(user_params)
  
      if @user.save
        render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @user.update(user_params)
        render json: @user, status: :ok
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @user.destroy
    end
  
    def create_or_find_user
      # Assuming you receive the user email from the request parameters
      user_email = params[:email]
  
      # Check if the user exists
      user = User.find_by(email: user_email)
  
      if user
        # User exists, return the user or a success message
        render json: { message: 'User already exists', user: user }, status: :ok
      else
        # User does not exist, create a new user
        new_user = User.create(user_params)
  
        if new_user.persisted?
          render json: { message: 'User created successfully', user: new_user }, status: :created
        else
          render json: { errors: new_user.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end

    private
  
    def set_user
      @user = User.find(params[:id])
    end
  
    def user_params
      params.require(:user).permit(
        :id,
        :email,
        :phone_no,
        :date_of_birth,
        :country_of_residence,
        :address,
        :email_verified,
        :phone_no_verified,
        :created_at,
        :updated_at
      )
    end
  end