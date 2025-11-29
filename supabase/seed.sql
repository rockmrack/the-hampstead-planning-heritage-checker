-- =====================================================
-- Sample Data for Development and Testing
-- =====================================================
-- This seed file contains sample data for:
-- - Listed Buildings in NW London
-- - Conservation Areas in Camden, Barnet, Westminster
-- - Article 4 Directions
-- =====================================================

-- Sample Listed Buildings (Hampstead and surrounding areas)
INSERT INTO listed_buildings (
    list_entry_number, name, grade, address_line_1, address_line_2, 
    town, postcode, borough, location, list_date
) VALUES
-- Grade I Listed
(
    '1113516',
    'Kenwood House',
    'I',
    'Hampstead Lane',
    NULL,
    'London',
    'NW3 7JR',
    'Camden',
    ST_SetSRID(ST_MakePoint(-0.1672, 51.5714), 4326),
    '1950-02-14'
),
(
    '1379736',
    'Fenton House',
    'I',
    'Hampstead Grove',
    NULL,
    'London',
    'NW3 6SP',
    'Camden',
    ST_SetSRID(ST_MakePoint(-0.1783, 51.5588), 4326),
    '1950-02-14'
),
-- Grade II* Listed
(
    '1379693',
    'Church Row Houses',
    'II*',
    '14-27 Church Row',
    'Hampstead',
    'London',
    'NW3 6UP',
    'Camden',
    ST_SetSRID(ST_MakePoint(-0.1792, 51.5562), 4326),
    '1950-02-14'
),
(
    '1379701',
    'Flask Walk Public House',
    'II*',
    '14 Flask Walk',
    'Hampstead',
    'London',
    'NW3 1HE',
    'Camden',
    ST_SetSRID(ST_MakePoint(-0.1782, 51.5580), 4326),
    '1972-09-27'
),
-- Grade II Listed
(
    '1379695',
    'Holly Bush Public House',
    'II',
    '22 Holly Mount',
    'Hampstead',
    'London',
    'NW3 6SG',
    'Camden',
    ST_SetSRID(ST_MakePoint(-0.1783, 51.5580), 4326),
    '1974-04-02'
),
(
    '1379742',
    'Admiral''s House',
    'II',
    'Admiral''s Walk',
    'Hampstead',
    'London',
    'NW3 6RS',
    'Camden',
    ST_SetSRID(ST_MakePoint(-0.1773, 51.5595), 4326),
    '1950-02-14'
),
(
    '1379688',
    'Burgh House',
    'II',
    'New End Square',
    'Hampstead',
    'London',
    'NW3 1LT',
    'Camden',
    ST_SetSRID(ST_MakePoint(-0.1759, 51.5565), 4326),
    '1950-02-14'
),
(
    '1264832',
    'Highgate Cemetery Chapel',
    'II',
    'Swain''s Lane',
    'Highgate',
    'London',
    'N6 6PJ',
    'Camden',
    ST_SetSRID(ST_MakePoint(-0.1468, 51.5673), 4326),
    '1971-08-10'
),
-- Barnet
(
    '1359287',
    'Hendon Hall',
    'II',
    'Ashley Lane',
    'Hendon',
    'London',
    'NW4 1HF',
    'Barnet',
    ST_SetSRID(ST_MakePoint(-0.2287, 51.5891), 4326),
    '1974-04-02'
),
(
    '1079123',
    'Avenue House',
    'II',
    '17 East End Road',
    'Finchley',
    'London',
    'N3 3QE',
    'Barnet',
    ST_SetSRID(ST_MakePoint(-0.1868, 51.5923), 4326),
    '1974-04-02'
),
-- Westminster (St John's Wood area)
(
    '1357642',
    'Lord''s Cricket Ground Pavilion',
    'II*',
    'St John''s Wood Road',
    NULL,
    'London',
    'NW8 8QN',
    'Westminster',
    ST_SetSRID(ST_MakePoint(-0.1729, 51.5294), 4326),
    '1997-11-04'
),
(
    '1066789',
    'Abbey Road Studios',
    'II',
    '3 Abbey Road',
    'St John''s Wood',
    'London',
    'NW8 9AY',
    'Westminster',
    ST_SetSRID(ST_MakePoint(-0.1783, 51.5320), 4326),
    '2010-02-23'
)
ON CONFLICT (list_entry_number) DO NOTHING;

-- Sample Conservation Areas
INSERT INTO conservation_areas (
    name, reference, borough, designation_date, boundary, 
    area_hectares, description, has_article_4, article_4_restrictions, article_4_date
) VALUES
(
    'Hampstead Conservation Area',
    'CA001',
    'Camden',
    '1967-01-01',
    ST_SetSRID(ST_GeomFromText('MULTIPOLYGON(((-0.1850 51.5520, -0.1850 51.5650, -0.1680 51.5650, -0.1680 51.5520, -0.1850 51.5520)))'), 4326),
    145.5,
    'Historic village of Hampstead including Flask Walk, Church Row, and the surrounding Georgian and Victorian residential areas.',
    TRUE,
    ARRAY['Front boundary walls', 'Front garden hardstanding', 'Roof materials', 'Windows and doors', 'Chimneys'],
    '1982-03-15'
),
(
    'Highgate Conservation Area',
    'CA002',
    'Camden',
    '1968-05-01',
    ST_SetSRID(ST_GeomFromText('MULTIPOLYGON(((-0.1520 51.5640, -0.1520 51.5720, -0.1380 51.5720, -0.1380 51.5640, -0.1520 51.5640)))'), 4326),
    89.3,
    'Historic village of Highgate with medieval origins, including Highgate Cemetery and surrounding Victorian villas.',
    TRUE,
    ARRAY['Front boundary treatments', 'Roof alterations', 'Window replacements'],
    '1985-07-22'
),
(
    'Belsize Conservation Area',
    'CA003',
    'Camden',
    '1972-11-01',
    ST_SetSRID(ST_GeomFromText('MULTIPOLYGON(((-0.1750 51.5440, -0.1750 51.5520, -0.1620 51.5520, -0.1620 51.5440, -0.1750 51.5440)))'), 4326),
    67.8,
    'Victorian and Edwardian residential area between Hampstead and Swiss Cottage.',
    TRUE,
    ARRAY['Front boundary walls', 'Hardstanding'],
    '1991-02-28'
),
(
    'Hampstead Garden Suburb Conservation Area',
    'CA001',
    'Barnet',
    '1968-03-01',
    ST_SetSRID(ST_GeomFromText('MULTIPOLYGON(((-0.1980 51.5780, -0.1980 51.5920, -0.1720 51.5920, -0.1720 51.5780, -0.1980 51.5780)))'), 4326),
    243.6,
    'Model suburb designed by Raymond Unwin and Barry Parker, featuring Arts and Crafts architecture.',
    TRUE,
    ARRAY['All external alterations', 'Extensions', 'Fences and walls', 'Hardstanding', 'Dormer windows', 'Satellite dishes', 'Solar panels'],
    '1970-01-01'
),
(
    'Golders Green Conservation Area',
    'CA002',
    'Barnet',
    '1988-09-01',
    ST_SetSRID(ST_GeomFromText('MULTIPOLYGON(((-0.2050 51.5720, -0.2050 51.5800, -0.1880 51.5800, -0.1880 51.5720, -0.2050 51.5720)))'), 4326),
    35.2,
    'Edwardian suburban development around Golders Green station.',
    FALSE,
    NULL,
    NULL
),
(
    'St John''s Wood Conservation Area',
    'CA045',
    'Westminster',
    '1969-07-01',
    ST_SetSRID(ST_GeomFromText('MULTIPOLYGON(((-0.1850 51.5280, -0.1850 51.5380, -0.1650 51.5380, -0.1650 51.5280, -0.1850 51.5280)))'), 4326),
    156.8,
    'Victorian villa development and the home of Lord''s Cricket Ground.',
    TRUE,
    ARRAY['Roof alterations', 'Front boundaries', 'Basement excavations'],
    '2005-09-30'
),
(
    'Maida Vale Conservation Area',
    'CA046',
    'Westminster',
    '1970-02-01',
    ST_SetSRID(ST_GeomFromText('MULTIPOLYGON(((-0.1920 51.5220, -0.1920 51.5300, -0.1780 51.5300, -0.1780 51.5220, -0.1920 51.5220)))'), 4326),
    78.4,
    'Late Victorian and Edwardian residential area with mansion blocks and canal-side properties.',
    FALSE,
    NULL,
    NULL
)
ON CONFLICT ON CONSTRAINT unique_borough_reference DO NOTHING;

-- Sample Article 4 Directions
INSERT INTO article_4_directions (
    conservation_area_id, name, reference, borough, 
    direction_date, confirmation_date, restrictions, description
)
SELECT 
    ca.id,
    'Hampstead Article 4 Direction',
    'A4/HAM/001',
    'Camden',
    '1982-03-15',
    '1982-09-15',
    '[
        {"class": "A", "part": "1", "description": "Enlargement, improvement or alteration of a dwelling"},
        {"class": "B", "part": "1", "description": "Additions to roofs"},
        {"class": "C", "part": "1", "description": "Any other alteration to the roof"},
        {"class": "D", "part": "1", "description": "Porches"},
        {"class": "E", "part": "1", "description": "Buildings incidental to dwelling"},
        {"class": "F", "part": "1", "description": "Hard surfaces"}
    ]'::jsonb,
    'Article 4 Direction removing permitted development rights for residential properties within the Hampstead Conservation Area.'
