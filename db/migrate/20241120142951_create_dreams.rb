class CreateDreams < ActiveRecord::Migration[7.2]
  def change
    create_table :dreams do |t|
      t.integer :user_id
      t.string :dream_name
      t.string :dream_type
      t.string :location
      t.string :currency
      t.date :dream_date
      t.float :amount
      t.integer :duration
      t.date :end_date
      t.boolean :is_funded_by_loan
      t.date :loan_start_date
      t.integer :loan_duration
      t.date :loan_end_date
      t.float :interest_rate
      t.float :emi_amount

      t.timestamps
    end
  end
end
