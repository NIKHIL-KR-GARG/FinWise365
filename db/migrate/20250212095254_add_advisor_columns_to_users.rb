class AddAdvisorColumnsToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :is_financial_advisor, :boolean, default: false
    add_column :users, :financial_advisor_licence_no, :string
    add_column :users, :financial_advisor_id, :integer
    add_column :users, :last_login_date, :date
  end
end
