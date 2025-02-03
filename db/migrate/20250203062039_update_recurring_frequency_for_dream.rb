class UpdateRecurringFrequencyForDream < ActiveRecord::Migration[7.2]
  def change
    change_column :dreams, :recurring_frequency, :string
  end
end
