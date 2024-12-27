class CreateCashflowProjections < ActiveRecord::Migration[7.2]
  def change
    create_table :cashflow_projections do |t|
      t.integer :user_id
      t.date :cashflow_date
      t.boolean :is_dummy_data

      t.timestamps
    end
  end
end
