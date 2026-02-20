-- SQL Schema for Placement Pro

-- 1. Users table (Handles basic auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('student', 'tpo', 'alumni')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Students table (Profile details)
CREATE TABLE students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    roll_number TEXT UNIQUE NOT NULL,
    cgpa NUMERIC(3, 2),
    skills TEXT[], -- Array of skill strings
    resume_url TEXT,
    ats_score INTEGER DEFAULT 0,
    github_url TEXT,
    linkedin_url TEXT,
    branch TEXT,
    graduation_year INTEGER
);

-- 3. TPOs table
CREATE TABLE tpos (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE NOT NULL,
    department TEXT
);

-- 4. Drives table (Placement Drives)
CREATE TABLE drives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    role_description TEXT NOT NULL,
    job_description_url TEXT,
    min_cgpa NUMERIC(3, 2) DEFAULT 0.0,
    batch INTEGER NOT NULL,
    salary_package TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES tpos(id),
    status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active'
);

-- 5. Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES drives(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'shortlisted', 'rejected', 'selected')) DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, drive_id)
);

-- 6. Mentors table (Alumni)
CREATE TABLE mentors (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company TEXT,
    designation TEXT,
    expertise TEXT[],
    bio TEXT,
    is_available BOOLEAN DEFAULT TRUE
);

-- 7. Mentorship Slots
CREATE TABLE mentorship_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
    slot_time TIMESTAMP WITH TIME ZONE NOT NULL,
    student_id UUID REFERENCES students(id), -- Nullable if not booked
    status TEXT CHECK (status IN ('free', 'booked', 'completed')) DEFAULT 'free'
);
