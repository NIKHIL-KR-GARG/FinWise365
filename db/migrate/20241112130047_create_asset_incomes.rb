class CreateAssetIncomes < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_incomes do |t|
      t.integer :user_id
      t.string :income_name
      t.string :income_type
      t.string :income_location
      t.string :currency
      t.float :income_amount
      t.date :start_date
      t.date :end_date
      t.boolean :is_recurring
      t.string :income_frequency
      t.float :growth_rate

      t.timestamps
    end
  end
end
