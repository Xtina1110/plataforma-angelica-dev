-- Migration: Add onboarding_completed field to profiles table
-- Date: 2025-10-10
-- Description: Adds field to track if user has completed the onboarding tour

-- Add onboarding_completed column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'onboarding_completed'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE 'Column onboarding_completed added to profiles table';
    ELSE
        RAISE NOTICE 'Column onboarding_completed already exists';
    END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_completed);

-- Update existing users to have onboarding completed (optional)
-- Uncomment if you want existing users to skip onboarding
-- UPDATE profiles SET onboarding_completed = TRUE WHERE created_at < NOW();

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name = 'onboarding_completed';

-- Show count of users by onboarding status
SELECT 
    onboarding_completed,
    COUNT(*) as user_count
FROM profiles
GROUP BY onboarding_completed;

