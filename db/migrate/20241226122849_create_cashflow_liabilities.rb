class CreateCashflowLiabilities < ActiveRecord::Migration[7.2]
  def change
    create_table :cashflow_liabilities do |t|
      t.integer :user_id
      t.date :cashflow_date
      t.integer :month
      t.integer :year
      t.integer :age
      t.integer :liability_id
      t.string :liability_type
      t.string :liability_name
      t.float :liability_value
      t.boolean :is_dummy_data
      t.integer :cashflow_id

      t.timestamps
    end
  end
end
