class CreateSpots < ActiveRecord::Migration
  def change
    create_table :spots do |t|
      t.float :lat
      t.float :lng
      t.integer :spot_type
      t.string :content

      t.timestamps
    end
  end
end
