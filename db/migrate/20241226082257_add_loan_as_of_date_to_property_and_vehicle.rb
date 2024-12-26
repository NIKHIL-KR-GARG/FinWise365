class AddLoanAsOfDateToPropertyAndVehicle < ActiveRecord::Migration[7.2]
  def change
    add_column :asset_properties, :loan_as_of_date, :date
    add_column :asset_vehicles, :loan_as_of_date, :date
  end
end
