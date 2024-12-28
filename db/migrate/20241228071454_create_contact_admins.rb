class CreateContactAdmins < ActiveRecord::Migration[7.2]
  def change
    create_table :contact_admins do |t|
      t.string :name
      t.string :company
      t.string :email
      t.string :message
      t.boolean :is_read
      t.boolean :is_replied

      t.timestamps
    end
  end
end
