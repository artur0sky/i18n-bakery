# Changelog

All notable changes to this project will be documented in this file.

## [1.0.7] - 2025-12-19

### Added

- **@i18n-bakery/poacher**: Initial release of the "Poacher" migration tool.
    - Added `poach` command to migrate from `i18next` JSON structures to Bakery structure.
    - Added `scout` command to identify `t()` usage in source code via Regex.
    - Added `serve` command to export translations to CSV.
    - Implemented Translation Migration Logic:
        - `I18NextSource`: Adapter for reading legacy translation files.
        - `BakeryTarget`: Adapter for writing to Bakery-compatible folder structure.
        - `CsvExporter`: Adapter for exporting translation maps to CSV.
    - Implemented Backup system using `fs-extra` copy.
    - Implemented `ConsoleLogger` with `chalk` for philosophical bakery feedback.