FROM conservation_areas ca
WHERE ca.name = 'Hampstead Conservation Area' AND ca.borough = 'Camden'
ON CONFLICT DO NOTHING;

-- Insert Hampstead Garden Suburb A4
INSERT INTO article_4_directions (
    conservation_area_id, name, reference, borough, 
    direction_date, confirmation_date, restrictions, description
)
SELECT 
    ca.id,
    'Hampstead Garden Suburb Article 4 Direction',
    'A4/HGS/001',
    'Barnet',
    '1970-01-01',
    '1970-06-01',
    '[
        {"class": "A", "part": "1", "description": "All enlargements and alterations"},
        {"class": "B", "part": "1", "description": "All roof additions"},
        {"class": "C", "part": "1", "description": "All roof alterations"},
        {"class": "D", "part": "1", "description": "Porches"},
        {"class": "E", "part": "1", "description": "All outbuildings"},
        {"class": "F", "part": "1", "description": "All hard surfaces"},
        {"class": "G", "part": "1", "description": "Chimneys and flues"},
        {"class": "H", "part": "1", "description": "Microwave antenna"}
    ]'::jsonb,
    'Comprehensive Article 4 Direction covering the entire Hampstead Garden Suburb, one of the most restrictive in London.'
FROM conservation_areas ca
WHERE ca.name = 'Hampstead Garden Suburb Conservation Area' AND ca.borough = 'Barnet'
ON CONFLICT DO NOTHING;

