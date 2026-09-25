# Germany Curriculum Implementation

## Architecture
Germany is represented as a federal curriculum layer: KMK common educational standards and frameworks are the national anchor, while the 16 Länder retain responsibility for concrete curricula. The implementation must therefore ingest and preserve state-specific curriculum versions rather than fabricate a single central syllabus.

## Live database layer
- 23 education levels/pathways from early childhood through primary, Sekundarstufe I, Sekundarstufe II, vocational education and tertiary progression.
- 31 subject catalogue mappings currently represented.
- 9 framework components covering KMK standards, Länder curricula, digital education, MINT, primary standards, lower-secondary standards, Abitur, VET and teacher development.
- 4 official source records and 4 provenance resources.
- 4,186 acquisition records queued for curriculum/resource ingestion.

## Resource model
Each level/subject acquisition path includes schemes of work, lessons, study notes, practice sets, assessments, revision guides, teacher guides, worked examples, audio scripts, video scripts, downloadable resources, interactive activities, simulations and virtual labs.

Simulation/virtual-lab resources are explicitly prioritised for appropriate MINT topics. Examples include evaporation, condensation, particle models, heat transfer, mechanics, electricity, waves, optics, chemical reactions, acids/bases, diffusion, osmosis, genetics, ecosystems, statistics, geometry and computational models. These are learning resources, not substitutes for official curriculum authority.

## Quality and provenance
Official curriculum content must be reconciled to the relevant KMK standard or authoritative Länder source before it becomes curriculum-authoritative. Generated teaching materials remain subject to the Phenom AI generation and IQA pipeline. The canonical Library remains super-admin controlled.

## Official anchors
- KMK Educational Standards: https://www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html
- KMK Länder curriculum index: https://www.kmk.org/downloads-dokumente/rechtsvorschriften-/-lehrplaene/uebersicht-lehrplaene.html
- Education in the Digital World: https://www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildung-in-der-digitalen-welt.html
- MINT subjects: https://www.kmk.org/bildungsministerkonferenz/vertiefende-bildungsinhalte/allgemeinbildende-schulen/mint-faecher.html
