-- CitizenShield Database Schema for Supabase
-- This file contains the SQL commands to set up the database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS public.incidents (
    incident_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    recording_url TEXT,
    notes TEXT,
    shareable_card_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create state_legal_info table
CREATE TABLE IF NOT EXISTS public.state_legal_info (
    state_code TEXT PRIMARY KEY CHECK (LENGTH(state_code) = 2),
    state_name TEXT NOT NULL,
    rights_summary TEXT NOT NULL,
    do_say_script TEXT NOT NULL,
    dont_say_script TEXT NOT NULL,
    disclaimer TEXT NOT NULL,
    scenarios JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_incidents_user_id ON public.incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_incidents_timestamp ON public.incidents(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_location ON public.incidents(location_lat, location_lng) WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_state_legal_info_updated_at BEFORE UPDATE ON public.state_legal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_legal_info ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see and modify their own incidents
CREATE POLICY "Users can view own incidents" ON public.incidents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own incidents" ON public.incidents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own incidents" ON public.incidents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own incidents" ON public.incidents FOR DELETE USING (auth.uid() = user_id);

-- State legal info is readable by all authenticated users
CREATE POLICY "Authenticated users can view state legal info" ON public.state_legal_info FOR SELECT TO authenticated USING (true);

-- Insert initial state legal information
INSERT INTO public.state_legal_info (state_code, state_name, rights_summary, do_say_script, dont_say_script, disclaimer, scenarios) VALUES
('CA', 'California', 
 'In California, you have the right to remain silent, refuse searches without a warrant, and record police interactions in public. You must provide identification during a lawful detention. California has strong privacy protections and requires consent for recording private conversations.',
 '"I am exercising my right to remain silent."
"I do not consent to any searches."
"Am I free to leave?"
"I would like to speak with an attorney."
"I am recording this interaction for my safety."',
 'Don''t argue or resist physically
Don''t lie or provide false information
Don''t consent to searches
Don''t answer questions without an attorney present
Don''t interfere with the officer''s duties',
 'This information is for educational purposes only and does not constitute legal advice. Laws may change and situations vary. Consult with a qualified attorney for specific legal guidance.',
 '{"traffic_stop": {"rights": "During a traffic stop in California, you must provide your driver''s license, registration, and insurance. You have the right to remain silent beyond providing required documents.", "doSay": "Provide required documents politely. Ask \"Am I free to leave?\" if the stop seems prolonged.", "dontSay": "Don''t admit to speeding or other violations. Don''t consent to vehicle searches."}, "street_encounter": {"rights": "You have the right to walk away unless you''re being detained. Police need reasonable suspicion to detain you.", "doSay": "\"Am I being detained or am I free to go?\" If not detained, you may leave.", "dontSay": "Don''t run away or resist. Don''t provide information beyond what''s legally required."}}'
),
('NY', 'New York',
 'In New York, you have constitutional rights including the right to remain silent and refuse consent to searches. Stop-and-frisk requires reasonable suspicion. You may record police in public spaces. ID is required only during lawful arrests.',
 '"I am exercising my right to remain silent."
"I do not consent to searches."
"Am I being detained?"
"I want to speak with a lawyer."
"I am recording this interaction."',
 'Don''t resist or argue
Don''t consent to searches
Don''t answer questions without counsel
Don''t interfere with police duties
Don''t provide false information',
 'This information is for educational purposes only and does not constitute legal advice. Laws may change and situations vary. Consult with a qualified attorney for specific legal guidance.',
 '{"traffic_stop": {"rights": "Provide license, registration, and insurance when requested. You have the right to remain silent about other matters.", "doSay": "Be polite and provide required documents. Ask if you''re free to leave.", "dontSay": "Don''t admit fault or consent to vehicle searches."}, "stop_and_frisk": {"rights": "Police need reasonable suspicion to stop and frisk. You can ask why you''re being stopped.", "doSay": "\"Why am I being stopped?\" \"I do not consent to this search.\"", "dontSay": "Don''t resist physically. Don''t reach for anything without permission."}}'
),
('TX', 'Texas',
 'In Texas, you have the right to remain silent and refuse consent to searches. You must identify yourself if lawfully arrested. Texas is a "stop and identify" state - you must provide your name if detained with reasonable suspicion.',
 '"I am exercising my right to remain silent."
"I do not consent to any searches."
"Am I under arrest or free to go?"
"I want an attorney present."
"I am recording this interaction."',
 'Don''t resist arrest or detention
Don''t consent to searches
Don''t answer questions beyond identification
Don''t interfere with police work
Don''t provide false identification',
 'This information is for educational purposes only and does not constitute legal advice. Laws may change and situations vary. Consult with a qualified attorney for specific legal guidance.',
 '{"traffic_stop": {"rights": "Must provide driver''s license, registration, and insurance. Required to identify yourself if detained.", "doSay": "Provide required documents and identification when requested.", "dontSay": "Don''t admit to violations or consent to vehicle searches."}, "detention": {"rights": "Must provide your name if detained with reasonable suspicion. Can remain silent about other matters.", "doSay": "Provide your name if lawfully detained. Ask \"Am I free to leave?\"", "dontSay": "Don''t refuse to identify yourself if lawfully detained."}}'
),
('FL', 'Florida',
 'In Florida, you have the right to remain silent and refuse consent to searches. You must provide identification during lawful detention. Florida allows recording of police in public. Stop and frisk requires reasonable suspicion.',
 '"I invoke my right to remain silent."
"I do not consent to searches."
"Am I being detained?"
"I request an attorney."
"I am recording this encounter."',
 'Don''t resist or argue with officers
Don''t consent to searches
Don''t answer questions without a lawyer
Don''t interfere with police duties
Don''t provide false information',
 'This information is for educational purposes only and does not constitute legal advice. Laws may change and situations vary. Consult with a qualified attorney for specific legal guidance.',
 '{"traffic_stop": {"rights": "Must provide driver''s license, registration, and proof of insurance when requested.", "doSay": "Provide required documents politely. Ask if you''re free to leave when appropriate.", "dontSay": "Don''t admit to traffic violations or consent to vehicle searches."}, "public_encounter": {"rights": "You can record police in public spaces. You have the right to remain silent.", "doSay": "State that you''re recording. Ask if you''re being detained.", "dontSay": "Don''t interfere with police work while recording."}}'
)
ON CONFLICT (state_code) DO NOTHING;

-- Create functions for database setup (used by the application)
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
    -- This function is called by the application to ensure the users table exists
    -- The table creation is already handled above, so this is just a placeholder
    RAISE NOTICE 'Users table setup completed';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_incidents_table()
RETURNS void AS $$
BEGIN
    -- This function is called by the application to ensure the incidents table exists
    -- The table creation is already handled above, so this is just a placeholder
    RAISE NOTICE 'Incidents table setup completed';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_state_legal_info_table()
RETURNS void AS $$
BEGIN
    -- This function is called by the application to ensure the state_legal_info table exists
    -- The table creation is already handled above, so this is just a placeholder
    RAISE NOTICE 'State legal info table setup completed';
END;
$$ LANGUAGE plpgsql;

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (user_id, email, preferred_language, subscription_status)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en'), 'free');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE public.users IS 'Extended user profiles linked to Supabase auth.users';
COMMENT ON TABLE public.incidents IS 'User-recorded police interaction incidents';
COMMENT ON TABLE public.state_legal_info IS 'State-specific legal information and scripts';

COMMENT ON COLUMN public.incidents.location_lat IS 'Latitude coordinate of incident location';
COMMENT ON COLUMN public.incidents.location_lng IS 'Longitude coordinate of incident location';
COMMENT ON COLUMN public.incidents.recording_url IS 'IPFS URL of the recorded audio/video';
COMMENT ON COLUMN public.incidents.shareable_card_url IS 'IPFS URL of the generated shareable card';

COMMENT ON COLUMN public.state_legal_info.scenarios IS 'JSON object containing scenario-specific guidance';
