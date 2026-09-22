-- 039 verified framework topics and explicit pending coverage
-- Verified rows are only created from authoritative public curriculum pages.
-- All remaining level/subject combinations receive source_pending markers rather than fabricated content.

-- Cambridge Early Years: six curriculum areas from the official curriculum page.
-- IB MYP: eight subject groups; IB DP: six groups plus three core components;
-- IB CP: four core components plus career-related study.
-- England: official programme-of-study framework rows.
-- Production contains these verified rows plus source_pending coverage for remaining official-document extraction.

-- The curriculum-ingest Edge Function is the controlled route for committing additional
-- document-extracted records to lms_curriculum_topics with source_status='verified'.
