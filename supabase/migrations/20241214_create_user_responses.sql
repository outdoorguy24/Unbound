-- Create user_responses table to store multiple responses over time
CREATE TABLE user_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to explain the table
COMMENT ON TABLE user_responses IS 'Stores user responses to "What have you replaced screen time with?" question';

-- Add comment to explain the columns
COMMENT ON COLUMN user_responses.user_id IS 'Reference to the user who submitted the response';
COMMENT ON COLUMN user_responses.response_text IS 'The users response text (max 100 words)';
COMMENT ON COLUMN user_responses.created_at IS 'When the response was submitted';

-- Create index for faster queries by user_id
CREATE INDEX idx_user_responses_user_id ON user_responses(user_id);

-- Create index for faster queries by created_at
CREATE INDEX idx_user_responses_created_at ON user_responses(created_at);

-- Enable Row Level Security
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own responses
CREATE POLICY "Users can insert their own responses" ON user_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own responses
CREATE POLICY "Users can view their own responses" ON user_responses
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to prevent users from updating or deleting responses
CREATE POLICY "Users cannot update responses" ON user_responses
    FOR UPDATE USING (false);

CREATE POLICY "Users cannot delete responses" ON user_responses
    FOR DELETE USING (false);
