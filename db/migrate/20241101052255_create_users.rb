class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :email
      t.string :phone_no
      t.string :first_name
      t.string :last_name
      t.date :date_of_birth
      t.string :country_of_residence
      t.string :base_currency
      t.string :address
      t.integer :retirement_age
      t.integer :life_expectancy
      t.boolean :is_permanent_resident
      t.boolean :is_email_verified
      t.boolean :is_phone_no_verified
      t.string :gender
      t.string :nationality
      t.boolean :is_display_dummy_data

      t.timestamps
    end
  end
end
