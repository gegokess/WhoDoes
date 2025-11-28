-- Enable Row Level Security on all tables
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_points_history ENABLE ROW LEVEL SECURITY;

-- Helper function to get current household_id from request header
CREATE OR REPLACE FUNCTION get_household_id_from_header()
RETURNS UUID AS $$
DECLARE
  household_id_header TEXT;
BEGIN
  household_id_header := current_setting('request.headers', true)::json->>'x-household-id';
  RETURN household_id_header::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for households
CREATE POLICY "Users can read their own household"
  ON households FOR SELECT
  USING (id = get_household_id_from_header());

CREATE POLICY "Anyone can create a household"
  ON households FOR INSERT
  WITH CHECK (true);

-- RLS Policies for partners
CREATE POLICY "Users can read their household partners"
  ON partners FOR SELECT
  USING (household_id = get_household_id_from_header());

CREATE POLICY "Users can insert their household partners"
  ON partners FOR INSERT
  WITH CHECK (household_id = get_household_id_from_header());

CREATE POLICY "Users can update their household partners"
  ON partners FOR UPDATE
  USING (household_id = get_household_id_from_header());

-- RLS Policies for tasks
CREATE POLICY "Users can manage their household tasks"
  ON tasks FOR ALL
  USING (household_id = get_household_id_from_header());

-- RLS Policies for favorites
CREATE POLICY "Users can manage their household favorites"
  ON favorites FOR ALL
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE household_id = get_household_id_from_header()
    )
  );

-- RLS Policies for completions
CREATE POLICY "Users can manage their household completions"
  ON task_completions FOR ALL
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE household_id = get_household_id_from_header()
    )
  );

-- RLS Policies for points history
CREATE POLICY "Users can read their household points history"
  ON task_points_history FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks 
      WHERE household_id = get_household_id_from_header()
    )
  );

CREATE POLICY "Users can insert points history for their household"
  ON task_points_history FOR INSERT
  WITH CHECK (
    task_id IN (
      SELECT id FROM tasks 
      WHERE household_id = get_household_id_from_header()
    )
  );
