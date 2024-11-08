# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_11_07_030850) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "asset_properties", force: :cascade do |t|
    t.integer "user_id"
    t.string "property_name"
    t.string "property_type"
    t.string "property_location"
    t.integer "property_number"
    t.date "purchase_date"
    t.string "currency"
    t.float "purchase_price"
    t.float "tentative_current_value"
    t.boolean "is_primary_property"
    t.boolean "is_under_loan"
    t.float "loan_amount"
    t.integer "loan_remaining_duration"
    t.string "loan_type"
    t.float "loan_interest_rate"
    t.boolean "is_loan_locked"
    t.date "loan_locked_till"
    t.boolean "is_on_rent"
    t.float "rental_amount"
    t.float "property_value_growth_rate"
    t.boolean "is_plan_to_sell"
    t.date "tentative_sale_date"
    t.float "tentative_sale_amount"
    t.float "annual_property_tax_amount"
    t.float "annual_property_maintenance_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "phone_no"
    t.date "date_of_birth"
    t.string "country_of_residence"
    t.string "is_permanent_resident"
    t.string "address"
    t.boolean "is_email_verified"
    t.boolean "is_phone_no_verified"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name", limit: 255
    t.string "last_name", limit: 255
    t.integer "retirement_age"
    t.integer "life_expectancy"
    t.string "avatar"
    t.string "base_currency", limit: 255
    t.string "gender", limit: 255
    t.string "nationality", limit: 255
  end
end
