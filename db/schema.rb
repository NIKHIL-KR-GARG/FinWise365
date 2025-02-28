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

ActiveRecord::Schema[7.2].define(version: 2025_02_21_044111) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

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
    t.string "location", limit: 255
    t.string "currency", limit: 255
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
  end

  create_table "asset_deposits", force: :cascade do |t|
    t.integer "user_id"
    t.string "deposit_name"
    t.string "institution_name"
    t.string "deposit_type"
    t.string "location"
    t.string "currency"
    t.date "opening_date"
    t.float "amount"
    t.integer "deposit_term"
    t.date "maturity_date"
    t.float "interest_rate"
    t.string "interest_type"
    t.string "compounding_frequency"
    t.string "payment_frequency"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "payment_amount"
    t.float "total_interest"
    t.float "total_principal"
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
  end

  create_table "asset_incomes", force: :cascade do |t|
    t.integer "user_id"
    t.string "income_name"
    t.string "income_type"
    t.string "location"
    t.string "currency"
    t.float "amount"
    t.date "start_date"
    t.date "end_date"
    t.boolean "is_recurring"
    t.string "income_frequency"
    t.float "growth_rate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
  end

  create_table "asset_others", force: :cascade do |t|
    t.integer "user_id"
    t.string "asset_name"
    t.string "institution_name"
    t.string "location"
    t.string "currency"
    t.date "start_date"
    t.float "lumpsum_amount"
    t.float "growth_rate"
    t.boolean "is_recurring_payment"
    t.string "payment_frequency"
    t.float "payment_amount"
    t.date "payment_end_date"
    t.string "payout_type"
    t.date "payout_date"
    t.integer "payout_age"
    t.integer "payout_duration"
    t.float "payout_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "total_interest"
    t.float "total_principal"
    t.string "payout_frequency", limit: 255
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "current_price"
  end

  create_table "asset_portfolios", force: :cascade do |t|
    t.integer "user_id"
    t.string "portfolio_name"
    t.string "institution_name"
    t.string "location"
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
    t.date "sale_date"
    t.float "sale_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "portfolio_type", limit: 255
    t.boolean "is_sip"
    t.float "sip_amount"
    t.string "sip_frequency", limit: 255
    t.float "buy_price"
    t.float "current_value"
    t.float "profit"
    t.float "profit_percentage"
    t.float "loss"
    t.float "loss_percentage"
    t.string "coupon_frequency", limit: 255
    t.date "maturity_date"
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
    t.date "sip_end_date"
  end

  create_table "asset_properties", force: :cascade do |t|
    t.integer "user_id"
    t.string "property_name"
    t.string "property_type"
    t.string "location"
    t.integer "property_number"
    t.date "purchase_date"
    t.string "currency"
    t.float "purchase_price"
    t.float "current_value"
    t.boolean "is_primary_property"
    t.boolean "is_funded_by_loan"
    t.float "loan_amount"
    t.integer "loan_duration"
    t.string "loan_type"
    t.float "loan_interest_rate"
    t.boolean "is_loan_locked"
    t.date "loan_locked_till"
    t.boolean "is_on_rent"
    t.float "rental_amount"
    t.float "growth_rate"
    t.boolean "is_plan_to_sell"
    t.date "sale_date"
    t.float "sale_amount"
    t.float "property_tax"
    t.float "property_maintenance"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "stamp_duty"
    t.float "other_fees"
    t.date "rental_start_date"
    t.date "rental_end_date"
    t.float "total_cost"
    t.float "interest_payments"
    t.float "emi_amount"
    t.float "down_payment"
    t.float "ltv_value"
    t.float "ltv_percentage"
    t.float "additional_buyer_stamp_duty"
    t.float "buyer_stamp_duty"
    t.float "rental_growth_rate"
    t.boolean "is_under_construction"
    t.date "launch_date"
    t.date "possession_date"
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
    t.date "loan_as_of_date"
    t.boolean "is_using_growth_rate_for_sale_value", default: false
  end

  create_table "asset_vehicles", force: :cascade do |t|
    t.integer "user_id"
    t.string "vehicle_name"
    t.string "vehicle_type"
    t.date "purchase_date"
    t.string "currency"
    t.float "purchase_price"
    t.float "coe_paid"
    t.float "current_value"
    t.float "vehicle_maintanance"
    t.float "monthly_expenses"
    t.boolean "is_funded_by_loan"
    t.float "loan_amount"
    t.integer "loan_duration"
    t.string "loan_type"
    t.float "loan_interest_rate"
    t.boolean "is_plan_to_sell"
    t.date "sale_date"
    t.float "sale_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "scrap_value"
    t.string "location", limit: 255
    t.float "depreciation_rate"
    t.float "ltv_percentage"
    t.float "ltv_value"
    t.float "down_payment"
    t.float "emi_amount"
    t.float "interest_payments"
    t.float "total_cost"
    t.boolean "is_on_lease"
    t.date "lease_start_date"
    t.date "lease_end_date"
    t.float "lease_amount"
    t.float "lease_growth_rate"
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
    t.date "loan_as_of_date"
  end

  create_table "cashflow_assets", force: :cascade do |t|
    t.integer "user_id"
    t.date "cashflow_date"
    t.integer "month"
    t.integer "year"
    t.integer "age"
    t.integer "asset_id"
    t.string "asset_type"
    t.string "asset_name"
    t.float "original_asset_value"
    t.float "asset_value"
    t.boolean "is_locked"
    t.boolean "is_cash"
    t.float "growth_rate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_dummy_data"
    t.integer "cashflow_id"
    t.string "currency"
  end

  create_table "cashflow_liabilities", force: :cascade do |t|
    t.integer "user_id"
    t.date "cashflow_date"
    t.integer "month"
    t.integer "year"
    t.integer "age"
    t.integer "liability_id"
    t.string "liability_type"
    t.string "liability_name"
    t.float "liability_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_dummy_data"
    t.integer "cashflow_id"
    t.string "currency"
  end

  create_table "cashflow_net_positions", force: :cascade do |t|
    t.integer "user_id"
    t.date "cashflow_date"
    t.integer "month"
    t.integer "year"
    t.integer "age"
    t.float "income"
    t.float "expense"
    t.float "net_position"
    t.float "liquid_assets"
    t.float "locked_assets"
    t.float "net_worth"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_dummy_data"
    t.integer "cashflow_id"
    t.string "currency"
  end

  create_table "cashflow_projections", force: :cascade do |t|
    t.integer "user_id"
    t.date "cashflow_date"
    t.boolean "is_dummy_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "currency"
  end

  create_table "contact_admins", force: :cascade do |t|
    t.string "name"
    t.string "company"
    t.string "email"
    t.string "message"
    t.boolean "is_read"
    t.boolean "is_replied"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dreams", force: :cascade do |t|
    t.integer "user_id"
    t.string "dream_name"
    t.string "dream_type"
    t.string "location"
    t.string "currency"
    t.date "dream_date"
    t.float "amount"
    t.integer "duration"
    t.date "end_date"
    t.boolean "is_funded_by_loan"
    t.date "loan_start_date"
    t.integer "loan_duration"
    t.date "loan_end_date"
    t.float "interest_rate"
    t.float "emi_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_dummy_data", default: false
    t.boolean "is_recurring", default: false
    t.float "loan_amount"
    t.float "recurring_amount"
    t.string "recurring_frequency"
  end

  create_table "expense_credit_card_debts", force: :cascade do |t|
    t.integer "user_id"
    t.string "debt_type"
    t.string "card_name"
    t.string "institution_name"
    t.string "location"
    t.string "currency"
    t.date "start_date"
    t.integer "duration"
    t.date "end_date"
    t.float "loan_amount"
    t.float "interest_rate"
    t.float "emi_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
  end

  create_table "expense_homes", force: :cascade do |t|
    t.integer "user_id"
    t.string "home_name"
    t.string "location"
    t.string "currency"
    t.float "groceries"
    t.float "clothes"
    t.float "utilities"
    t.float "furniture"
    t.float "health"
    t.float "transport"
    t.float "communication"
    t.float "entertainment"
    t.float "education"
    t.float "dining"
    t.float "holidays"
    t.float "miscellaneous"
    t.float "total_expense"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "start_date"
    t.date "end_date"
    t.float "inflation_rate"
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
    t.float "rental"
    t.float "alcohol"
  end

  create_table "expense_others", force: :cascade do |t|
    t.integer "user_id"
    t.string "expense_name"
    t.string "location"
    t.string "currency"
    t.date "expense_date"
    t.integer "duration"
    t.date "end_date"
    t.float "amount"
    t.float "inflation_rate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_recurring"
    t.float "recurring_amount"
    t.string "recurring_frequency", limit: 255
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
  end

  create_table "expense_personal_loans", force: :cascade do |t|
    t.integer "user_id"
    t.string "loan_name"
    t.string "institution_name"
    t.string "location"
    t.string "currency"
    t.date "start_date"
    t.integer "duration"
    t.date "end_date"
    t.float "loan_amount"
    t.float "interest_rate"
    t.float "emi_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
  end

  create_table "expense_properties", force: :cascade do |t|
    t.integer "user_id"
    t.string "property_name"
    t.string "property_type"
    t.date "start_date"
    t.date "end_date"
    t.string "location"
    t.string "currency"
    t.string "expense_name_1"
    t.float "expense_value_1"
    t.string "expense_name_2"
    t.float "expense_value_2"
    t.string "expense_name_3"
    t.float "expense_value_3"
    t.string "expense_name_4"
    t.float "expense_value_4"
    t.string "expense_name_5"
    t.float "expense_value_5"
    t.string "expense_name_6"
    t.float "expense_value_6"
    t.string "expense_name_7"
    t.float "expense_value_7"
    t.string "expense_name_8"
    t.float "expense_value_8"
    t.float "total_expense"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "inflation_rate"
    t.boolean "is_dummy_data", default: false
    t.boolean "is_dream", default: false
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
    t.string "base_currency", limit: 255
    t.string "gender", limit: 255
    t.string "nationality", limit: 255
    t.boolean "is_permanent_resident"
    t.boolean "is_display_dummy_data", default: true
    t.boolean "is_admin"
    t.boolean "is_financial_advisor", default: false
    t.string "financial_advisor_licence_no"
    t.integer "financial_advisor_id"
    t.date "last_login_date"
    t.boolean "is_active", default: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
end