-- Create some sample search logs for analytics
INSERT INTO search_logs (
    search_address, search_postcode, latitude, longitude, location,
    status, is_listed, in_conservation_area, has_article_4, response_time_ms
) VALUES
(
    'Fenton House, Hampstead Grove, London',
    'NW3 6SP',
    51.5588,
    -0.1783,
    ST_SetSRID(ST_MakePoint(-0.1783, 51.5588), 4326),
    'RED',
    TRUE,
    TRUE,
    TRUE,
    145
),
(
    '45 Flask Walk, Hampstead, London',
    'NW3 1HJ',
    51.5575,
    -0.1780,
    ST_SetSRID(ST_MakePoint(-0.1780, 51.5575), 4326),
    'AMBER',
    FALSE,
    TRUE,
    TRUE,
    123
),
(
    '100 Abbey Road, St John''s Wood, London',
    'NW8 9AA',
    51.5310,
    -0.1795,
    ST_SetSRID(ST_MakePoint(-0.1795, 51.5310), 4326),
    'AMBER',
    FALSE,
    TRUE,
    TRUE,
    98
),
(
    '15 Cricklewood Lane, London',
    'NW2 1HP',
    51.5534,
    -0.2145,
    ST_SetSRID(ST_MakePoint(-0.2145, 51.5534), 4326),
    'GREEN',
    FALSE,
    FALSE,
    FALSE,
    87
);

-- Output confirmation
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully';
    RAISE NOTICE 'Listed Buildings: %', (SELECT COUNT(*) FROM listed_buildings);
    RAISE NOTICE 'Conservation Areas: %', (SELECT COUNT(*) FROM conservation_areas);
    RAISE NOTICE 'Article 4 Directions: %', (SELECT COUNT(*) FROM article_4_directions);
    RAISE NOTICE 'Sample Search Logs: %', (SELECT COUNT(*) FROM search_logs);
END $$;
