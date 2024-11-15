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

ActiveRecord::Schema[7.2].define(version: 2024_11_14_234510) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "asset_accounts", force: :cascade do |t|
    t.integer "user_id"
    t.string "account_name"
    t.string "institution_name"
    t.date "opening_date"
    t.float "interest_rate"
    t.float "account_balance"
    t.float "minimum_balance"
    t.boolean "is_plan_to_close"
    t.date "closure_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "account_type", limit: 255
    t.string "account_location", limit: 255
    t.string "currency", limit: 255
  end

  create_table "asset_deposits", force: :cascade do |t|
    t.integer "user_id"
    t.string "deposit_name"
    t.string "institution_name"
    t.string "deposit_type"
    t.string "deposit_location"
    t.string "currency"
    t.date "opening_date"
    t.float "deposit_amount"
    t.integer "deposit_term"
    t.date "maturity_date"
    t.float "interest_rate"
    t.string "interest_type"
    t.string "compounding_frequency"
    t.string "payment_frequency"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "payment_amount"
  end

  create_table "asset_incomes", force: :cascade do |t|
    t.integer "user_id"
    t.string "income_name"
    t.string "income_type"
    t.string "income_location"
    t.string "currency"
    t.float "income_amount"
    t.date "start_date"
    t.date "end_date"
    t.boolean "is_recurring"
    t.string "income_frequency"
    t.float "growth_rate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "asset_portfolio_details", force: :cascade do |t|
    t.integer "user_id"
    t.integer "portfolio_id"
    t.string "scrip"
    t.string "description"
    t.float "quantity"
    t.date "buy_date"
    t.float "buy_price"
    t.float "buy_tax_and_charges"
    t.date "sale_date"
    t.float "sale_price"
    t.float "sale_tax_and_charges"
    t.float "current_price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "asset_portfolios", force: :cascade do |t|
    t.integer "user_id"
    t.string "portfolio_name"
    t.string "institution_name"
    t.string "portfolio_location"
    t.string "currency"
    t.date "buying_date"
    t.float "buying_value"
    t.float "growth_rate"
    t.float "coupon_rate"
    t.boolean "is_paying_dividend"
    t.float "dividend_rate"
    t.float "dividend_amount"
    t.string "dividend_frequency"
    t.boolean "is_plan_to_sell"
    t.date "selling_date"
    t.float "selling_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "portfolio_type", limit: 255
    t.boolean "is_sip"
    t.float "sip_amount"
    t.string "sip_frequency", limit: 255
  end

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
    t.float "stamp_duty"
    t.float "other_fees"
    t.date "rental_start_date"
    t.date "rental_end_date"
  end

  create_table "asset_vehicles", force: :cascade do |t|
    t.integer "user_id"
    t.string "vehicle_name"
    t.string "vehicle_type"
    t.date "purchase_date"
    t.string "currency"
    t.float "purchase_price"
    t.float "coe_paid"
    t.float "tentative_current_value"
    t.float "annual_maintenance_amount"
    t.float "monthly_expenses"
    t.boolean "is_under_loan"
    t.float "loan_amount"
    t.integer "loan_remaining_duration"
    t.string "loan_type"
    t.float "loan_interest_rate"
    t.boolean "is_plan_to_sell"
    t.date "tentative_sale_date"
    t.float "tentative_sale_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "scrap_value"
    t.string "vehicle_location", limit: 255
    t.float "depreciation_rate"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "phone_no"
    t.date "date_of_birth"
    t.string "country_of_residence"
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
    t.boolean "is_permanent_resident"
  end
end
